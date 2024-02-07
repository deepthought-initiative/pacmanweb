/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import "../../css/searchBox.css";
import DropdownConfigOption from "../util/DropdownConfigOption";
import Logs from "../util/Logs";
import OtherConfigOptions from "../util/OtherConfigOptions";
import ProposalTable from "./ProposalTable";

const ProposalCategorize = ({ allCycles, modalFile, setModalFile }) => {
  const [showTable, setShowTable] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);
  const [currentId, setCurrentId] = useState();
  const [showTerminateProcess, setShowTerminateProcess] = useState(true);
  const [currentCycle, setCurrentCycle] = useState();

  // state variables for other config options
  const [runName, setRunName] = useState("");
  const [selectedModal, setSelectedModal] = useState();
  const [numberOfTopReviewers, setNumberOfTopReviewers] = useState(5);
  const [closeCollaboratorTimeFrame, setCloseCollaboratorTimeFrame] =
    useState(3);

  const handleClick = async (event) => {
    event.preventDefault();
    const spawnResponse = await fetch(
      `${
        import.meta.env.VITE_BASE_URL
      }/api/run_pacman?mode=PROP&main_test_cycle=${currentCycle}&modelfile=${modalFile}&assignment_number_top_reviewers=${numberOfTopReviewers}&close_collaborator_time_frame=${closeCollaboratorTimeFrame}`,
      {
        method: "GET",
        headers: {
          Authorization: "Basic " + btoa("default:barebones"),
          "Content-Type": "application/json",
        },
      }
    );
    console.log(currentCycle);
    console.log(closeCollaboratorTimeFrame);
    console.log(numberOfTopReviewers);
    console.log(modalFile);

    const data = await spawnResponse.json();
    setCurrentId(data["result_id"]);
    setShowLogs(true);
  };

  const onTerminate = () => {
    setCurrentId(undefined);
    setShowLogs(false);
    setShowTable(false);
    setLogs([]);
  };

  return (
    <div className="mt-5" id="main-container">
      <div className="row">
        <div>
          <DropdownConfigOption
            data={allCycles}
            label="Selected Current Cycle"
            desc="Prefix used throughout script to match with cycle description"
            defaultValue="Select a current cycle"
            setCycle={setCurrentCycle}
            disabled={showTable || showLogs}
          />
        </div>
      </div>
      {showTable ? (
        <ProposalTable
          currentId={currentId}
          setShowTable={setShowTable}
          setShowLogs={setShowLogs}
          onCategorizeAnotherCycle={onTerminate}
          currentCycle={currentCycle}
        />
      ) : showLogs ? (
        <Logs
          setShowTable={setShowTable}
          currentId={currentId}
          onTerminate={onTerminate}
          logs={logs}
          setLogs={setLogs}
          showTerminateProcess={showTerminateProcess}
          setShowTerminateProcess={setShowTerminateProcess}
        />
      ) : (
        <OtherConfigOptions
          button_label="Categorize Proposal"
          handleClick={handleClick}
          runName={runName}
          modalFile={modalFile}
          numberOfTopReviewers={numberOfTopReviewers}
          closeCollaboratorTimeFrame={closeCollaboratorTimeFrame}
          setModalFile={setSelectedModal}
          setRunName={setRunName}
          setNumberOfTopReviewers={setNumberOfTopReviewers}
          setCloseCollaboratorTimeFrame={setCloseCollaboratorTimeFrame}
        />
      )}
    </div>
  );
};

export default ProposalCategorize;
