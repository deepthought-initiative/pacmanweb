/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import "../../css/searchBox.css";
import DropdownConfigOption from "../util/DropdownConfigOption";
import Logs from "../util/Logs";
import OtherConfigOptions from "../util/OtherConfigOptions";
import TableForDuplicationChecker from "./TableForDuplicationChecker";

const ProposalDuplicationChecker = ({ allCycles, modalFile, setModalFile }) => {
  const [showTable, setShowTable] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);
  const [currentId, setCurrentId] = useState();
  const [showTerminateProcess, setShowTerminateProcess] = useState(true);
  const [currentCycle, setCurrentCycle] = useState();
  const [pastCycle, setPastCycle] = useState([]);

  // state variables for other config options
  const [runName, setRunName] = useState("Sample Run Name");
  const [numberOfTopReviewers, setNumberOfTopReviewers] = useState(5);
  const [closeCollaboratorTimeFrame, setCloseCollaboratorTimeFrame] =
    useState(3);
  const handleClick = async (event) => {
    event.preventDefault();
    const spawnResponse = await fetch(
      `http://127.0.0.1:5000/api/run_pacman?mode=DUP&past_cycles=221026,231026&main_test_cycle=${currentCycle}`,
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
  };

  const filteredCycles = allCycles.filter((cycle) => {
    return cycle !== currentCycle;
  });

  const handlePastCycles = () => {};
  return (
    <div className="mt-5" id="main-container">
      <div className="row">
        <div className="col-md-6">
          <DropdownConfigOption
            data={allCycles}
            label="Selected Current Cycle"
            desc="Prefix used throughout script to match with cycle description"
            defaultValue="Select a current cycle"
            setCycle={setCurrentCycle}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Selected Past Cycle</label>
          <div>
            <select
              className="form-select rounded-0 border-2"
              onChange={handlePastCycles}
              size="2"
              multiple
            >
              <option disabled selected value="">
                Select a past cycle
              </option>
              {filteredCycles &&
                filteredCycles.map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-text text-start mt-2">
            Cycle prefixes of past cycles
          </div>
        </div>
      </div>
      {showTable ? (
        <TableForDuplicationChecker
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
          button_label="Find Duplicates"
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
    </div>
  );
};

export default ProposalDuplicationChecker;
