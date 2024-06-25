import json

from flask import Blueprint, request, jsonify
from flask_login import login_required
from werkzeug.security import generate_password_hash

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
    secrets = UpdateSecrets()
    secrets_file = secrets.read_secrets()
    username = request.form["username"]

    if request.form.get("password"):
        password = request.form["password"]
        encoded_pass = generate_password_hash(password, method='pbkdf2:sha256')
        secrets_file["users"][username] = encoded_pass

    isadmin = bool(request.form.get("isadmin"))
    if isadmin and username not in secrets_file["admins"]:
        secrets_file["admins"].append(username)
    elif not isadmin and username in secrets_file["admins"]:
        secrets_file["admins"].remove(username)

    secrets.update_secrets(secrets_file)

@admin_bp.route("/delete_user", methods=["POST"])
@login_required
def delete_user():
    username = request.form["username"]
    secrets = UpdateSecrets()
    secrets_data = secrets.read_secrets()
    del secrets_data["users"][username]
    secrets.update_secrets(secrets_data)

@admin_bp.route("/return_users", methods=["GET"])
@login_required
def return_user_data():
    secrets = UpdateSecrets()
    secrets_data = secrets.read_secrets()
    users = secrets_data["users"].keys()
    admins = secrets_data["admins"]
    
    res_total = [
        {"UID": index, "username": item, "isadmin": item in admins}
        for index, item in enumerate(users)
    ]
    
    return jsonify(res_total)
