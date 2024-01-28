import shutil
from pacmanweb import Config

def clean_previous_runs():
    pacman_path = Config.PACMAN_PATH
    runs_dir = pacman_path / "runs"
    valid_names = ["discard", "input_proposal_data", "input_panelist_data", "logs"]
    for child in runs_dir.iterdir():
        if child.stem not in valid_names:
            shutil.rmtree(child)
