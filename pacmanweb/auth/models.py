from flask_login import UserMixin
from pacmanweb import Config

credentials = {Config.DEFAULT_USERNAME: Config.DEFAULT_PASSWORD}


class User(UserMixin):
    def __init__(self, username):
        self.username = username

    def get_id(self):
        return self.username

    @staticmethod
    def get(username, password):
        if username in credentials.keys() and credentials[username] == password:
            return User(username)
        return None
