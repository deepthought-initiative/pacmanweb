from . import celery_app
from .api.executor import RunPACMan
from celery import Task


class PACManTask(Task):
    def on_failure(self, exc, task_id, args, kwargs, einfo):
        print('{0!r} failed: {1!r}'.format(task_id, exc))
        

@celery_app.task(ignore_result=False, base=PACManTask, bind=True)
def pacman_task(self, options={}):
    task_id = self.request.id
    options["celery_task_id"] = task_id
    pacman_proc = RunPACMan(**options)
    output = pacman_proc.run()
    return output
