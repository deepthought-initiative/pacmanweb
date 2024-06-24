import ast
import json
import pathlib
import re
import zipfile
from collections import defaultdict
from io import BytesIO, StringIO
from os import R_OK, access, stat

import pandas as pd
from flask import Blueprint, request, send_file
from flask_login import login_required
from werkzeug.security import generate_password_hash, check_password_hash

from pacmanweb import Config

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")

# separate class because resources won't be opened/closed that often
class UpdateSecrets:
    def __init__(self):
        ROOTDIR = Config().ROOTDIR
        self.secrets_fpath = ROOTDIR.parent / "secrets.json"
    
    def read_secrets(self):
        with open(self.secrets_fpath, "r") as secrets:
            secrets_data = json.load(secrets)
        return secrets_data
    
    def update_secrets(self, new_secrets):
        with open(self.secrets_fpath, "w") as secrets:
            json.dump(secrets)


@admin_bp.route("/edit_users", methods=["POST"])
@login_required
def register_update_user():
    username = request.form["username"]
    password = request.form["password"]
    encoded_pass = generate_password_hash(password, method='pbkdf2:sha256')

    secrets = UpdateSecrets()
    secrets_file = secrets.read_secrets()
    secrets_file["users"][username] = encoded_pass
    secrets.update_secrets(secrets_file)

@admin_bp.route("/edit_users", methods=["POST"])
@login_required
def delete_user():
    username = request.form["username"]
    secrets = UpdateSecrets()
    secrets_data = secrets.read_secrets()
    del secrets_data["users"][username]
    secrets.update_secrets(secrets_data)

@admin_bp.route("/make_admin", methods=["POST"])
@login_required
def make_admin():
    # user to make admin
    username = request.form["username"]

    secrets = UpdateSecrets()
    secrets_data = secrets.read_secrets()
    if username not in secrets_data["admins"]:
        secrets_data["admins"].append(username)
    secrets.update_secrets(secrets_data)

@admin_bp.route("/revoke_admin", methods=["POST"])
@login_required
def revoke_admin():
    # revoke admin privileges
    username = request.form["username"]

    secrets = UpdateSecrets()
    secrets_data = secrets.read_secrets()
    if username not in secrets_data["admins"]:
        secrets_data["admins"].remove(username)
    secrets.update_secrets(secrets_data)

@admin_bp.route("/return_users", methods=["GET"])
@login_required
def return_user_data():
    secrets = UpdateSecrets()
    secrets_data = secrets.read_secrets()
    users = secrets_data["users"].keys()
    admins = secrets_data["users"].keys()
    res_total = []
    # TODO: make this computation simpler
    for index, item in enumerate(users.keys()):
        res = {}
        res["UID"] = index
        res["username"] = item
        res["isadmin"] = False
        if item in admins:
            res["isadmin"] = True
        res_total.append(res)
    return res_total
