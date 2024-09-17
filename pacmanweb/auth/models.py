from flask_login import UserMixin
from werkzeug.security import check_password_hash

import redis
from pacmanweb import Config
redis_instance = redis.from_url(Config.CELERY_RESULT_BACKEND)

class User(UserMixin):
    def __init__(self, username):
        self.username = username

    def isadmin(self):
        data = redis_instance.hgetall(f"user_{self.username}")
        if data[b"isadmin"] == b"True":
            return True
        else:
            return False

    def get_id(self):
        return self.username

    @staticmethod
    def get(username, password):
        data = redis_instance.hgetall(f"user_{username}")
        data = {key.decode('utf-8'): value.decode('utf-8') for key, value in data.items()}

        if data:
            check_pswd = check_password_hash(data['password'], password)
        if f'user_{username}'.encode('utf-8') in redis_instance.keys('*') and check_pswd:
            return User(username)
        return None
