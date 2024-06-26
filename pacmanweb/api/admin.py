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
        if getattr(current_user, "isadmin", False):
            return f(*args, **kwargs)
        else:
            return {"value": "Current user is not admin"}, 401
    return decorated_function


@admin_bp.route("/ifexists", methods=["GET"])
def exists():
    secrets = UpdateSecrets()
    secrets_file = secrets.read_secrets()
    username = request.form.get("username", None)
    
    if username is None or username not in secrets_file["users"].keys():
        return {'value': 'User not found'}, 404

    if username not in secrets_file["admins"]:
        return {'value': 'User is not admin but exists'}, 404
    else:
        return {'value': 'User is admin and exists'}, 200



@admin_bp.route("/edit_users", methods=["POST"])
@login_required
@admin_only
def register_update_user():
    secrets = UpdateSecrets()
    secrets_file = secrets.read_secrets()
    username = request.form["username"]

    if username not in secrets_file["users"].keys():
        # this means adding a new user
        if not (
            request.form.get("password", None)
            and request.form.get("isadmin", None)
        ):
            return {
                "value": "New user detected. Please send keys- password, isadmin if adding a new user."
            }, 401


    # edit password
    password = request.form.get("password", None)
    if password:
        # if user already there, ask for confirmation
        if username in secrets_file["users"].keys():
            # user already there, check for overwrite key
            if request.form.get("overwrite", None) not in ["True", "true"]:
                return {
                "value": "This user is already there, pass an overwrite key if you wish to overwrite."
            }, 401
            
        encoded_pass = generate_password_hash(password, method="pbkdf2:sha256")
        secrets_file["users"][username] = encoded_pass
        
    # lookout for bad isadmin values
    isadmin = request.form.get("isadmin", None)
    if isadmin in ["true", "True"]:
        isadmin = True
    elif isadmin in ["false", "False"] or isadmin is None:
        isadmin = False
    else:
        return {"value": "isadmin can only be True or False"}, 401

    if isadmin and username not in secrets_file["admins"]:
        secrets_file["admins"].append(username)
    elif not isadmin and username in secrets_file["admins"]:
        secrets_file["admins"].remove(username)
    else:
        # is admin and in admins list pass
        # is not admin and not in admins list pass
        pass

    secrets.update_secrets(secrets_file)
    return {"value": f"New user {username} added/updated."}, 201


@admin_bp.route("/delete_user", methods=["POST"])
@login_required
@admin_only
def delete_user():
    username = request.form["username"]
    secrets = UpdateSecrets()
    secrets_data = secrets.read_secrets()

    if username in secrets_data["users"].keys():
        del secrets_data["users"][username]
    else:
        return {"value": "Username not found"}, 401

    if username in secrets_data["admins"]:
        secrets_data["admins"].remove(username)
    secrets.update_secrets(secrets_data)
    return {"value": f"User {username} deleted."}, 200


@admin_bp.route("/return_users", methods=["GET"])
@login_required
@admin_only
def return_user_data():
    secrets = UpdateSecrets()
    secrets_data = secrets.read_secrets()
    users = secrets_data["users"].keys()
    admins = secrets_data["admins"]

    res_total = [
        {"username": item, "isadmin": item in admins}
        for item in users
    ]

    return jsonify(res_total)
