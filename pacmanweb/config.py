import json
import os
import pathlib
import yaml

# or prod
MODE = "prod"


class Config:
    ROOTDIR = pathlib.Path(__file__).resolve().parent
    ENV_NAME = ""

    secrets_fpath = ROOTDIR.parent / "secrets.json"
    with open(secrets_fpath, "r") as secrets:
        CREDS = json.load(secrets)

    # will surpass the environment variable
    if CREDS.get("ENV_NAME", None):
        ENV_NAME = CREDS["ENV_NAME"]

    SECRET_KEY = os.environ.get("SECRET_KEY")
    TEST_ADS_API_KEY = CREDS["ADS_DEV_KEY"]
    ENV_NAME = CREDS["ENV_NAME"]

    if MODE == "prod":
        CELERY_RESULT_BACKEND = "redis://redis:6379/0"
        CELERY_BROKER_URL = f"amqp://guest:guest@rabbitmq:5672"
        ENV_NAME = "base"  # env needs to be base for docker
        SUBPROCESS_COMMANDS = f"micromamba run -n {ENV_NAME}  python run_pacman.py"

    if MODE == "dev":
        CELERY_RESULT_BACKEND = "redis://"
        CELERY_BROKER_URL = f"pyamqp://"
        SUBPROCESS_COMMANDS = f"conda run -n {ENV_NAME}  python run_pacman.py"

    if not SECRET_KEY:
        try:
            SECRET_KEY = CREDS.get("SECRET_KEY", os.urandom(32))
        except KeyError:
            raise ValueError("No SECRET_KEY found in secrets.json or in path")

    # celery config
    CELERY = {}

    file_path = pathlib.Path(__file__).resolve()
    PACMAN_PATH = file_path.parents[1] / "PACMan"
    UPLOAD_FOLDER = ROOTDIR / "uploads"
    DOWNLOAD_FOLDER = ROOTDIR / "downloads"
    PANELISTS_DATA = PACMAN_PATH / "runs" / "input_panelist_data"

    with open(ROOTDIR / 'options.yaml', 'r') as file:
        section_options = yaml.safe_load(file)
