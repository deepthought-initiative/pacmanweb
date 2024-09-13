import base64
import os
import redis
from celery import Celery
from flask import Flask
from flask_login import LoginManager
from werkzeug.security import generate_password_hash

from .config import Config

celery_app = Celery(
    __name__,
    result_backend=Config.CELERY_RESULT_BACKEND,
    broker_url=Config.CELERY_BROKER_URL,
    include=["pacmanweb.tasks"],
)
redis_instance = redis.from_url(Config.CELERY_RESULT_BACKEND)
# redis_instance.flushall()

redis_instance.hset('user_mainadmin', mapping={
    "username": "mainadmin",
    "password": generate_password_hash(Config.MAINADMIN_USER_PASSWORD),
    "admin": "True"
})

def create_app(config_class=Config):
    # instance_path?
    app = Flask(__name__)
    app.config.from_object(config_class())
    app.config.from_prefixed_env()
    # the max limit to uploaded files is 1600 MBs
    # change the below length to allow sending bigger files
    app.config["MAX_CONTENT_LENGTH"] = 1600 * 1000 * 1000
    # celery_app.config_from_object(app.config["CELERY"])

    login_manager = LoginManager()
    login_manager.login_view = "api.login"
    login_manager.init_app(app)
    from . import auth

    @login_manager.user_loader
    def load_user(user_id):
        return auth.User(user_id)

    @login_manager.request_loader
    def load_user_from_request(request):
        # try to login using Basic Auth
        auth_header = request.headers.get("Authorization")
        if auth_header:
            encoded_auth = auth_header.replace("Basic ", "", 1)
            try:
                decoded_authb = base64.b64decode(encoded_auth)
                username, password = decoded_authb.decode("utf-8").split(":")
            except TypeError:
                pass
            user = auth.User.get(username, password)
            return user

        # finally, return None if both methods did not login the user
        return None

    from .api import api, outputs, admin

    api.api_bp.register_blueprint(outputs.outputs_bp)
    api.api_bp.register_blueprint(admin.admin_bp)
    app.register_blueprint(api.api_bp)
    return app
