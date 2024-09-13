/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState } from "react";
import "../../css/searchBox.css";
import PageComponent from "../util/PageComponent.jsx";
import MatchReviewersForm from "./MatchReviewersForm";
import MatchReviewersTable from "./MatchReviewersTable";

const MatchReviewersPage = ({
  allCycles,
  logLevelOptions,
  modalFile,
  setModalFile,
}) => {
  const defaultInputFields = {
    currentCycle: "",
    panelistNames: [],
    runName: "",
    numberOfTopReviewers: 5,
    closeCollaboratorTimeFrame: 3,
    logLevel: "info",
    selectedModal: "strolger_pacman_model_7cycles.joblib",
    mode: "MATCH",
  };
  const [inputFields, setInputFields] = useState(defaultInputFields);

  return (
    <PageComponent
      key={allCycles.join(",")}
      allCycles={allCycles}
      mode={inputFields.mode}
      modalFile={modalFile}
      logLevelOptions={logLevelOptions}
      inputFields={inputFields}
      setInputFields={setInputFields}
      defaultInputFields={defaultInputFields}
      renderFormComponent={(props) => <MatchReviewersForm {...props} />}
      renderTableComponent={(props) => <MatchReviewersTable {...props} />}
      button_label="Match Reviewers"
      setModalFile={setModalFile}
    />
  );
};

export default MatchReviewersPage;
