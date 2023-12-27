from . import celery_app
from .api.executor import RunPACMan


@celery_app.task(ignore_result=False)
def pacman_task():
    pacman_proc = RunPACMan()
    output = pacman_proc.run()
    return output
