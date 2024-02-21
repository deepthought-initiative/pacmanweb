import json
import base64

from flask import (
    Blueprint,
    flash,
    jsonify,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from flask_login import login_required, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

from pacmanweb import Config

from .models import *

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    encoded_creds = request.form["creds"]
    decoded_creds = base64.b64decode(encoded_creds)
    username, password = decoded_creds.decode("utf-8").split(":")

    user = User.get(username=username, password=password)
    if user is None:
        return jsonify({"error": "Unauthorized"}), 401
    else:
        login_user(user)
        next = request.args.get('next')
        return jsonify({"username": username, "password": password})


@auth_bp.route("/signup")
def signup():
    return "Signup"


@auth_bp.route("/logout", methods=["POST"])
def logout():
    logout_user()
    return "Logout"


def validate_key(api_key):
    password = Config.DEFAULT_PASSWORD
    password_hash = generate_password_hash(password)
    if check_password_hash(password_hash, api_key):
        return True
    return False
