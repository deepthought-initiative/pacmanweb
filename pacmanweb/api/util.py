import shutil
from collections import defaultdict

from pacmanweb import Config


def clean_previous_runs():
    pacman_path = Config.PACMAN_PATH
    runs_dir = pacman_path / "runs"
    valid_names = ["discard", "input_proposal_data", "input_panelist_data", "logs"]
    for child in runs_dir.iterdir():
        if child.stem not in valid_names:
            shutil.rmtree(child)


class VerifyPACManDir:
    def __init__(self, alt_pacman_path=None):
        self.pacman_path = alt_pacman_path if alt_pacman_path is not None else Config.PACMAN_PATH
        self.runs_dir = self.pacman_path / "runs"
        self.proposal_directory = self.runs_dir / "input_proposal_data"
        self.panelist_directory = self.runs_dir / "input_panelist_data"
        self.models_dir = self.pacman_path / "models"
        self.result = defaultdict(list)

    def verify_directory(self, directory, key, file_extension=None):
        if directory.is_dir():
            for item in directory.iterdir():
                if key=="proposal_cycles":
                    if item.is_dir():
                        self.result[key].append(item.stem)
                    else:
                        self.result[f"{key}_extra_files"].append(item.name)
                    continue

                if not item.name.endswith(file_extension):
                    self.result[f"{key}_extra_files"].append(item.name)
                else:
                    fname = item.name if key=="models" else item.stem.split("_")[0]
                    self.result[key].append(fname)
        else:
            self.result[key] = f"No {key} directory found in {str(directory)}"
            self.result[f"{key}_extra_files"] = []

    def verify_proposals_dir(self):
        self.verify_directory(self.proposal_directory, "proposal_cycles", file_extension=None)

    def verify_panelist_dir(self):
        self.verify_directory(self.panelist_directory, "panelist_cycles", file_extension="panelists.csv")

    def verify_model_dir(self):
        self.verify_directory(self.models_dir, "models", file_extension=".joblib")
    
    def generate_response(self):
        self.verify_model_dir()
        self.verify_panelist_dir()
        self.verify_proposals_dir()
        return self.result

class MoveUploadedFiles:
    def __init__(self) -> None:
        pass
    