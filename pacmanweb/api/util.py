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


def cal_available_cycles(proposal_check=True, panelist_check=True):
    pacman_path = Config.PACMAN_PATH
    runs_dir = pacman_path / "runs"
    proposal_directory = runs_dir / "input_proposal_data"
    panelist_directory = runs_dir / "input_panelist_data"
    result = {}

    if proposal_directory.is_dir():
        proposal_cycles = [item.stem for item in proposal_directory.iterdir() if item.is_dir()]
        result["proposal_cycles"] = proposal_cycles
    else:
        result["proposal_cycles"] = f"No proposal directory found in f{str(proposal_directory)}"

    if panelist_directory.is_dir():
        panelist_cycles = [item.stem.split("_")[0] for item in panelist_directory.iterdir()]
        result["panelist_cycles"] = panelist_cycles
    else:
        result["panelist_cycles"] = f"No panelist directory found in f{str(panelist_directory)}"
        
    models_dir = pacman_path / "models"
    if models_dir.is_dir():
        models = [item.name for item in models_dir.iterdir() if item.name.endswith(".joblib")]
        result["models"] = models
    else:
        result["models"] = f"No models directory found in f{str(models_dir)}"

    return result

