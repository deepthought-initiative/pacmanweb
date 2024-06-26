import base64
import pathlib
import subprocess
import time
import pandas as pd

import redis
from celery import shared_task
from celery.result import AsyncResult
from flask import (
    Blueprint,
    Response,
    flash,
    g,
    json,
    jsonify,
    redirect,
    request,
    stream_with_context,
)
from flask_login import current_user, login_required, login_user, logout_user
from werkzeug.utils import secure_filename

from pacmanweb import Config
from pacmanweb.tasks import pacman_task

from .. import celery_app
from ..auth.models import *
from .util import MoveUploadedFiles, VerifyPACManDir

ALLOWED_EXTENSIONS = {"zip"}

api_bp = Blueprint("api", __name__, url_prefix="/api")
redis_instance = redis.from_url(Config.CELERY_RESULT_BACKEND)


@api_bp.route("/login", methods=["GET", "POST"])
def login():
    encoded_creds = request.form["creds"]
    decoded_creds = base64.b64decode(encoded_creds)
    username, password = decoded_creds.decode("utf-8").split(":")

    user = User.get(username=username, password=password)
    if user is None:
        return jsonify({"error": "Unauthorized"}), 401
    else:
        login_user(user, remember=True)
        next = request.args.get("next")
        return jsonify({"username": username, "password": password})


@api_bp.route("/signup")
def signup():
    return "Signup"


@api_bp.route("/logout", methods=["POST"])
def logout():
    logout_user()
    return "Logout"


@api_bp.route("/get_cycles", methods=["GET"])
@login_required
def get_available_cycles():
    return VerifyPACManDir().generate_response()


@api_bp.route("/run_pacman", methods=["GET", "POST"])
@login_required
def run_pacman():
    options = request.args.to_dict(flat=True)
    panelist_names_mode = options.pop("panelist_names_mode", "")
    if options.get("mode", None):
        pass
    else:
        return {"output": "Mode is required."}
    if options.get("past_cycles", None):
        options["past_cycles"] = options["past_cycles"].split(",")
    if options.get("mode", None) == "DUP" and options.get("past_cycles", None) is None:
        return {
            "output": "DUP mode needs past cycles with the same cycle included.",
        }
    
    if options["mode"] == "MATCH" and panelist_names_mode == "append": 
        panelist_names = options.pop('panelist_names', []).split(',')
        panelist_names = [item for item in panelist_names if item not in [""] and len(item)!=0 and set(item)!=1]
        panelist_file_name = f"{options['main_test_cycle']}_panelists.csv"
        complete_panelist_file_path =Config.PANELISTS_DATA / panelist_file_name
        panelists_data = pd.read_csv(complete_panelist_file_path)
        if len(panelist_names) != 0:
            new_panelists_df = pd.DataFrame(panelist_names, columns=['name'])
            merged_panelists_data = pd.concat([panelists_data, new_panelists_df], ignore_index=True)
            updated_panelists_data = merged_panelists_data.drop_duplicates(subset='name', keep='first')
            updated_panelists_data.to_csv(complete_panelist_file_path, index=False)

    options["current_user"] = current_user.username
    # if task is already running don't run another
    existing_tasks = redis_instance.hgetall(current_user.username)
    if options.get("mode").encode("ascii") not in existing_tasks.keys():
        result = pacman_task.delay(options=options)
        redis_instance.hset(current_user.username, options.get("mode"), result.id)
        return {
            "output": f"PACMan running with task id {result.id}",
            "result_id": f"{result.id}",
        }, 200
    else:
        # if you get a result id here it means the task is still running
        result_id = redis_instance.hget(
            current_user.username, options.get("mode")
        ).decode("ascii")
        return {
            "output": f"PACMan already running with task id {result_id}. New task not started.",
            "result_id": f"{result_id}",
        }, 429


@api_bp.route("/prev_runs/<result_id>", methods=["GET"])
def pacman_run_result(result_id):
    task_status = AsyncResult(result_id, app=celery_app)
    result = task_status.result if task_status.ready() else None
    if task_status.ready():
        logs_dirpath = Config.ROOTDIR / "logs"
        log_fpath = logs_dirpath / f"run-{result_id}.log"
        with open(log_fpath, "rb") as f:
            result = f.read().decode("utf-8")
    return {
        "ready": task_status.ready(),
        "successful": task_status.successful(),
        "value": result,
    }


@api_bp.route("/stream/<result_id>", methods=["GET"])
@login_required
def stream_task(result_id):
    def generate():
        while True:
            stream_content = redis_instance.xread(
                streams={f"process {result_id} output": 0}
            )
            if not stream_content:
                continue
            for streams in stream_content:
                stream_name, messages = streams
                [redis_instance.xdel(stream_name, i[0]) for i in messages]
            data = ""
            for item in stream_content[0][1]:
                line = item[1].get(b"line")
                data += line.decode("utf-8")

            for line in data.split("\n"):
                yield f"data: {line}\n"
            yield "\n\n"
            if "PROCESS COMPLETE" in data or "run complete" in data:
                print(data)
                # give the frontend a few seconds to disconnect cleanly
                time.sleep(3)
                break

    return Response(
        stream_with_context(generate()),
        mimetype="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@api_bp.route("/terminate/<result_id>", methods=["POST"])
@login_required
def stop_task(result_id):
    options = request.args.to_dict(flat=True)
    mode = options.get("mode", None)
    if mode is None:
        return {"output": "Mode is required."}
    task = AsyncResult(result_id, app=celery_app)
    task.revoke(terminate=True)
    # delete this task from the task list so that new task can be added
    redis_instance.hdel(current_user.username, mode)
    return f"Task {result_id} terminated"


def allowed_file(filename):
    result = (
        "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )
    print(result)
    return result


@api_bp.route("/upload", methods=["POST"])
@login_required
def upload_zip():
    if "file" not in request.files:
        flash("No file part")
        return {"response": "no file part"}
    file = request.files["file"]
    if file.filename == "":
        flash("No selected file")
        return {"response": "no selected file"}
    if file and allowed_file(file.filename):
        # do not remove this
        filename = secure_filename(file.filename)
        file.save(pathlib.Path(Config.UPLOAD_FOLDER) / filename)
        MoveUploadedFiles(str(filename)).move_items()
        return {"response": "file saved sucessfully"}