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


def validate_key(api_key):
    password = Config.DEFAULT_PASSWORD
    password_hash = generate_password_hash(password)
    if check_password_hash(password_hash, api_key):
        return True
    return False
