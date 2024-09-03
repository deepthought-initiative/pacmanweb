/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState } from "react";
import "../../css/searchBox.css";
import PageComponent from "../util/PageComponent.jsx";
import CategorizationForm from "./CategorizationForm.jsx";
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
    mode: "PROP",
  };
  const [inputFields, setInputFields] = useState(defaultInputFields);

  useEffect(() => {
    if (progressPercentage === 100) {
      if (processStatus === 200 || processStatus === 204) {
        setToastVariant("success");
      } else {
        setToastVariant("danger");
      }
      setShowToast(true);
    }
  }, [progressPercentage, processStatus, setShowToast, setToastVariant]);

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
      setModalFile={setModalFile}
      renderFormComponent={(props) => <CategorizationForm {...props} />}
      renderTableComponent={(props) => <CategorizationTable {...props} />}
      button_label="Categorize Proposals"
    />
  );
};

export default CategorizationPage;
