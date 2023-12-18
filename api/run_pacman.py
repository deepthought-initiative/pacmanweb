import sys
import pathlib
import subprocess


class RunPACMan:
    def __init__(self):
        self.commands = "conda run -n pacman_linux --no-capture-output  python run_pacman.py"
        self.outfile = open("run.log", "w")

    def verify_pacman_directory(self, pacman_path=None):
        file_path = pathlib.Path.cwd().resolve()
        parent_dir = file_path.parents[0]
        pacman_path = parent_dir / "PACMan"
        if pacman_path is None:
            self.pacman_path = parent_dir
        else: 
            self.pacman_path = pacman_path
        
        run_pacman_path = pacman_path / "run_pacman.py"

        if not pacman_path.is_dir():
            raise FileNotFoundError(f"PACMan directory not found at {parent_dir}")

        if not run_pacman_path.is_file():
            raise FileNotFoundError(f"run_pacman.py not found at {run_pacman_path}.")
        return pacman_path

    def verify_outputs(self):
        pass

    def parse_outputs(self):
        pass

    def execute(self):
        pacman_path = self.verify_pacman_directory()
        self.commands = "conda run -n pacman_linux --no-capture-output  python run_pacman.py"
        # ! `shell=True` is only safe when the command being run is not tampered with
        # ! TODO: Get rid of shell=True
        proc = subprocess.Popen(
                self.commands,
                stdin=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                stdout=subprocess.PIPE,
                cwd=pacman_path,
                text=True,
                shell=True 
            )
        for line in iter(proc.stdout.readline, b''):
            print(line, end="")
            self.outfile.write(line)
            self.outfile.flush()
            yield line
        proc.stdout.close()
        return_code = proc.wait()
        
        if proc.poll() is not None:
            self.outfile.close()

        if return_code != 0:
            raise subprocess.CalledProcessError(proc.returncode, proc.args)

    def run(self):
        output = self.execute()
        return output
