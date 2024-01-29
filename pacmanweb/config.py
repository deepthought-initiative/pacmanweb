import json
import os
import pathlib


class Config:
    ROOTDIR = pathlib.Path(__file__).resolve().parent
    ENV_NAME = os.environ.get("ENV_NAME", "pacman_linux")

    secrets_fpath = ROOTDIR.parent / "secrets.json"
    with open(secrets_fpath, "r") as secrets:
        CREDS = json.load(secrets)

    SECRET_KEY = os.environ.get("SECRET_KEY")
    DEFAULT_PASS = CREDS["default_password"]
    TEST_ADS_API_KEY = CREDS["TEST_ADS_DEV_KEY"]
    if not SECRET_KEY:
        try:
            SECRET_KEY = CREDS.get("secret_key")
        except KeyError:
            raise ValueError("No secret key found in secrets.json or in path")

    # celery config
    CELERY = {}

    file_path = pathlib.Path(__file__).resolve()
    PACMAN_PATH = file_path.parents[2] / "PACMan"
