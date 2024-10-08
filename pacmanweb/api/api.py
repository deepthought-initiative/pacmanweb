"""Flask views for dealing with login/logout and orchestration of celery processes."""
import base64
import pathlib
import time
import pandas as pd

import redis
from celery.result import AsyncResult
from flask import (
    Blueprint,
    Response,
    flash,
    jsonify,
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

def allowed_file(filename):
    """
    Check if the given filename has an allowed extension.

    Parameters
    ----------
    filename : str
        The name of the file to check.

    Returns
    -------
    bool
        True if the file has an allowed extension, False otherwise.
    """
    result = (
        "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )
    return result

@api_bp.route("/login", methods=["POST"])
def login():
    """
    Handle user login via a POST request.

    This function authenticates users using either Basic Authentication from the 
    Authorization header or form-based authentication. If successful, it logs in 
    the user and returns their information.

    Returns
    -------
    dict
        JSON response containing user information (username and admin status) if 
        login is successful, or an error message if unauthorized.
    """
    user = None
    auth_header = request.headers.get("Authorization")
    if auth_header:
        encoded_auth = auth_header.replace("Basic ", "", 1)
        try:
            decoded_authb = base64.b64decode(encoded_auth)
            username, password = decoded_authb.decode("utf-8").split(":")
        except TypeError:
            pass
        user = User.get(username, password)
    elif request.form.get("creds", None):
        encoded_creds = request.form["creds"]
        decoded_creds = base64.b64decode(encoded_creds)
        username, password = decoded_creds.decode("utf-8").split(":")
        user = User.get(username, password)

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401
    else:
        login_user(user, remember=True)
        next = request.args.get("next")
        return jsonify({"username": username, "isadmin": user.isadmin()})

@api_bp.route("/logged_in", methods=["GET"])
def main_route():
    """
    Check if a user is currently logged in.

    Returns
    -------
    tuple
        A tuple containing a dictionary with the login status and an HTTP status code.
        
    Notes
    -----
    Status Codes:
    200 : User is logged in
    404 : User is not logged in
    """
    if current_user.is_authenticated:
         return {"value": "True"}, 200
    else:
         return {"value": "False"}, 404

@api_bp.route("/get_current_user", methods=["GET"])
@login_required
def get_current_user():
    """
    Retrieve information about the currently logged-in user.

    Returns
    -------
    tuple
        A tuple containing a JSON response with user information and an HTTP status code.

    Notes
    -----
    Status Codes:
    200 : User information retrieved successfully
    401 : User is not authenticated
    """
    if current_user.is_authenticated:
        response = {
            "username": current_user.username,
            "isadmin": current_user.isadmin()
        }
        return jsonify(response), 200
    else:
        return jsonify({"status": "not authenticated"}), 401


@api_bp.route("/logout", methods=["POST"])
def logout():
    """
    Log out the current user.

    Returns
    -------
    str
    """
    logout_user()
    return "Logout"


@api_bp.route("/get_cycles", methods=["GET"])
@login_required
def get_available_cycles():
    """
    Retrieve available valid/invalid PACMan cycles.

    Returns
    -------
    dict
    """
    return VerifyPACManDir().generate_response()


@api_bp.route("/run_pacman", methods=["GET", "POST"])
@login_required
def run_pacman():
    """
    Start a PACMan run with specified options.

    Returns
    -------
    tuple
        A tuple containing a dictionary with task id and an HTTP status code.

    Notes
    -----
    Status Codes:
    200 : Task started successfully
    429 : Task already running
    400 : Invalid options
    """
    options = request.args.to_dict(flat=True)
    panelist_names = options.pop('panelist_names', None)
    if not options.get("mode", None):
        return {"output": "Mode is required."}, 400
    if options.get("past_cycles", None):
        options["past_cycles"] = options["past_cycles"].split(",")
    if options.get("mode", None) == "DUP" and options.get("past_cycles", None) is None:
        return {
            "output": "DUP mode needs past cycles with the same cycle included.",
        }, 400
    # mode is always append for now
    if panelist_names:
        new_names = panelist_names.split(",")
        # remove strings with the same character repeated
        # remove leading and trailing whitespace
        new_names = [item.strip() for item in new_names]
        new_names = [item for item in new_names if len(set(item))>1]
        
        if not new_names:
            pass
        panelist_fname = f"{options['main_test_cycle']}_panelists.csv"
        panelist_fpath =Config.PANELISTS_DATA / panelist_fname
        panelists_data = pd.read_csv(panelist_fpath, header=None)
        existing_names = set(panelists_data[0])

        unique_new_names = [name for name in new_names if name not in existing_names]
        new_panelists = pd.concat([panelists_data, pd.DataFrame(unique_new_names)], ignore_index=True)
        new_panelists.to_csv(Config.PANELISTS_DATA / panelist_fname, index=False, header=False)
        
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
@login_required
def pacman_run_result(result_id):
    """
    Retrieve the result of a previous PACMan run.

    Parameters
    ----------
    result_id : str
        The ID of the task result to retrieve.

    Returns
    -------
    dict
        A dictionary containing the task status, success flag, and logs.
    """
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
    """
    Stream the output of a running PACMan task.

    Parameters
    ----------
    result_id : str
        The ID of the task to stream.

    Returns
    -------
    Response
        A Flask Response object that streams the task output as server-sent events.
    """
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
    """
    Terminate a running PACMan task.

    Parameters
    ----------
    result_id : str
        The ID of the task to terminate.

    Returns
    -------
    str
        A string indicating that the task has been terminated.
    """
    options = request.args.to_dict(flat=True)
    mode = options.get("mode", None)
    if mode is None:
        return {"output": "Mode is required."}
    task = AsyncResult(result_id, app=celery_app)
    task.revoke(terminate=True)
    # delete this task from the task list so that new task can be added
    redis_instance.hdel(current_user.username, mode)
    return f"Task {result_id} terminated"




@api_bp.route("/upload", methods=["POST"])
@login_required
def upload_zip():
    """
    Handle the upload of a zip file.

    This function checks if the uploaded file is valid, saves it,
    and moves its contents to the appropriate location.

    Returns
    -------
    dict
        A dictionary containing a response message indicating the result of the upload.
    """
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