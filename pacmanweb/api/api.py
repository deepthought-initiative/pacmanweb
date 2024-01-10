import pathlib
import subprocess

from celery import shared_task
from celery.result import AsyncResult
from flask import Blueprint, request, stream_with_context, g
from flask_login import login_required
import redis


from .. import celery_app
from ..tasks import pacman_task

api_bp = Blueprint("api", __name__, url_prefix="/api")
redis_instance = redis.Redis()


@api_bp.route("/run_pacman", methods=["GET", "POST"])
@login_required
def run_pacman():
    options = request.args.to_dict(flat=True)
    options["past_cycles"] = options["past_cycles"].split(",")
    result = pacman_task.delay(options=options)
    return f"PACMan running with task id {result.id}"


@api_bp.route("/prev_runs/<result_id>", methods=["GET"])
def pacman_run_result(result_id):
    task_status = AsyncResult(result_id, app=celery_app)
    result = task_status.result if task_status.ready() else None
    if task_status.ready():
        with open(f"run-{result_id}.log", "rb") as f:
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
            stream_content = redis_instance.xread(streams={f"process {result_id} output": 0})
            if not stream_content:
                continue
            for streams in stream_content:
                stream_name, messages = streams
                [ redis_instance.xdel( stream_name, i[0] ) for i in messages ]
            data = ""
            for item in stream_content[0][1]:
                line = item[1].get(b'line')
                data += line.decode('utf-8')
            yield data
            if "PROCESS COMPLETE" in data or "run complete" in data:
                break
    return stream_with_context(generate())
