import pytest
from pathlib import Path
from pacmanweb import Config
from pacmanweb.api.executor import RunPACMan
from distutils.dir_util import copy_tree

@pytest.fixture(scope="module")
def setup_test_environment(tmp_path_factory):
    test_dir = tmp_path_factory.mktemp("test_pacman")
    
    (test_dir / "runs").mkdir(parents=True)
    (test_dir / "logs").mkdir(parents=True)
    (test_dir / "models").mkdir(parents=True)
    
    source_models = Path(Config.PACMAN_PATH) / "models"
    dest_models = test_dir / "models"
    copy_tree(str(source_models), str(dest_models))

    source_runs = Path(__file__).parent / "data"
    dest_runs = test_dir / "runs"
    copy_tree(str(source_runs), str(dest_runs))

    yield test_dir


@pytest.mark.parametrize("mode", ["PROP", "DUP", "MATCH"])
def test_run_pacman(setup_test_environment, mode):
    test_dir = setup_test_environment
    options = {
        "run_name": f"test_{mode}",
        "main_test_cycle": "221026",
        "past_cycles": ["221026", "231026"],
        "mode": mode,
        "runs_dir": str(test_dir / "runs"),
        "modelfile": "strolger_pacman_model_7cycles.joblib",
        "log_level": "DEBUG",
        "celery_task_id": f"test_task_{mode}",
        "current_user": "test"
    }
    
    runner = RunPACMan(**options)
    result = runner.run()
    
    assert result["return_code"] == 0, f"PACMan run failed for mode {mode}: {result['std_out']}"

    assert "Traceback" not in result["std_out"], f"Error in PACMan output for mode {mode}: {result['std_out']}"
    if mode == "PROP":
        assert (test_dir / "runs" / options["run_name"] / "store" / f"{options['main_test_cycle']}_recategorization.txt").exists()
    elif mode == "DUP":
        assert (test_dir / "runs" / options["run_name"] / "store" / f"{options['main_test_cycle']}_duplications.txt").exists()
    elif mode == "MATCH":
        assert (test_dir / "runs" / options["run_name"] / "store" / f"{options['main_test_cycle']}_panelists_match_check.pkl").exists()

def test_run_pacman_invalid_mode(setup_test_environment):
    test_dir = setup_test_environment
    options = {
        "run_name": "test_invalid",
        "main_test_cycle": "221026",
        "mode": "INVALID",
        "runs_dir": str(test_dir / "runs"),
        "celery_task_id": "test_task_invalid"
    }
    
    with pytest.raises(ValueError, match="Invalid mode"):
        RunPACMan(**options)