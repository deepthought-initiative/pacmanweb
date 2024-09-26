"""User verification and authentication."""
from flask_login import UserMixin
from werkzeug.security import check_password_hash
import redis
from pacmanweb import Config
redis_instance = redis.from_url(Config.CELERY_RESULT_BACKEND)

class User(UserMixin):
    """
    User class for authentication and authorization.

    This class extends Flask-Login's UserMixin to provide user authentication
    and authorization functionality.

    Attributes
    ----------
    username : str
        The username of the user.

    Methods
    -------
    isadmin()
        Check if the user has admin privileges.
    get_id()
        Get the user's unique identifier.
    get(username, password)
        Authenticate a user and return a User object if successful.
    """
    def __init__(self, username):
        self.username = username

    def isadmin(self):
        """
        Check if the user has admin privileges.

        Returns
        -------
        bool
            True if the user is an admin, False otherwise.
        """
        data = redis_instance.hgetall(f"user_{self.username}")
        if data[b"isadmin"] == b"True":
            return True
        else:
            return False

    def get_id(self):
        """
        Get the user's unique identifier.

        Returns
        -------
        str
            The username of the user.
        """
        return self.username

    @staticmethod
    def get(username, password):
        """
        Authenticate a user and return a User object if successful.

        This method checks if the provided username exists and if the
        password matches the stored hash.

        Parameters
        ----------
        username : str
            The username of the user to authenticate.
        password : str
            The password to check against the stored hash.

        Returns
        -------
        User or None
            A User object if authentication is successful, None otherwise.
        """
        data = redis_instance.hgetall(f"user_{username}")
        data = {key.decode('utf-8'): value.decode('utf-8') for key, value in data.items()}

        if data:
            check_pswd = check_password_hash(data['password'], password)
        if f'user_{username}'.encode('utf-8') in redis_instance.keys('*') and check_pswd:
            return User(username)
        return None
