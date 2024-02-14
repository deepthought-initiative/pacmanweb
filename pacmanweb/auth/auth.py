import json

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


@auth_bp.route("/login")
def login():
    return "Login"


@auth_bp.route("/api/login", methods=["POST"])
def login_post():
    username = request.form["username"]
    password = request.form["password"]

    user = User.get(username=username, password=password)
    if user is None:
        return jsonify({"error": "Unauthorized"})
    else:
        login_user(user)
        return jsonify({"username": username, "password": password})


@auth_bp.route("/signup")
def signup():
    return "Signup"


@auth_bp.route("/logout")
def logout():
    logout_user()
    return "Logout"


def validate_key(api_key):
    password = Config.DEFAULT_PASS
    password_hash = generate_password_hash(password)
    if check_password_hash(password_hash, api_key):
        return True
    return False
