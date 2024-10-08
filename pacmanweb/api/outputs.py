"""Flask Views for PACMan Outputs."""
import json
import re
import zipfile
from io import StringIO
from os import R_OK, access, stat

import pandas as pd
from flask import Blueprint, request, send_file
from flask_login import login_required

from pacmanweb import Config

outputs_bp = Blueprint("outputs", __name__, url_prefix="/outputs")


def make_records(dataframe):
    data = {index: list(item) for index, item in enumerate(dataframe.to_numpy())}
    data["columns"] = list(dataframe.columns)
    return data


class PropCat:
    def __init__(self, output_dir, cycle_number, celery_task_id) -> None:
        model_file_readable, recat_file_readable = True, True
        self.prop_response = {}
        try:
            self.model_file_fpath = next((output_dir / "model_results").iterdir())
        except StopIteration:
            model_file_readable = False
        if not model_file_readable and not access(self.model_file_fpath, R_OK):
            model_file_readable = False

        self.recat_fpath = output_dir / "store" / f"{cycle_number}_recategorization.txt"
        recat_file_readable = (
            self.recat_fpath.exists()
            and access(self.recat_fpath, R_OK)
            and not pd.read_csv(self.recat_fpath).empty
        )
        if not model_file_readable or not recat_file_readable:
            self.prop_response = {
                "value": "model generated file not found or recategorization file not found"
            }
        self.cycle_number = cycle_number
        self.celery_task_id = celery_task_id

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
        if self.prop_response != {}:
            # an error
            return self.prop_response, 500

        self.parse_model_results(self.model_file_fpath)
        self.parse_recategorization(self.recat_fpath)
        self.calculate_alternate_categories()
        prop_response = self.prop_table[start_row:end_row].T.to_dict()
        for key in prop_response.keys():
            prop_response[key]["Alternate Categories"] = self.alternate_cat_dict[key]
        return prop_response, 200

    def generate_prop_response_csv(self):
        if self.prop_response != {}:
            return self.prop_response, 500

        normal_table = self.prop_table
        alternate_categories_df = pd.DataFrame(self.alternate_cat_dict)
        alternate_categories_df.index.name = "PACMan Science Category"
        melted_alternate_categories_df = pd.melt(
            alternate_categories_df.reset_index(),
            id_vars="PACMan Science Category",
            value_name="PACMAN Probability",
            var_name="Proposal Number",
        )
        melted_alternate_categories_df = melted_alternate_categories_df.merge(
            normal_table[["Original Science Category"]],
            on="Proposal Number",
            how="left",
        )
        melted_alternate_categories_df.to_csv(
            Config.DOWNLOAD_FOLDER / f"{self.celery_task_id}_prop_cat.csv"
        )


class DupCat:
    def __init__(self, output_dir, cycle_number, celery_task_id) -> None:
        self.dup_fpath = output_dir / "store" / f"{cycle_number}_duplications.txt"
        self.response = {}
        self.response_code = 200
        if (
            not self.dup_fpath.exists()
            or not access(self.dup_fpath, R_OK)
        ):
            self.response = {
                "value": "duplications.txt file not accessible for this cycle."
            }
            self.response_code = 500
        elif stat(self.dup_fpath).st_size == 0:
            self.response = {
                "value": "duplications.txt file is empty."
            }
            self.response_code = 204
        self.celery_task_id = celery_task_id

    def parse_duplicates(self, dup_fpath):
        data = pd.read_csv(
            dup_fpath,
            header=None,
            names=["Proposal 1", "Proposal 2", "Similarity"],
            delimiter=" ",
        )
        # data["Proposal Set"] = data.apply(
        #     lambda row: frozenset([row["Proposal 1"], row["Proposal 2"]]), axis=1
        # )
        # data["Sorted Set"] = data["Proposal Set"].apply(lambda s: tuple(sorted(s)))
        # data = data.drop_duplicates(subset="Sorted Set")
        # data = data.drop(columns=["Proposal Set", "Sorted Set"])
        data[["Proposal 1", "Proposal 2"]] = data[["Proposal 1", "Proposal 2"]].astype(
            str
        )
        data["Cycle 1"] = data["Proposal 1"].str[:6]
        data["Proposal 1 Number"] = data["Proposal 1"].str[6:].astype(int)
        data["Cycle 2"] = data["Proposal 2"].str[:6]
        data["Proposal 2 Number"] = data["Proposal 2"].str[6:].astype(int)
        data = data.drop(columns=["Proposal 1", "Proposal 2"])
        data = data.set_index(["Cycle 1", "Proposal 1 Number", "Proposal 2 Number"])
        return data

    def get_for_cycle(self, cycle=None):
        if self.response != {}:
            return self.response, self.response_code
        self.data = self.parse_duplicates(self.dup_fpath)
        self.data = self.data.set_index("Cycle 2", append=True)
        cycle_data = self.data.droplevel(0).T.to_dict()        
        cycle_data = {str(key): value for key, value in cycle_data.items()}
        return cycle_data, 200

    def generate_dup_response_csv(self, cycle=None):
        if self.response != {}:
            return self.response, self.response_code
        self.data = self.parse_duplicates(self.dup_fpath)
        cycle_data = self.data[self.data.index.get_level_values("Cycle 1") == cycle]
        cycle_data.droplevel(0).to_csv(
            Config.DOWNLOAD_FOLDER / f"{self.celery_task_id}_dup.csv"
        )


class MatchRev:

    def __init__(self, output_dir, cycle_number, celery_task_id) -> None:
        self.output_dir = output_dir / "store"
        self.cycle_number = cycle_number
        self.celery_task_id = celery_task_id

    def read_nrecords(self):
        fname_suffix = "panelists.pkl"
        data = pd.read_pickle(
            self.output_dir / f"{str(self.cycle_number)}_{fname_suffix}"
        )
        nrecords_dict = dict(zip(data.fname, data.nrecords))
        return nrecords_dict

    def read_matches(self):
        fname_suffix = "panelists_match_check.pkl"
        try:
            data = pd.read_pickle(
                self.output_dir / f"{str(self.cycle_number)}_{fname_suffix}"
            )
        except:
            data = {"value": f"{fname_suffix} file not accessible for this cycle."}
            return data
        for key, value in data.items():
            data[key] = {k: v for k, v in value}
        return data

    def read_conflicts(self):
        fname_suffix = "panelists_conflicts.pkl"
        try:
            data = pd.read_pickle(
                self.output_dir / f"{str(self.cycle_number)}_{fname_suffix}"
            )
        except:
            data = {"value": f"{fname_suffix} file not accessible for this cycle."}
        return data

    def read_panelists(self):
        fname_suffix = "panelists.txt"
        try:
            data = pd.read_csv(
                self.output_dir / f"{str(self.cycle_number)}_{fname_suffix}"
            )
        except:
            data = {"value": f"{fname_suffix} file not accessible for this cycle."}
            return data
        data["prob"] = data.apply(
            lambda row: row[row["model_classification"].replace(" ", "_") + "_prob"],
            axis=1,
        )
        return data

    def make_main_table(self):
        data = self.read_panelists()
        if isinstance(data, dict):
            return {"value": "panelist file not accessible for this cycle."}
        data = data.drop(
            columns=[item for item in data.columns if item.endswith("_prob")]
            + ["encoded_model_classification"]
        )
        data["nrecords"] = data["fname"].map(self.read_nrecords())
        return data.T.to_dict()

    def complete_response(self):
        return {
            "Main Table": self.make_main_table(),
            "Proposal Assignments": self.read_matches(),
            "Conflicts": self.read_conflicts(),
        }, 200

    def get_complete_data_as_csv(self):
        main_table = pd.DataFrame(self.make_main_table()).T
        matches = pd.DataFrame(self.read_matches())
        conflicts = pd.DataFrame(self.read_conflicts())
        destination_dir = Config.DOWNLOAD_FOLDER / self.celery_task_id
        destination_dir.mkdir(parents=True, exist_ok=True)
        matches.index.name = "Proposal Number"
        melted_matches = pd.melt(
            matches.reset_index(), id_vars="Proposal Number", value_name="CS Score"
        )
        main_and_matches_df = pd.merge(
            main_table,
            melted_matches,
            left_on="fname",
            right_on="variable",
            how="outer",
        )
        conflicts.index.name = "Conflicts"
        melted_conflicts = pd.melt(
            conflicts.reset_index(),
            id_vars="Conflicts",
            value_name="#records",
        )
        main_and_conflicts_df = pd.merge(
            main_table,
            melted_conflicts,
            left_on="fname",
            right_on="variable",
            how="outer",
        )
        # Remove the 'variable' column
        main_and_matches_df.drop(columns=["variable"], inplace=True)
        main_and_conflicts_df.drop(columns=["variable"], inplace=True)
        destination_dir = Config.DOWNLOAD_FOLDER / self.celery_task_id
        csv_matches_output = main_and_matches_df.to_csv(
            destination_dir / f"{self.celery_task_id}_matches_rev.csv"
        )
        csv_conflicts_output = main_and_conflicts_df.to_csv(
            destination_dir / f"{self.celery_task_id}_conflicts_rev.csv"
        )
        return csv_matches_output, csv_conflicts_output


def data_handler(celery_task_id, cycle_number, mode):
    output_dir = Config.PACMAN_PATH / "runs" / celery_task_id
    if mode == "PROP":
        prop_cat = PropCat(
            output_dir=output_dir,
            cycle_number=cycle_number,
            celery_task_id=celery_task_id,
        )
        return prop_cat.get_prop_table()
    if mode == "DUP":
        dup_cat = DupCat(
            output_dir=output_dir,
            cycle_number=cycle_number,
            celery_task_id=celery_task_id,
        )
        return dup_cat.get_for_cycle(cycle=cycle_number)
    if mode == "MATCH":
        match = MatchRev(
            output_dir=output_dir,
            cycle_number=cycle_number,
            celery_task_id=celery_task_id,
        )
        return match.complete_response()


@outputs_bp.route("/proposal_cat_output/<result_id>", methods=["GET"])
@login_required
def proposal_cat_output(result_id):
    options = request.args.to_dict(flat=True)
    if "cycle_number" not in options.keys():
        return {
            "value": "Please provide a cycle number to get the proposal categorisation output."
        }, 500
    response = data_handler(
        celery_task_id=result_id, cycle_number=options["cycle_number"], mode="PROP"
    )

    return json.dumps(response)


@outputs_bp.route("/download/csv/<result_id>", methods=["GET"])
@login_required
def download_data_as_csv(result_id):
    options = request.args.to_dict(flat=True)
    mode = options["mode"]
    if "cycle_number" not in options.keys():
        return {
            "value": "Please provide a cycle number to get the proposal categorisation output."
        }, 500
    output_dir = Config.PACMAN_PATH / "runs" / result_id
    if mode == "PROP":
        prop_cat = PropCat(
            output_dir=output_dir,
            cycle_number=options["cycle_number"],
            celery_task_id=result_id,
        )
        prop_cat.get_prop_table()
        prop_cat.generate_prop_response_csv()
        return send_file(
            Config.DOWNLOAD_FOLDER / f"{result_id}_prop_cat.csv",
            mimetype="text/csv",
            download_name=f"{result_id}_prop_cat.csv",
            as_attachment=True,
        )
    if mode == "DUP":
        dup_cat = DupCat(
            output_dir=output_dir,
            cycle_number=options["cycle_number"],
            celery_task_id=result_id,
        )
        dup_cat.generate_dup_response_csv(options["cycle_number"])
        return send_file(
            Config.DOWNLOAD_FOLDER / f"{result_id}_dup.csv",
            mimetype="text/csv",
            download_name=f"{result_id}_dup.csv",
            as_attachment=True,
        )
    if mode == "MATCH":
        match = MatchRev(
            output_dir=output_dir,
            cycle_number=options["cycle_number"],
            celery_task_id=result_id,
        )
        match.get_complete_data_as_csv()
        local_match_rev_csv_path = Config.DOWNLOAD_FOLDER / result_id
        zip_path = Config.DOWNLOAD_FOLDER / f"{result_id}.zip"
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            for item in local_match_rev_csv_path.glob("**/*"):
                if item.is_file():
                    relative_path = item.relative_to(local_match_rev_csv_path)
                    zipf.write(item, arcname=str(relative_path))

        return send_file(
            zip_path,
            mimetype="application/zip",
            download_name=f"{result_id}_rev.zip",
            as_attachment=True,
        )


@outputs_bp.route("/download/zip/<result_id>", methods=["GET"])
@login_required
def download_data_as_zip(result_id):
    zip_path = Config.PACMAN_PATH / "runs" / result_id
    if not zip_path.is_dir():
        return "Directory not found"

    local_zip_path = Config.DOWNLOAD_FOLDER / f"{result_id}.zip"

    with zipfile.ZipFile(local_zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for item in zip_path.glob("**/*"):
            if item.is_file():
                relative_path = item.relative_to(zip_path)
                zipf.write(item, arcname=str(relative_path))

    return send_file(
        local_zip_path,
        mimetype="application/zip",
        download_name=f"{result_id}.zip",
        as_attachment=True,
    )


@outputs_bp.route("/duplicates_output/<result_id>", methods=["GET"])
@login_required
def duplicates_output(result_id):
    options = request.args.to_dict(flat=True)
    if "cycle_number" not in options.keys():
        return {
            "value": "Please provide a cycle number to get the duplicates output."
        }, 500
    response = data_handler(
        celery_task_id=result_id, cycle_number=options["cycle_number"], mode="DUP"
    )

    return json.dumps(response)


@outputs_bp.route("/match_reviewers_output/<result_id>", methods=["GET"])
@login_required
def match_reviewers_output(result_id):
    options = request.args.to_dict(flat=True)
    response = data_handler(
        celery_task_id=result_id, cycle_number=options["cycle_number"], mode="MATCH"
    )
    return json.dumps(response)