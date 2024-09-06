import os
import pathlib
import yaml
from dotenv import load_dotenv
import secrets

# Load the appropriate .env file based on the MODE
MODE = os.getenv('MODE', 'dev')
load_dotenv(f'../.env.{MODE}')

class Config:
    ROOTDIR = pathlib.Path(__file__).resolve().parent
    ENV_NAME = os.getenv('ENV_NAME')

    SECRET_KEY = os.getenv('SECRET_KEY')
    if not SECRET_KEY:
        SECRET_KEY = secrets.token_hex()
    TEST_ADS_API_KEY = os.getenv('ADS_DEV_KEY')
    if not TEST_ADS_API_KEY:
        raise ValueError("No ADS key provided. Please edit your environment file.")

    if not ENV_NAME:
        raise ValueError("No ENV_NAME provided. Please edit your environment file.")

    CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND')
    CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL')
    SUBPROCESS_COMMANDS = os.getenv('SUBPROCESS_COMMANDS')

    # celery config
    CELERY = {}

    file_path = pathlib.Path(__file__).resolve()
    PACMAN_PATH = file_path.parents[1] / "PACMan"
    UPLOAD_FOLDER = ROOTDIR / "uploads"
    DOWNLOAD_FOLDER = ROOTDIR / "downloads"
    PANELISTS_DATA = PACMAN_PATH / "runs" / "input_panelist_data"

    with open(ROOTDIR / 'options.yaml', 'r') as file:
        section_options = yaml.safe_load(file)