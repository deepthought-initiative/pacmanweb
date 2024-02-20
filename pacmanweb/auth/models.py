from flask_login import UserMixin

credentials = {"11": "abc", "22": "xyz"}


class User(UserMixin):
    def __init__(self, username):
        self.username = username

    def get_id(self):
        return self.username

    @staticmethod
    def get(username, password):
        if username in credentials and credentials[username] == password:
            return User(username)
        return None
