import json
from functools import wraps

from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
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
        with open(self.secrets_fpath, "w") as secrets_file:
            json.dump(new_secrets, secrets_file)


def admin_only(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check if the current user is authenticated and is an admin
        if getattr(current_user, 'isadmin', False):
            return f(*args, **kwargs)
        else: return {
            "value": "Current user is not admin"
        }, 401
    return decorated_function


@admin_bp.route("/edit_users", methods=["POST"])
@login_required
@admin_only
def register_update_user():
    secrets = UpdateSecrets()
    secrets_file = secrets.read_secrets()
    username = request.form["username"]
    password = request.form.get("password", None)


    # add/update user
    if password:
        # if user already there, ask for confirmation?
        encoded_pass = generate_password_hash(password, method='pbkdf2:sha256')
        secrets_file["users"][username] = encoded_pass

    # edit admin status
    isadmin = request.form.get("isadmin")
    if isadmin in ["true", "True"]:
        isadmin = True
    elif isadmin in ["false", "False"]:
        isadmin = False
    else:
        return {
            "value": "isadmin can only be True or False"
        }, 401 
    
    # if new user must provide password else not required
    new_user = username not in secrets_file["users"].keys() and password
    old_user = username in secrets_file["users"].keys()

    if new_user or old_user:
        if isadmin and username not in secrets_file["admins"]:
            secrets_file["admins"].append(username)
        elif not isadmin and username in secrets_file["admins"]:
            secrets_file["admins"].remove(username)
    else:
        return {
            "value": "If adding new user please provide password."
        }, 401

    secrets.update_secrets(secrets_file)
    return {
            "value": f"New user {username} added/updated."
        }, 201

@admin_bp.route("/delete_user", methods=["POST"])
@login_required
@admin_only
def delete_user():
    username = request.form["username"]
    secrets = UpdateSecrets()
    secrets_data = secrets.read_secrets()
    if username in secrets_data["users"].keys():
        del secrets_data["users"][username]
    if username in secrets_data["admins"]:
        secrets_data["admins"].remove(username)
    secrets.update_secrets(secrets_data)
    return {
            "value": f"User {username} deleted."
        }, 200

@admin_bp.route("/return_users", methods=["GET"])
@login_required
@admin_only
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
