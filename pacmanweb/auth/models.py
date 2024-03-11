from flask_login import UserMixin
from pacmanweb import Config

credentials = Config.USERS

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
