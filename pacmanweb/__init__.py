import base64
import os

from celery import Celery
from flask import Flask
from flask_login import LoginManager

from .config import Config

celery_app = Celery(
    __name__,
    result_backend="redis://redis:6379/0",
    broker_url=f"amqp://guest:guest@rabbitmq:5672",
    include=["pacmanweb.tasks"],
)


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
    login_manager.login_view = "auth.login"
    login_manager.init_app(app)
    from . import auth

    @login_manager.user_loader
    def load_user(user_id):
        return auth.User(user_id)

    @login_manager.request_loader
    def load_user_from_request(request):
        # first, try to login using the api_key url arg
        api_key = request.args.get("api_key")
        if api_key:
            # check if this is the same as in the file
            if auth.validate_key(api_key):
                user = auth.User()
                return user
            
        # next, try to login using Basic Auth
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

    from .api import api, outputs

    api.api_bp.register_blueprint(outputs.outputs_bp)
    app.register_blueprint(auth.auth_bp)
    app.register_blueprint(api.api_bp)

    @app.after_request
    def after_request(response):
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type,Authorization"
        )
        response.headers.add(
            "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"
        )
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        response.headers['Cache-Control'] = 'public, max-age=0'
        return response
        
    return app
