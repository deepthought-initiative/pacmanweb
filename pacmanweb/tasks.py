"""Celery task that runs PACMan."""
from celery import Task

from . import celery_app
from .api.executor import RunPACMan


class PACManTask(Task):
    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """
        Handle task failure.
        """
        print("{0!r} failed: {1!r}".format(task_id, exc))


@celery_app.task(ignore_result=False, base=PACManTask, bind=True)
def pacman_task(self, options={}):
    """
    Execute PACMan task.

    Parameters
    ----------
    options : dict, optional
        Options for running PACMan.

    Returns
    -------
    dict
        Output of the PACMan run.
    """
    task_id = self.request.id
    options["celery_task_id"] = task_id
    pacman_proc = RunPACMan(**options)
    output = pacman_proc.run()
    return output
