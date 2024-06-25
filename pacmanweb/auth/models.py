from flask_login import UserMixin
from pacmanweb import Config
from werkzeug.security import generate_password_hash, check_password_hash

credentials = Config.USERS
admins = Config.ADMINS

class User(UserMixin):
    def __init__(self, username):
        self.username = username
        self.isadmin = False
        if self.username in admins:
            self.isadmin = True

    def get_id(self):
        return self.username

    @staticmethod
    def get(username, password):
        check_pswd = check_password_hash(credentials[username], password)
        if username in credentials.keys() and check_pswd:
            return User(username)
        return None
