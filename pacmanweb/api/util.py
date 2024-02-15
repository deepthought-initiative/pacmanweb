import shutil
from collections import defaultdict
import zipfile

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
        self.pacman_path = (
            alt_pacman_path if alt_pacman_path is not None else Config.PACMAN_PATH
        )
        self.runs_dir = self.pacman_path / "runs"
        self.proposal_directory = self.runs_dir / "input_proposal_data"
        self.panelist_directory = self.runs_dir / "input_panelist_data"
        self.models_dir = self.pacman_path / "models"
        self.result = defaultdict(list)

    def verify_directory(self, directory, key, file_extension=None):
        if directory.is_dir():
            for item in directory.iterdir():
                if key == "proposal_cycles":
                    if item.is_dir():
                        self.result[key].append(item.stem)
                    else:
                        self.result[f"{key}_extra_files"].append(item.name)
                    continue

                if not item.name.endswith(file_extension):
                    self.result[f"{key}_extra_files"].append(item.name)
                else:
                    fname = item.name if key == "models" else item.stem.split("_")[0]
                    self.result[key].append(fname)
        else:
            self.result[key] = f"No {key} directory found in {str(directory)}"
            self.result[f"{key}_extra_files"] = []

    def verify_proposals_dir(self):
        self.verify_directory(
            self.proposal_directory, "proposal_cycles", file_extension=None
        )

    def verify_panelist_dir(self):
        self.verify_directory(
            self.panelist_directory, "panelist_cycles", file_extension="panelists.csv"
        )

    def verify_model_dir(self):
        self.verify_directory(self.models_dir, "models", file_extension=".joblib")

    def generate_response(self):
        self.verify_model_dir()
        self.verify_panelist_dir()
        self.verify_proposals_dir()
        return self.result


class MoveUploadedFiles:
    def __init__(self, filename) -> None:
        self.fname = Config.UPLOAD_FOLDER / filename
        self.extract_directory = Config.UPLOAD_FOLDER / f"extracted_{self.fname.stem}"
        with zipfile.ZipFile(self.fname, "r") as zip_ref:
            zip_ref.extractall(self.extract_directory)
        self.proposal_directory = Config.PACMAN_PATH / "runs" / "input_proposal_data"
        self.proposal_directory.mkdir(parents=True, exist_ok=True)
        self.panelist_directory = Config.PACMAN_PATH / "runs" / "input_panelist_data"
        self.panelist_directory.mkdir(parents=True, exist_ok=True)
        self.models_directory = Config.PACMAN_PATH / "models"
        self.valid_model_fname_suffix = {".joblib", ".npy"}

    def move_proposals(self, proposal_dir):
        for item in proposal_dir.iterdir():
            # this assumes item is a folder with the cycle name
            # containing all the proposal files of that cycle
            if not item.is_dir():
                continue
            
            dest_fpath = self.proposal_directory / item.name 
            if not dest_fpath.exists():
                dest_fpath.mkdir(parents=True, exist_ok=True)
                
            for subitem in item.iterdir():
                if subitem.is_file() and subitem.name.endswith(".txtx"):
                    # subitem.replace(self.proposal_directory / item.name / subitem.name)
                    shutil.move(str(subitem), str(dest_fpath / subitem.name))



    def move_panelists_and_models(self, dir_=None, file=None):
        if file and any(
            file.name.endswith(suffix) for suffix in self.valid_model_fname_suffix
        ):
            shutil.move(str(file), str(self.models_directory / file.name))

        if file and file.name.endswith("_panelists.csv"):
            shutil.move(str(file), str(self.panelist_directory / file.name))

        if dir_:
            for item in dir_.iterdir():
                self.move_panelists_and_models(file=item)

    def move_items(self):
        for item in (self.extract_directory / f"{self.fname.stem}").iterdir():
            if item.is_dir():
                if "proposal" in item.stem:
                    self.move_proposals(item)
                else:
                    self.move_panelists_and_models(dir_=item)
            if item.is_file():
                self.move_panelists_and_models(file=item)
