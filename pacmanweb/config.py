import os
import pathlib
import yaml
from dotenv import load_dotenv

# Load the appropriate .env file based on the MODE
MODE = os.getenv('MODE', 'dev')
load_dotenv(f'../.env.{MODE}')

class Config:
    ROOTDIR = pathlib.Path(__file__).resolve().parent
    ENV_NAME = os.getenv('ENV_NAME')

    SECRET_KEY = os.getenv('SECRET_KEY', os.urandom(32))
    TEST_ADS_API_KEY = os.getenv('ADS_DEV_KEY')

    CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND')
    CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL')
    SUBPROCESS_COMMANDS = f'conda run -n {ENV_NAME} python run_pacman.py'

    # celery config
    CELERY = {}

    file_path = pathlib.Path(__file__).resolve()
    PACMAN_PATH = file_path.parents[1] / "PACMan"
    UPLOAD_FOLDER = ROOTDIR / "uploads"
    DOWNLOAD_FOLDER = ROOTDIR / "downloads"
    PANELISTS_DATA = PACMAN_PATH / "runs" / "input_panelist_data"

    with open(ROOTDIR / 'options.yaml', 'r') as file:
        section_options = yaml.safe_load(file)