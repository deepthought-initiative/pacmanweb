/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState } from "react";
import "../../css/searchBox.css";
import PageComponent from "../util/PageComponent.jsx";
import DuplicationForm from "./DuplicationForm";
import DuplicationTable from "./DuplicationTable";

const DuplicationPage = ({
  allCycles,
  logLevelOptions
}) => {
  const defaultInputFields = {
    currentCycle: "",
    runName: "",
    pastCycle: [],
    selectedModal: "strolger_pacman_model_7cycles.joblib",
    logLevel: "info",
  };
  const [inputFields, setInputFields] = useState(defaultInputFields);
  return (
    <PageComponent
      allCycles={allCycles}
      mode="DUP"
      logLevelOptions={logLevelOptions}
      inputFields={inputFields}
      setInputFields={setInputFields}
      defaultInputFields={defaultInputFields}
      renderFormComponent={(props) => <DuplicationForm {...props} />}
      renderTableComponent={(props) => <DuplicationTable {...props} />}
      button_label="Find Duplicates"
    />
  );
};

export default DuplicationPage;
