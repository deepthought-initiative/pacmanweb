/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import "../../css/searchBox.css";
import DropdownConfigOption from "../util/DropdownConfigOption";
import Logs from "../util/Logs";
import OtherConfigOptions from "../util/OtherConfigOptions";
import ProposalTable from "./ProposalTable";

const ProposalCategorize = () => {
  const [showTable, setShowTable] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);
  const [currentId, setCurrentId] = useState();
  const [showTerminateProcess, setShowTerminateProcess] = useState(true);
  const [currentCycle, setCurrentCycle] = useState();

  // state variables for other config options
  const [runName, setRunName] = useState();
  const [modalFile, setModalFile] = useState();
  const [numberOfTopReviewers, setNumberOfTopReviewers] = useState();
  const [closeCollaboratorTimeFrame, setCloseCollaboratorTimeFrame] =
    useState();

  const numbers = [
    123456, 987654, 456789, 567890, 234567, 890123, 345678, 678901, 789012,
    172345,
  ];
  const handleClick = async (event) => {
    event.preventDefault();
    const spawnResponse = await fetch(
      "http://127.0.0.1:5000/api/run_pacman?mode=PROP&main_test_cycle=221026",
      {
        method: "GET",
        headers: {
          Authorization: "Basic " + btoa("default:barebones"),
          "Content-Type": "application/json",
        },
      }
    );

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
            data={numbers}
            label="Selected Current Cycle"
            desc="Prefix used throughout script to match with cycle description"
            setCycle={setCurrentCycle}
          />
        </div>
      </div>
      {showTable ? (
        <ProposalTable
          currentId={currentId}
          setShowTable={setShowTable}
          setShowLogs={setShowLogs}
          onCategorizeAnotherCycle={onTerminate}
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
          setModalFile={setModalFile}
          setRunName={setRunName}
          setNumberOfTopReviewers={setNumberOfTopReviewers}
          setCloseCollaboratorTimeFrame={setCloseCollaboratorTimeFrame}
        />
      )}
    </div>
  );
};

export default ProposalCategorize;
