import os
import json
import subprocess
import pathlib

import redis
from pacmanweb import config

redis_instance = redis.Redis()

class RunPACMan:
    """Run PACMan."""
    def __init__(
        self,
        run_name=None,
        celery_task_id=None,
        main_test_cycle="",
        past_cycles=[],
        mode=None,
        runs_dir=""
    ):
        """Initialise RunPACMan Class.

        Parameters
        ----------
        run_name : str, optional
            by default None
        celery_task_id : str, optional
            by default None
        main_test_cycle : str, optional
            by default ""
        past_cycles : list, optional
            by default []
        mode : str, optional
            by default None
        runs_dir : str, optional
            by default ""
        """
        self.celery_task_id = celery_task_id
        self.outfile = open(f"logs/run-{self.celery_task_id}.log", "wb")
        if run_name is None:
            run_name = self.celery_task_id
            reuse_run = "false"
        else:
            reuse_run = "true"

        self.ENV_NAME = config.ENV_NAME
        self.TEST_ADS_API_KEY = config.TEST_ADS_API_KEY
        
        if runs_dir == "":
            runs_dir = "./runs"

        options = [
            "categorize_one_cycle",
            "get_science_categories",
            "compare_results_real",
            "duplication_checker",
            "categorize_ads_reviewers",
            "cross_validate",
        ]
        options = {item: "false" for item in options}
        options = options | dict(
            run_name=run_name,
            reuse_run=reuse_run,
            main_test_cycle=main_test_cycle,
            past_cycles=past_cycles,
            runs_dir=runs_dir
        )

        if mode == "PROP":
            mode_options = {
                "categorize_one_cycle": "true",
                "get_science_categories": "true",
                "compare_results_real": "true",
            }

        if mode == "DUP":
            mode_options = {"duplication_checker": "true"}

        if mode == "MATCH":
            mode_options = {
                "categorize_ads_reviewers": "true",
            }

        options = options | mode_options

        self.commands = (
            f"conda run -n {self.ENV_NAME} --no-capture-output  python run_pacman.py"
        )

        self.options = options
        self.pacman_path = config.PACMAN_PATH
        self.verify_pacman_directory()

    def verify_pacman_directory(self, alternate_pacman_path=None):
        if alternate_pacman_path is not None:
            self.pacman_path = alternate_pacman_path

        self.run_pacman_path = self.pacman_path / "run_pacman.py"

        if not self.pacman_path.is_dir():
            raise FileNotFoundError(f"PACMan directory not found at {self.pacman_path}")

        if not self.run_pacman_path.is_file():
            raise FileNotFoundError(
                f"run_pacman.py not found at {self.run_pacman_path}."
            )
        

    def verify_outputs(self):
        pass

    def parse_outputs(self):
        pass

    def modify_config(self):
        config_fpath = self.pacman_path / "config.json"
        with open(config_fpath, "r") as pacman_config:
            data = json.load(pacman_config)
        for key, value in self.options.items():
            data[key] = value
        with open(config_fpath, "w") as pacman_config:
            json.dump(data, pacman_config)

    def run(self):
        self.modify_config()
        # ! `shell=True` is only safe when the command being run is not tampered with
        # ! TODO: Get rid of shell=True
        env = os.environ.copy()
        env["ADS_DEV_KEY"] = self.TEST_ADS_API_KEY
        
        self.proc = subprocess.Popen(
            self.commands,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            cwd=self.pacman_path,
            shell=True,
            env=env
        )
        if self.proc.poll() is None:
            for line in iter(self.proc.stdout.readline, b""):
                print(line.decode(), end="")
                self.outfile.write(line)
                self.outfile.flush()
                redis_instance.xadd(
                    f"process {self.celery_task_id} output", {"line": line}
                )
        redis_instance.xadd(
            f"process {self.celery_task_id} output", {"line": "PROCESS COMPLETE"}
        )
        self.proc.stdout.close()
        self.proc.stdin.close()
        self.proc_return_code = self.proc.wait()
        self.outfile.close()

        if self.proc_return_code != 0:
            raise subprocess.CalledProcessError(self.proc.returncode, self.proc.args)
        return {"return_code": self.proc_return_code}

    @property
    def pacman_status(self):
        if self.proc.poll is not None:
            # the process is complete
            return f"PACMan run completed with return code {self.proc.returncode}"
        else:
            #  pid is the process ID of the spawned shell
            return f"PACMan is currently running with process id {self.proc.pid}"
