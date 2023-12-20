import json
import os
from pathlib import Path


class Config:
    ROOTDIR = Path(__file__).resolve().parent

    secrets_fpath = ROOTDIR.parent / "secrets.json"
    with open(secrets_fpath, "r") as secrets:
        CREDS = json.load(secrets)

    SECRET_KEY = os.environ.get("SECRET_KEY")
    DEFAULT_PASS = CREDS["default_password"]
    if not SECRET_KEY:
        try:
            SECRET_KEY = CREDS.get("secret_key")
        except KeyError:
            raise ValueError("No secret key found in secrets.json or in path")

    # Do we want to code to generate the secret_key?
