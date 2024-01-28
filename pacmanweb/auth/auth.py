import json

from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import login_required, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

from pacmanweb import Config

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login")
def login():
    return "Login"


@auth_bp.route("/login", methods=["POST"])
def login_post():
    pass


@auth_bp.route("/signup")
def signup():
    return "Signup"


@auth_bp.route("/logout")
def logout():
    return "Logout"


def validate_key(api_key):
    password = Config.DEFAULT_PASS
    password_hash = generate_password_hash(password)
    if check_password_hash(password_hash, api_key):
        return True
    return False
