import ast
import json
import pathlib
import re
from collections import defaultdict
from io import StringIO

import pandas as pd
from flask import Blueprint, request
from flask_login import login_required
from pacmanweb import Config

outputs_bp = Blueprint("outputs", __name__, url_prefix="/outputs")


def make_records(dataframe):
    data = {index: list(item) for index, item in enumerate(dataframe.to_numpy())}
    data["columns"] = list(dataframe.columns)
    return data


class PropCat:
    def __init__(self, output_dir, cycle_number=None) -> None:
        model_file_fpath = next((output_dir / "model_results").iterdir())
        self.parse_model_results(model_file_fpath)
        recat_fpath = output_dir / "store" / f"{cycle_number}_recategorization.txt"
        self.parse_recategorization(recat_fpath)
        self.calculate_alternate_categories()

    def parse_model_results(self, model_file_fpath):
        with open(model_file_fpath) as f:
            model_results = f.read()
        model_results = pd.read_csv(StringIO(model_results))

        # clean fname
        pattern = re.compile(r"/(\d+)_training\.txt$")
        model_results["fname"] = model_results["fname"].str.extract(
            pattern, expand=False
        )
        model_results = model_results.sort_values("fname").set_index("fname")
        model_results.index = model_results.index.astype(int)
        model_results.columns = (
            model_results.columns.str.strip("_prob").str.replace("_", " ").str.title()
        )

        self.model_results = model_results

    def parse_recategorization(self, filepath):
        data = pd.read_csv(filepath)
        # data is simple string_io parsed dataframe
        columns_to_clean = ["pacman_cat", "orig_cat"]
        data[columns_to_clean] = data[columns_to_clean].apply(
            lambda x: x.str.replace('"', ""), axis=0
        )
        data["orig_cat"] = data["orig_cat"].apply(lambda x: None if "[]" in x else x)
        data[["#propid", "certainty"]] = data[["#propid", "certainty"]].apply(
            pd.to_numeric
        )
        data = data.rename(
            columns={
                "#propid": "Proposal Number",
                "pacman_cat": "PACMan Science Category",
                "orig_cat": "Original Science Category",
                "certainty": "PACMan Probability",
            }
        )
        prop_table = data.sort_values("Proposal Number").set_index("Proposal Number")
        self.prop_table = prop_table

    def parse_hand_class(self):
        return

    def calculate_alternate_categories(self):
        basic_table = self.prop_table
        model_table = self.model_results.T
        alternate_cat_dict = {}
        for index, row in basic_table.iterrows():
            alt_cat_row = model_table[index]
            alternate_cat_dict[index] = (
                alt_cat_row[
                    alt_cat_row.index.difference(
                        ["Encoded Model Classification", "Model Classification"]
                    )
                ]
                .sort_values(ascending=False)
                .to_dict()
            )
        self.alternate_cat_dict = alternate_cat_dict

    def get_prop_table(self, start_row=None, end_row=None):
        prop_response = self.prop_table[start_row:end_row].T.to_dict()
        for key in prop_response.keys():
            prop_response[key]["Alternate Categories"] = self.alternate_cat_dict[key]
        return prop_response


class DupCat:
    def __init__(self, output_dir, cycle_number=None) -> None:
        dup_fpath = output_dir / "store" / f"{cycle_number}_duplications.txt"
        self.data = self.parse_duplicates(dup_fpath)

    def parse_duplicates(self, dup_fpath):
        data = pd.read_csv(
            dup_fpath,
            header=None,
            names=["Proposal 1", "Proposal 2", "Similarity"],
            delimiter=" ",
        )
        data["Proposal Set"] = data.apply(
            lambda row: frozenset([row["Proposal 1"], row["Proposal 2"]]), axis=1
        )
        data["Sorted Set"] = data["Proposal Set"].apply(lambda s: tuple(sorted(s)))
        data = data.drop_duplicates(subset="Sorted Set")
        data = data.drop(columns=["Proposal Set", "Sorted Set"])
        data[["Proposal 1", "Proposal 2"]] = data[["Proposal 1", "Proposal 2"]].astype(
            str
        )
        data["Cycle 1"] = data["Proposal 1"].str[:6]
        data["Proposal 1 Number"] = data["Proposal 1"].str[6:].astype(int)
        data["Cycle 2"] = data["Proposal 2"].str[:6]
        data["Proposal 2 Number"] = data["Proposal 2"].str[6:].astype(int)
        data = data.drop(columns=["Proposal 1", "Proposal 2"])
        data = data.set_index(["Cycle 1", "Proposal 1 Number", "Proposal 2 Number"])
        self.data = data
        return data

    def get_for_cycle(self, cycle=None):
        cycle_data = self.data[self.data.index.get_level_values("Cycle 1") == cycle]
        return cycle_data

    def get_counts_for_cycle(self, cycle=None):
        cycle_data = self.get_for_cycle(cycle)
        counts = (
            cycle_data.droplevel(0)
            .reset_index()
            .groupby("Proposal 1 Number")["Proposal 2 Number"]
            .nunique()
            .to_dict()
        )
        return counts


class DataHandler:
    def __init__(
        self,
        celery_task_id,
        process_data=True,
        run_name=None,
        alternate_pacman_path=None,
        runs_dir=None,
    ):
        self.celery_task_id = celery_task_id

        self.pacman_path = Config.PACMAN_PATH
        if alternate_pacman_path is not None:
            self.pacman_path = alternate_pacman_path

        if not runs_dir:
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

    def parse_txt_files(self, filename, filepath):
        with open(filepath, "r") as f:
            data = f.read()
            if self.process_data:
                if filename == "duplications":
                    data = pd.read_csv(
                        StringIO(data),
                        header=None,
                        names=["Proposal 1", "Proposal 2", "Similarity"],
                        delimiter=" ",
                    )
                else:
                    data = pd.read_csv(StringIO(data))
                    if filename == "recategorization":
                        self.parse_recategorization(data)
        return data

    def store_files(self):
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
                    data = self.parse_txt_files(filename, filepath)
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

    def duplicate_proposals_output(self):
        return {"duplications": self.duplications}

    def reviewer_match_output(
        self,
        panelists=False,
        conflicts=False,
        assignments=True,
        match_check=False,
        query=False,
    ):
        res = {}
        if panelists:
            res["panelists"] = self.panelists_pkl
        if conflicts:
            res["panelists_conflicts"] = self.panelists_conflicts_pkl
        if assignments:
            res["assignments"] = self.assignments
        if match_check:
            res["panelists_match_check"] = self.panelists_match_check_pkl
        if query:
            res["panelists_query"] = self.panelists_query_pkl
        return res


@outputs_bp.route("/proposal_cat_output/<result_id>", methods=["GET"])
@login_required
def proposal_cat_output(result_id):
    options = request.args.to_dict(flat=True)
    out = DataHandler(celery_task_id=result_id, process_data=True)
    out.store_files()
    options = {k: ast.literal_eval(v) for k, v in options.items()}
    result = out.proposal_cat_output(**options)
    return json.dumps(result)


@outputs_bp.route("/duplicates_output/<result_id>", methods=["GET"])
@login_required
def duplicates_output(result_id):
    out = DataHandler(celery_task_id=result_id, process_data=True)
    out.store_files()
    return out.duplicate_proposals_output()


@outputs_bp.route("/match_reviewers_output/<result_id>", methods=["GET"])
@login_required
def match_reviewers_output(result_id):
    options = request.args.to_dict(flat=True)
    out = DataHandler(celery_task_id=result_id, process_data=True)
    out.store_files()
    options = {k: ast.literal_eval(v) for k, v in options.items()}
    return out.reviewer_match_output(**options)
