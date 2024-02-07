/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import "../../css/searchBox.css";
import DropdownConfigOption from "../util/DropdownConfigOption";
import Logs from "../util/Logs";
import OtherConfigOptions from "../util/OtherConfigOptions";
import TableMatchReviewers from "./TableMatchReviewers";

const MatchReviewers = ({ allCycles, modalFile, setModalFile }) => {
  const [showTable, setShowTable] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);
  const [currentId, setCurrentId] = useState();
  const [showTerminateProcess, setShowTerminateProcess] = useState(true);
  const [currentCycle, setCurrentCycle] = useState();

  // state variables for other config options
  const [runName, setRunName] = useState("Sample Run Name");
  const [numberOfTopReviewers, setNumberOfTopReviewers] = useState(5);
  const [closeCollaboratorTimeFrame, setCloseCollaboratorTimeFrame] =
    useState(3);

  const handleClick = async (event) => {
    event.preventDefault();
    const spawnResponse = await fetch(
      `http://127.0.0.1:5000/api/run_pacman?mode=MATCH&&main_test_cycle=${currentCycle}&modelfile=${modalFile}&assignment_number_top_reviewers=${numberOfTopReviewers}&close_collaborator_time_frame=${closeCollaboratorTimeFrame}`,
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
              defaultValue="Select a current cycle"
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
            runName={runName}
            modalFile={modalFile}
            numberOfTopReviewers={numberOfTopReviewers}
            closeCollaboratorTimeFrame={closeCollaboratorTimeFrame}
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
