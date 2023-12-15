import sys
import pathlib
import subprocess


class RunPACMan:
    def __init__(self):
        pass

    def verify_pacman_directory(self, pacman_path=None):
        file_path = pathlib.Path.cwd().resolve()
        parent_dir = file_path.parents[0]
        pacman_path = parent_dir / "PACMan"
        run_pacman_path = pacman_path / "run_pacman.py"

        if not pacman_path.is_dir():
            raise FileNotFoundError(f"PACMan directory not found at {parent_dir}")
        return pacman_path

    def verify_outputs(self):
        pass

    def parse_outputs(self):
        pass

    def execute(self):
        pacman_path = self.verify_pacman_directory()
        commands = "conda run -n pacman_linux --no-capture-output  python run_pacman.py"
        # ! `shell=True` is only safe when the command being run is not tampered with
        # ! TODO: Get rid of shell=True
        with open("test.log", "wb") as f:
                proc = subprocess.Popen(
                        commands,
                        stdin=subprocess.PIPE,
                        stderr=subprocess.STDOUT,
                        stdout=subprocess.PIPE,
                        cwd=pacman_path,
                        text=True,
                        shell=True 
                    )
                for line in iter(proc.stdout.readline, b''):
                    print(line, end="")
                    f.write(line.encode())
        if proc.returncode != 0:
            raise subprocess.CalledProcessError(proc.returncode, proc.args)

    def run(self):
        return
