import os
import time
import pytest
import pathlib
from flask_login import FlaskLoginClient
from pacmanweb import create_app
from pacmanweb.auth import User
from pacmanweb import config
from base64 import b64encode

test_data = [
    ({"mode": "PROP", "main_test_cycle": "221026"}),
    ({"mode": "DUP", "main_test_cycle": "221026", "past_cycles": "221026,231026"}),
    # ({"mode": "MATCH", "main_test_cycle": "221026", "past_cycles": "221026,231026"}),
]

@pytest.fixture(scope="module")
def app():
    app = create_app()
    app.config.update(
        {
            "TESTING": True,
        }
    )
    app.test_client_class = FlaskLoginClient
    os.environ["ADS_DEV_KEY"] = config.TEST_ADS_API_KEY
    yield app

@pytest.fixture()
def client(app):
    return app.test_client()

@pytest.fixture()
def auth_header():
    credentials = b64encode(f"default:{config.DEFAULT_PASS}".encode()).decode("utf-8")
    return {"Authorization": f"Basic {credentials}"}

class TestAPI:
    @pytest.mark.parametrize("args", test_data)
    def test_spawn(self, client, auth_header, args):
        runs_dir = pathlib.Path.cwd().resolve() / "data"
        args["runs_dir"] = runs_dir
        response = client.get("/api/run_pacman", headers=auth_header, query_string=args)
        assert response.status_code == 200
        cls = type(self)
        if not hasattr(cls, "task_hashes"):
            cls.task_hashes = []
        cls.task_hashes.append(response.json["result_id"])

    def test_prev_result(self, client, auth_header):
        for task_hash in self.task_hashes:
            while True:
                response = client.get(f"/api/prev_runs/{task_hash}", headers=auth_header)
                if not response.json["value"]:
                    time.sleep(5)
                    continue
                break
            assert "Traceback" not in response.json["value"]
            
        
