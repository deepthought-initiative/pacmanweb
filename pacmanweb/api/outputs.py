import pathlib
import subprocess

from celery import shared_task
from celery.result import AsyncResult
from flask import Blueprint, request, stream_with_context, g
from flask_login import login_required
import redis
import ast
from collections import defaultdict
import re
from io import StringIO
import pandas as pd

from .. import celery_app
from ..tasks import pacman_task

outputs_bp = Blueprint("outputs", __name__, url_prefix="/outputs")
redis_instance = redis.Redis()


class PACManOutput:
    def __init__(
        self,
        run_name,
        celery_task_id,
        process_data=True,
        alternate_pacman_path=None,
    ):
        self.celery_task_id = celery_task_id
        file_path = pathlib.Path.cwd().resolve()
        pacman_path = file_path.parents[0]
        pacman_path = pacman_path / "PACMan"
        self.pacman_path = pacman_path
        if alternate_pacman_path is not None:
            self.pacman_path = alternate_pacman_path
        
        runs_dir = self.pacman_path / "runs"
        if run_name:
            self.output_dir = runs_dir / run_name
        else:
            self.output_dir = runs_dir / celery_task_id
            
        self.process_data = process_data
        self.pkl_files = [
            "panelists",
            "panelists_query",
            "panelists_match_check",
            "panelists_conflicts",
        ]
        self.txt_files = [
            "recategorization",
            "hand_classifications",
            "panelists",
            "duplications",
            "assignments",
        ]
        [setattr(self, f"{item}_pkl", {}) for item in self.pkl_files]
        [setattr(self, item, {}) for item in self.txt_files]

    def proposal_model_results(self):
        model_results_dir = self.output_dir / "model_results"
        files = list(model_results_dir.iterdir())
        if not files:
            return {}
        # assumes there would be only one file
        model_result_file = files[0]
        with open(model_result_file) as f:
            model_results = f.read()
        model_results = pd.read_csv(StringIO(model_results))
        pattern = re.compile(r"/(\d+)_training\.txt$")
        model_results["fname"] = model_results["fname"].str.extract(
            pattern, expand=False
        )
        return model_results

    def parse_assigments(self, filepath):
        if not filepath.is_file():
            return {}
        with open(filepath, "r") as f:
            if not self.process_data:
                data = f.read()
            else:
                raw_data = f.readlines()
                data = defaultdict(list)
                for row in raw_data[1:]:
                    row = row.split("\n")[:-1][0].split('"')[:-1]
                    if not row:
                        continue
                    proposal_number, recommended_reviewer, cs_score, conflicts = row
                    pattern = re.compile(r"(\D+,\s\d+), ")
                    matches = pattern.findall(conflicts)
                    data[proposal_number].append(
                        {
                            "recommended_reviewer": recommended_reviewer,
                            "cs_score": cs_score,
                            "conflicts": matches,
                        }
                    )
        return data

    def store_files(self):
        main_test_cycle = self.options["main_test_cycle"]
        store = self.output_dir / "store"
        files = store.iterdir()

        for filepath in files:
            filename = re.sub(r"\d+_", "", filepath.stem)
            data = None

            if filepath.suffix == ".txt":
                if filename == "panelists_conflicts":
                    continue
                if filename in [
                    "recategorization",
                    "hand_classifications",
                    "duplications",
                ]:
                    with open(filepath, "r") as f:
                        data = f.read()
                        if self.process_data:
                            if filename == "duplications":
                                data = pd.read_csv(
                                    StringIO(data),
                                    header=None,
                                    names=["Proposal 1", "Proposal 2", "Similarity"],
                                    delimiter=" ",
                                ).to_dict()
                            else:
                                data = pd.read_csv(StringIO(data)).to_dict()
                if filename == "assignments":
                    data = self.parse_assigments(filepath)

                setattr(self, filename, data)

            elif filepath.suffix == ".pkl":
                try:
                    data = pd.read_pickle(filepath)
                    if isinstance(data, pd.DataFrame):
                        data = data.to_dict()
                except ModuleNotFoundError:
                    print(f"Could not parse {filepath}")
                setattr(self, filename + "_pkl", data)

    def proposal_cat_output(self):
        model_results = self.proposal_model_results()
        return {
            "model_results": model_results,
            "recategorization": self.recategorization,
            "hand_classifications": self.hand_classifications,
        }

    def duplicate_proposals_output(self):
        return {"duplications": self.duplications}

    def reviewer_match_output(self):
        return {
            "panelists": self.panelists_pkl,
            "panelists_conflicts": self.panelists_conflicts_pkl,
            "assignments": self.assignments,
            "panelists_match_check": self.panelists_match_check_pkl,
            "panelists_query": self.panelists_query_pkl,
        }


