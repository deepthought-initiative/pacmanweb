import json
import os
import subprocess

import redis

from pacmanweb import Config

redis_instance = redis.from_url(Config.CELERY_RESULT_BACKEND)


class RunPACMan:
    """Run PACMan."""

    def __init__(
        self,
        run_name=None,
        celery_task_id=None,
        main_test_cycle="",
        past_cycles=[],
        mode=None,
        runs_dir="",
        modelfile="strolger_pacman_model_7cycles.joblib",
        assignment_number_top_reviewers=5,
        close_collaborator_time_frame=3,
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
        if run_name is None:
            run_name = self.celery_task_id
            reuse_run = "false"
        else:
            reuse_run = "true"

        if runs_dir == "":
            runs_dir = "./runs"

        proc_options = [
            "categorize_one_cycle",
            "get_science_categories",
            "compare_results_real",
            "duplication_checker",
            "categorize_ads_reviewers",
            "cross_validate",
        ]
        options = {item: "false" for item in proc_options}
        assignment_number_top_reviewers = int(assignment_number_top_reviewers)
        close_collaborator_time_frame = int(close_collaborator_time_frame)

        options = options | dict(
            run_name=run_name,
            reuse_run=reuse_run,
            main_test_cycle=main_test_cycle,
            past_cycles=past_cycles,
            runs_dir=runs_dir,
            modelfile=modelfile,
            assignment_number_top_reviewers=assignment_number_top_reviewers,
            close_collaborator_time_frame=close_collaborator_time_frame,
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
                "categorize_one_cycle": "true",
                "get_science_categories": "true",
                "compare_results_real": "true",
            }

        if mode == "ALL":
            mode_options = {item: "true" for item in proc_options}

        options = options | mode_options
        self.options = options

        self.flask_config = Config()
        self.pacman_path = self.flask_config.PACMAN_PATH
        outfile_fpath = (
            self.flask_config.ROOTDIR / f"logs/run-{self.celery_task_id}.log"
        )
        self.outfile = open(outfile_fpath, "wb")

        self.TEST_ADS_API_KEY = self.flask_config.TEST_ADS_API_KEY
        self.ENV_NAME = self.flask_config.ENV_NAME
        self.commands = self.flask_config.SUBPROCESS_COMMANDS
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
        stdout_str = ""

        self.proc = subprocess.Popen(
            self.commands,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            cwd=self.pacman_path,
            shell=True,
            env=env,
        )
        redis_instance.xadd(
                    f"process {self.celery_task_id} output", {"line": "STARTING RUN"}
                )
        if self.proc.poll() is None:
            for line in iter(self.proc.stdout.readline, b""):
                print(line.decode(), end="")
                self.outfile.write(line)
                self.outfile.flush()
                redis_instance.xadd(
                    f"process {self.celery_task_id} output", {"line": line}
                )
                stdout_str+=line.decode()
        redis_instance.xadd(
            f"process {self.celery_task_id} output", {"line": "PROCESS COMPLETE"}
        )
        self.proc.stdout.close()
        self.proc.stdin.close()
        self.proc_return_code = self.proc.wait()
        self.outfile.close()

        if self.proc_return_code != 0:
            raise subprocess.CalledProcessError(self.proc.returncode, self.proc.args)
        return {"return_code": self.proc_return_code, "std_out": stdout_str}

    @property
    def pacman_status(self):
        if self.proc.poll is not None:
            # the process is complete
            return f"PACMan run completed with return code {self.proc.returncode}"
        else:
            #  pid is the process ID of the spawned shell
            return f"PACMan is currently running with process id {self.proc.pid}"
