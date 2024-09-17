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
    logLevel: "info",
    mode: "DUP"
  };
  const [inputFields, setInputFields] = useState(defaultInputFields);
  return (
    <PageComponent
      key={allCycles.join(",")}
      allCycles={allCycles}
      mode={inputFields.mode}
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
