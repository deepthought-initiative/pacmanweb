"""Utility classes."""
import os
import shutil
from collections import defaultdict
import zipfile

from pacmanweb import Config


def clean_previous_runs():
    """
    Clean up previous PACMan runs.

    This function removes all directories in the runs folder except for
    'discard', 'input_proposal_data', 'input_panelist_data', and 'logs'.

    Notes
    -----
    This function directly modifies the file system and should be used with caution.
    """
    pacman_path = Config.PACMAN_PATH
    runs_dir = pacman_path / "runs"
    valid_names = ["discard", "input_proposal_data", "input_panelist_data", "logs"]
    for child in runs_dir.iterdir():
        if child.stem not in valid_names:
            shutil.rmtree(child)


class VerifyPACManDir:
    """
    Verify the structure and contents of the PACMan directory.

    This class checks the presence and validity of proposal cycles, panelist data,
    and model files in the PACMan directory structure.

    Attributes
    ----------
    pacman_path : pathlib.Path
        Path to the PACMan directory.
    runs_dir : pathlib.Path
        Path to the 'runs' subdirectory.
    proposal_directory : pathlib.Path
        Path to the 'input_proposal_data' subdirectory.
    panelist_directory : pathlib.Path
        Path to the 'input_panelist_data' subdirectory.
    models_dir : pathlib.Path
        Path to the 'models' subdirectory.
    result : defaultdict
        Dictionary to store verification results.

    Methods
    -------
    verify_directory(directory, key, file_extension=None)
        Verify the contents of a specific directory.
    verify_proposals_dir()
        Verify the structure and contents of the proposals directory.
    verify_panelist_dir()
        Verify the structure and contents of the panelist directory.
    verify_model_dir()
        Verify the structure and contents of the models directory.
    generate_response()
        Generate dict containing cycle structure and available PACMan files.
    """
    def __init__(self, alt_pacman_path=None):
        self.pacman_path = (
            alt_pacman_path if alt_pacman_path is not None else Config.PACMAN_PATH
        )
        self.runs_dir = self.pacman_path / "runs"
        self.proposal_directory = self.runs_dir / "input_proposal_data"
        self.panelist_directory = self.runs_dir / "input_panelist_data"
        self.models_dir = self.pacman_path / "models"
        self.result = defaultdict(list)
        self.result["proposal_cycles_invalid"] = set()
        self.result["proposal_cycles_valid"] = set()

    def verify_directory(self, directory, key, file_extension=None):
        """
        Verify the contents of a specific directory.

        Parameters
        ----------
        directory : pathlib.Path
            The directory to verify.
        key : str
            The key to use in the result dictionary.
        file_extension : str, optional
            The expected file extension for valid files.
        """
        if directory.is_dir():
            for item in directory.iterdir():
                if key == "proposal_cycles":
                    if item.is_dir():
                        self.result[key].append(item.stem)
                        for subitem in item.iterdir():
                            subitem_valid = (
                                subitem.is_file()
                                and subitem.name.endswith(".txtx")
                                and len(subitem.stem) == 5
                            )
                            if not subitem_valid:
                                self.result["proposal_cycles_invalid"].add(item.name)
                            if subitem_valid:
                                self.result["proposal_cycles_valid"].add(item.name)
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
        """
        Verify the structure and contents of the proposals directory.
        """
        self.verify_directory(
            self.proposal_directory, "proposal_cycles", file_extension=None
        )
        # if a directory is invalid it can't be valid
        self.result["proposal_cycles_valid"] = (
            self.result["proposal_cycles_valid"]
            - self.result["proposal_cycles_invalid"]
        )
        self.result["proposal_cycles_invalid"] = list(
            self.result["proposal_cycles_invalid"]
        )
        self.result["proposal_cycles_valid"] = list(
            self.result["proposal_cycles_valid"]
        )

    def verify_panelist_dir(self):
        """
        Verify the structure and contents of the panelist directory.
        """
        self.verify_directory(
            self.panelist_directory, "panelist_cycles", file_extension="panelists.csv"
        )

    def verify_model_dir(self):
        """
        Verify the structure and contents of the models directory.
        """
        self.verify_directory(self.models_dir, "models", file_extension=".joblib")

    def generate_response(self):
        """
        Generate dict containing cycle structure and available PACMan files.

        Returns
        -------
        dict
        """
        self.verify_model_dir()
        self.verify_panelist_dir()
        self.verify_proposals_dir()
        return self.result


class MoveUploadedFiles:
    """
    Handle the extraction and organization of uploaded zip files.

    This class extracts the contents of an uploaded zip file and moves
    the relevant files to their appropriate locations in the PACMan directory structure.

    Methods
    -------
    move_proposals(proposal_dir)
        Move proposal files to the appropriate directory.
    move_panelists_and_models(dir_=None, file=None)
        Move panelist and model files to their respective directories.
    move_items()
        Orchestrate the movement of all extracted files to their correct locations.
    """
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
        """
        Move proposal files to the appropriate directory.

        Parameters
        ----------
        proposal_dir : pathlib.Path
            Directory containing proposal files to be moved.
        """
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
        """
        Move panelist and model files to their respective directories.

        Parameters
        ----------
        dir_ : pathlib.Path, optional
            Directory containing files to be moved.
        file : pathlib.Path, optional
            Specific file to be moved.
        """
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
        """
        Orchestrate the movement of all extracted files to their correct locations.
        """
        contents = os.listdir(self.extract_directory)
        try:
            subdir = next(
                (
                    item
                    for item in contents
                    if os.path.isdir(os.path.join(self.extract_directory, item))
                    and item != "__MACOSX"
                ),
                None,
            )
        except:
            subdir = self.fname.stem
        for item in (self.extract_directory / subdir).iterdir():
            if item.is_dir():
                if "proposal" in item.stem:
                    self.move_proposals(item)
                else:
                    self.move_panelists_and_models(dir_=item)
            if item.is_file():
                self.move_panelists_and_models(file=item)
