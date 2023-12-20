import base64

from flask import Flask
from flask_login import LoginManager

import pacmanweb.auth as pacman_auth
from pacmanweb.api import api
from pacmanweb.config import Config


def create_app(config_class=Config):
    # instance_path?
    app = Flask(__name__)
    app.config.from_object(config_class)

    login_manager = LoginManager()
    login_manager.login_view = "auth.login"
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return pacman_auth.User.get(user_id)

    @login_manager.request_loader
    def load_user_from_request(request):
        # first, try to login using the api_key url arg
        api_key = request.args.get("api_key")
        if api_key:
            # check if this is the same as in the file
            if pacman_auth.validate_key(api_key):
                user = pacman_auth.User()
                return user

        # next, try to login using Basic Auth
        api_key = request.headers.get("Authorization")
        if api_key:
            api_key = api_key.replace("Basic ", "", 1)
            try:
                api_key = base64.b64decode(api_key)
            except TypeError:
                pass
            if pacman_auth.validate_key(api_key):
                user = pacman_auth.User()
                return user

        # finally, return None if both methods did not login the user
        return None

    app.register_blueprint(pacman_auth.auth_bp)
    app.register_blueprint(api.api_bp)

    return app
