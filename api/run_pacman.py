import sys
import pathlib
import subprocess


class RunPACMan:
    def __init__(self):
        pass
    def verify_pacman_directory(self, pacman_path=None):
        file_path = pathlib.Path.cwd().resolve()
        parent_dir = file_path.parents[0]
        pacman_path = parent_dir/"PACMan"
        run_pacman_path = pacman_path/"run_pacman.py"
        
        if not pacman_path.is_dir():
            raise FileNotFoundError(f"PACMan directory not found at {parent_dir}")
        return pacman_path

    def verify_outputs(self):
        pass

    def parse_outputs(self):
        pass

    def run(self):
        pacman_path = self.verify_pacman_directory()
        commands="conda run -n pacman_linux python run_pacman.py"
        with open("test.log", "wb") as f:
            process = subprocess.Popen(
                commands.split(),
                stdin=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                stdout=subprocess.PIPE,
                cwd=pacman_path,
                text=True,
            )
            for line in iter(process.stdout.readline, b''):
                sys.stdout.write(line)
                f.write(line.encode())
        output, error = process.communicate()
        return output, error