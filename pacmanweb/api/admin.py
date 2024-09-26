"""Flask Views for user management."""
from functools import wraps
from flask import Blueprint, request
from flask_login import login_required, current_user
from werkzeug.security import generate_password_hash

import redis
from pacmanweb import Config
redis_instance = redis.from_url(Config.CELERY_RESULT_BACKEND)

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")

def admin_only(f):
    """
    Decorator to restrict access to admin users only.

    This decorator checks if the current user is authenticated and has admin privileges.
    If not, it returns an unauthorized error.

    Parameters
    ----------
    f : function
        The function to be decorated.

    Returns
    -------
    function
        The decorated function that includes an admin check.

    Notes
    -----
    This decorator should be used in conjunction with @login_required.
    """
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
    """
    Check if a user exists and their admin status.

    Parameters
    ----------
    username : str
        The username to check.

    Returns
    -------
    tuple
        A tuple containing a dictionary with the user's status and an HTTP status code.

    Notes
    -----
    Status Codes:
    200 : User exists (with additional info on admin status)
    404 : User not found
    """
    if username is None or f'user_{username}'.encode('utf-8') not in redis_instance.keys('*'):
        return {'value': 'User not found'}, 404
    else:
        user_data = redis_instance.hgetall(f"user_{username}")
        if user_data[b"isadmin"] == b"True":
            return {'value': 'User is admin and exists'}, 200
        else:
            return {'value': 'User is not admin but exists'}, 200

@admin_bp.route("/edit_user", methods=["POST"])
@login_required
@admin_only
def edit_user():
    """
    Edit an existing user's information.

    This function allows an admin to modify a user's password and/or admin status.

    Returns
    -------
    tuple
        A tuple containing a dictionary with the operation result and an HTTP status code.

    Notes
    -----
    Status Codes:
    200 : User updated successfully
    401 : Unauthorized (user exists but overwrite not specified)
    404 : User not found
    """
    username = request.form["username"]
    
    if f'user_{username}'.encode('utf-8') not in redis_instance.keys('*'):
        return {
            "value": "User does not exist. Please add the user first."
        }, 404
    # user already exists, check for overwrite key
    if request.form.get("overwrite", None) not in ["True", "true"]:
        return {
        "value": "This user is already there, pass an overwrite key if you wish to overwrite."
    }, 401
    # Retrieve existing user data
    userdata = redis_instance.hgetall(f"user_{username}")
    userdata = {key.decode('utf-8'): value.decode('utf-8') for key, value in userdata.items()}

    # Edit password if provided
    password = request.form.get("password", None)
    if password:
        encoded_pass = generate_password_hash(password, method="pbkdf2:sha256")
        userdata["password"] = encoded_pass

    # Handle admin status
    isadmin = request.form.get("isadmin", None)
    if isadmin is not None:
        if isadmin in ["true", "True"]:
            userdata["isadmin"] = "True"
        elif isadmin in ["false", "False"]:
            userdata["isadmin"] = "False"
        else:
            return {"value": "isadmin can only be True or False"}, 401

    # Update user data in Redis
    redis_instance.hset(f'user_{username}', mapping=userdata)
    
    # Remove password from the response
    userdata.pop("password", None)

    return {"value": f"User {username} updated.", "user_data": userdata}, 200

@admin_bp.route("/add_user", methods=["POST"])
@login_required
@admin_only
def add_user():
    """
    Add a new user to the system.

    This function allows an admin to create a new user with a password and admin status.

    Returns
    -------
    tuple
        A tuple containing a dictionary with the operation result and an HTTP status code.

    Notes
    -----
    Status Codes:
    201 : User created successfully
    400 : Missing required fields
    409 : User already exists
    """
    username = request.form["username"]

    if f'user_{username}'.encode('utf-8') in redis_instance.keys('*'):
        return {
            "value": "User already exists. Use edit_user to update."
        }, 409

    # Ensure required fields are present
    password = request.form.get("password", None)
    isadmin = request.form.get("isadmin", None)

    if not (password and isadmin is not None):
        return {
            "value": "New user detected. Please send keys - password, isadmin."
        }, 400

    # Create new user data
    encoded_pass = generate_password_hash(password, method="pbkdf2:sha256")
    newuserdata = {
        "username": username,
        "password": encoded_pass,
        "isadmin": str(isadmin in ["true", "True"])
    }

    # Store new user data in Redis
    redis_instance.hset(f'user_{username}', mapping=newuserdata)

    # Remove password from the response
    newuserdata.pop("password", None)

    return {"value": f"New user {username} added.", "user_data": newuserdata}, 201

@admin_bp.route("/delete_user", methods=["POST"])
@login_required
@admin_only
def delete_user():
    """
    Delete an existing user from the system.

    This function allows an admin to remove a user account.

    Returns
    -------
    tuple
        A tuple containing a dictionary with the operation result and an HTTP status code.

    Notes
    -----
    Status Codes:
    200 : User deleted successfully
    401 : User not found
    """
    username = request.form["username"]
    if f'user_{username}'.encode('utf-8') in redis_instance.keys('*'):
          # Retrieve existing user data
        userdata = redis_instance.hgetall(f"user_{username}")
        userdata = {key.decode('utf-8'): value.decode('utf-8') for key, value in userdata.items()}
        redis_instance.delete(f'user_{username}'.encode('utf-8'))
    else:
        return {"value": "Username not found"}, 401
    return {"value": f"User {username} deleted.", "user_data": userdata}, 200


@admin_bp.route("/return_users", methods=["GET"])
@login_required
@admin_only
def return_user_data():
    """
    Retrieve a list of all users in the system.

    This function returns a list of dictionaries containing username and admin status for each user.

    Returns
    -------
    list
        A list of dictionaries, each containing 'username' and 'isadmin' keys for a user.
    """
    result = []
    for key in redis_instance.keys("user_*"):
        user_data = redis_instance.hgetall(key)
        result.append({
            "username": user_data[b"username"].decode('utf-8'),
            "isadmin": user_data[b"isadmin"].decode('utf-8')
        })
    return result