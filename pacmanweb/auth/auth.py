from flask import Blueprint, render_template, redirect, url_for, request, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required
import json
from pacmanweb.config import Config

bp = Blueprint("auth", __name__)


@bp.route("/login")
def login():
    return "Login"


@bp.route("/login", methods=["POST"])
def login_post():
    pass


@bp.route("/signup")
def signup():
    return "Signup"


@bp.route("/logout")
def logout():
    return "Logout"


def validate_key(api_key):
    password = Config.DEFAULT_PASS
    password_hash = generate_password_hash(password)
    if check_password_hash(password_hash, api_key):
        return True
    return False
