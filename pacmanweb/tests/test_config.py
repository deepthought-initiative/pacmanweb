from pacmanweb.config import Config

def test_config_initialization():
    assert Config.ENV_NAME is not None
    assert Config.SECRET_KEY is not None
    assert Config.TEST_ADS_API_KEY is not None
    assert Config.CELERY_RESULT_BACKEND is not None
    assert Config.CELERY_BROKER_URL is not None
    assert Config.SUBPROCESS_COMMANDS is not None

def test_config_paths():
    assert Config.ROOTDIR.exists()
    assert Config.PACMAN_PATH.exists()
    assert Config.UPLOAD_FOLDER.exists()
    assert Config.DOWNLOAD_FOLDER.exists()

def test_section_options():
    assert 'proposal_categorise' in Config.section_options
    assert 'duplication_check' in Config.section_options
    assert 'match_reviewer' in Config.section_options