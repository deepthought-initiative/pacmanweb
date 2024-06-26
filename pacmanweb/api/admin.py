import json
from functools import wraps

from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from werkzeug.security import generate_password_hash

import redis
from pacmanweb import Config
redis_instance = redis.from_url(Config.CELERY_RESULT_BACKEND)

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")

def admin_only(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check if the current user is authenticated and is an admin
        if getattr(current_user, "isadmin", False):
            return f(*args, **kwargs)
        else:
            return {"value": "Current user is not admin"}, 401
    return decorated_function


@admin_bp.route("/ifexists/<username>", methods=["GET"])
def exists(username):
    if username is None or f'user_{username}'.encode('utf-8') not in redis_instance.keys('*'):
        return {'value': 'User not found'}, 404
    else:
        user_data = redis_instance.hgetall(f"user_{username}")
        if user_data[b"admin"] == b"True":
            return {'value': 'User is admin and exists'}, 200
        else:
            return {'value': 'User is not admin but exists'}, 200


@admin_bp.route("/edit_users", methods=["POST"])
@login_required
@admin_only
def register_update_user():
    username = request.form["username"]
    newuserdata = {
            "username": username,
    }

    if f'user_{username}'.encode('utf-8') not in redis_instance.keys('*'):
        # this means adding a new user
        if not (
            request.form.get("password", None)
            and request.form.get("isadmin", None)
        ):
            return {
                "value": "New user detected. Please send keys- password, isadmin if adding a new user."
            }, 401
        userdata = {}
    else:
        # user already exists, check for overwrite key
        if request.form.get("overwrite", None) not in ["True", "true"]:
            return {
            "value": "This user is already there, pass an overwrite key if you wish to overwrite."
        }, 401
        userdata = redis_instance.hgetall(f"user_{username}")
        userdata = {key.decode('utf-8'): value.decode('utf-8') for key, value in userdata.items()}

    # edit password and admin status
    password = request.form.get("password", None)
    if password:
        encoded_pass = generate_password_hash(password, method="pbkdf2:sha256")
        newuserdata["password"] = encoded_pass
    
    

    # lookout for bad isadmin values
    isadmin = request.form.get("isadmin", None)
    if isadmin:
        if isadmin in ["true", "True"]:
            isadmin = True
        elif isadmin in ["false", "False"] or isadmin is None:
            isadmin = False
        else:
            return {"value": "isadmin can only be True or False"}, 401
        newuserdata["admin"] = str(isadmin)

    # newuserdata overwrites userdata in case of conflict
    userdata = userdata | newuserdata
    redis_instance.hset(f'user_{username}', mapping=userdata)
    return {"value": f"New user {username} added/updated."}, 201


@admin_bp.route("/delete_user", methods=["POST"])
@login_required
@admin_only
def delete_user():
    username = request.form["username"]
    if f'user_{username}'.encode('utf-8') in redis_instance.keys('*'):
        redis_instance.delete(f'user_{username}'.encode('utf-8'))
    else:
        return {"value": "Username not found"}, 401
    return {"value": f"User {username} deleted."}, 200


@admin_bp.route("/return_users", methods=["GET"])
@login_required
@admin_only
def return_user_data():
    result = []
    for key in redis_instance.keys("user_*"):
        user_data = redis_instance.hgetall(key)
        result.append({
            "username": user_data[b"username"].decode('utf-8'),
            "isadmin": user_data[b"admin"].decode('utf-8')
        })
    return result