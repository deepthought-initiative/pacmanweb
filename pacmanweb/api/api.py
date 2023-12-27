import pathlib
import subprocess

from celery import shared_task
from celery.result import AsyncResult
from flask import Blueprint, request, stream_with_context
from flask_login import login_required

from .. import celery_app
from ..tasks import pacman_task

api_bp = Blueprint("api", __name__, url_prefix="/api")


@api_bp.route("/run_pacman", methods=["GET", "POST"])
@login_required
def run_pacman():
    result = pacman_task.delay()
    return f"PACMan running with task id {result.id}"


@api_bp.route("/prev_runs/<result_id>", methods=["GET"])
def pacman_run_result(result_id):
    print(result_id)
    result = AsyncResult(result_id, app=celery_app)

    return {
        "ready": result.ready(),
        "successful": result.successful(),
        "value": result.result if result.ready() else None,
    }


# @api_bp.route("/run_pacman/stream/<pid>", methods=["GET", "POST"])
# @login_required
# def run_pacman():
#     # pacman_proc = RunPACMan()
#     # output = pacman_proc.run()
#     return stream_with_context(output)
