/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import {useState } from "react";
import "../../css/searchBox.css";
import PageComponent from "../util/PageComponent.jsx";
import CategorizationForm from "./CategorizationForm.jsx"
import CategorizationTable from "./CategorizationTable";

const CategorizationPage = ({
  allCycles,
  modalFile,
  setModalFile,
  logLevelOptions,
  showToast,
  setShowToast,
  toastVariant,
  setToastVariant,
}) => {
  const defaultInputFields = {
    currentCycle: "",
    runName: "",
    selectedModal: "strolger_pacman_model_7cycles.joblib",
    logLevel: "info",
  };
  const [inputFields, setInputFields] = useState(defaultInputFields);
  const [currentId, setCurrentId] = useState();

  return (
      <PageComponent
        allCycles={allCycles}
        mode="PROP"
        modalFile={modalFile}
        currentId={currentId}
        setCurrentId={setCurrentId}
        logLevelOptions={logLevelOptions}
        inputFields={inputFields}
        setInputFields={setInputFields}
        defaultInputFields={defaultInputFields}
        setModalFile={setModalFile}
        showToast={showToast}
        setShowToast={setShowToast}
        toastVariant={toastVariant}
        setToastVariant={setToastVariant}
        renderFormComponent={(props) => (
          <CategorizationForm {...props} />
        )}
        renderTableComponent={(props) => (
          <CategorizationTable {...props} />
        )}
        button_label="Categorize Proposals"
      />
  );
};

export default CategorizationPage;
