import json
import pathlib
import subprocess
import redis

redis_instance = redis.Redis()

class RunPACMan:
    def __init__(
        self,
        celery_task_id=None,
        main_test_cycle="",
        past_cycles=[],
        categorize_one_cycle="false",
        get_science_categories="false",
        compare_results_real="false",
        duplication_checker="false",
        categorize_ads_reviewers="false",
    ):
        self.commands = (
            "conda run -n pacman_linux --no-capture-output python run_pacman.py"
        )
        self.celery_task_id = celery_task_id
        self.outfile = open(f"run-{self.celery_task_id}.log", "wb")
        
        self.options = dict(
            main_test_cycle=main_test_cycle,
            past_cycles=past_cycles,
            categorize_one_cycle=categorize_one_cycle,
            get_science_categories=get_science_categories,
            compare_results_real=compare_results_real,
            duplication_checker=duplication_checker,
            categorize_ads_reviewers=categorize_ads_reviewers,
        )
        self.verify_pacman_directory()

    def verify_pacman_directory(self, alternate_pacman_path=None):
        file_path = pathlib.Path.cwd().resolve()
        pacman_path = file_path.parents[0]
        pacman_path = pacman_path / "PACMan"

        self.pacman_path = pacman_path
        if alternate_pacman_path is not None:
            self.pacman_path = alternate_pacman_path

        self.run_pacman_path = pacman_path / "run_pacman.py"

        if not self.pacman_path.is_dir():
            raise FileNotFoundError(f"PACMan directory not found at {pacman_path}")

        if not self.run_pacman_path.is_file():
            raise FileNotFoundError(f"run_pacman.py not found at {self.run_pacman_path}.")

    def verify_outputs(self):
        pass

    def parse_outputs(self):
        pass

    def modify_config(self):
        print(self.pacman_path)
        config_fpath = self.pacman_path / "config.json"
        with open(config_fpath, "r") as pacman_config:
            data = json.load(pacman_config)
        for key, value in self.options.items():
            data[key] = value
        with open(config_fpath, "w") as pacman_config:
            json.dump(data, pacman_config)
        

    def run(self):
        self.modify_config()
        self.commands = (
            "conda run -n pacman_linux --no-capture-output  python run_pacman.py"
        )
        # ! `shell=True` is only safe when the command being run is not tampered with
        # ! TODO: Get rid of shell=True
        self.proc = subprocess.Popen(
            self.commands,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            cwd=self.pacman_path,
            shell=True,
        )
        if self.proc.poll() is None:
            for line in iter(self.proc.stdout.readline, b""):
                print(line.decode(), end="")
                self.outfile.write(line)
                self.outfile.flush()
                redis_instance.xadd(f'process {self.celery_task_id} output', {"line": line})
                # redis_instance.publish(f'process {self.celery_task_id} output', line)
                # yield line
        redis_instance.xadd(f'process {self.celery_task_id} output', {"line": "PROCESS COMPLETE"})
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
