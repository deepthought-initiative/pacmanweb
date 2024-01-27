import shutil
import pathlib
from pacmanweb import config

# move model files to PACMAN
source_path = pathlib.Path.cwd().resolve() / "data/models"
target_path = config.PACMAN_PATH / "models"

for src_file in source_path.glob('*.*'):
    shutil.copy(src_file, target_path)
