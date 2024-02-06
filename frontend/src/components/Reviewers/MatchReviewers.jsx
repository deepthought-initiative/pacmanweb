/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import "../../css/searchBox.css";
import DropdownConfigOption from "../util/DropdownConfigOption";
import Logs from "../util/Logs";
import OtherConfigOptions from "../util/OtherConfigOptions";
import TableMatchReviewers from "./TableMatchReviewers";

const MatchReviewers = ({ allCycles }) => {
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

  const handleClick = async (event) => {
    event.preventDefault();
    const spawnResponse = await fetch(
      "http://127.0.0.1:5000/api/run_pacman?mode=MATCH&main_test_cycle=221026",
      {
        method: "GET",
        headers: {
          Authorization: "Basic " + btoa("default:barebones"),
          "Content-Type": "application/json",
        },
      }
    );

    const data = await spawnResponse.json();
    console.log(data["result_id"]);
    setCurrentId(data["result_id"]);
    setShowLogs(true);
  };

  const onTerminate = () => {
    setCurrentId(undefined);
    setShowLogs(false);
    setShowTable(false);
  };

  return (
    <div className="mt-5" id="main-container">
      <form>
        <div className="row">
          <div>
            <DropdownConfigOption
              data={allCycles}
              label="Selected Current Cycle"
              desc="Prefix used throughout script to match with cycle description"
              setCycle={setCurrentCycle}
            />
          </div>
        </div>
        {showTable ? (
          <TableMatchReviewers
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
            button_label="Match Reviewers"
            handleClick={handleClick}
            setModalFile={setModalFile}
            setRunName={setRunName}
            setNumberOfTopReviewers={setNumberOfTopReviewers}
            setCloseCollaboratorTimeFrame={setCloseCollaboratorTimeFrame}
          />
        )}
      </form>
    </div>
  );
};

export default MatchReviewers;
