/* eslint-disable react/prop-types */

import { useState } from "react";
import "../../css/searchBox.css";
import DropdownConfigOption from "../util/DropdownConfigOption";
import Logs from "../util/Logs";
import OtherConfigOptions from "./OtherConfigOptions";

const SinglePage = ({
  allCycles,
  modalFile,
  mode,
  renderTableComponent,
  button_label,
}) => {
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
  const [pastCycle, setPastCycle] = useState([]);
  const bothPastandCurrentCycles = [...pastCycle, currentCycle];

  const handleClick = async (event) => {
    event.preventDefault();
    var spawnResponse;
    if (mode == "DUP") {
      spawnResponse = await fetch(
        `/api/run_pacman?mode=${mode}&past_cycles=${bothPastandCurrentCycles.toString()}&main_test_cycle=${currentCycle}&modelfile=${selectedModal}&assignment_number_top_reviewers=${numberOfTopReviewers}&close_collaborator_time_frame=${closeCollaboratorTimeFrame}`,
        {
          method: "GET",
          headers: {
            Authorization: "Basic " + btoa("default:barebones"),
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      spawnResponse = await fetch(
        `/api/run_pacman?mode=${mode}&main_test_cycle=${currentCycle}&modelfile=${selectedModal}&assignment_number_top_reviewers=${numberOfTopReviewers}&close_collaborator_time_frame=${closeCollaboratorTimeFrame}`,
        {
          method: "GET",
          headers: {
            Authorization: "Basic " + btoa("default:barebones"),
            "Content-Type": "application/json",
          },
        }
      );
    }
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
  const filteredCycles = allCycles.filter((cycle) => {
    return cycle !== currentCycle;
  });

  const handlePastCycles = (event) => {
    const options = Array.from(event.target.selectedOptions).map(
      (option) => option.value
    );
    setPastCycle(options);
  };

  return (
    <form onSubmit={handleClick}>
      <div className="mt-5" id="main-container">
        <div className="row">
          <div className={mode === "DUP" && "col-md-6"}>
            <DropdownConfigOption
              data={allCycles}
              label="Selected Current Cycle"
              desc="Prefix used throughout script to match with cycle description"
              placeholderText="Select a current cycle"
              setValue={setCurrentCycle}
              disabled={showTable || showLogs}
            />
          </div>
          {mode === "DUP" && (
            <div className="col-md-6">
              <label className="form-label">Selected Past Cycle</label>
              <div>
                <select
                  className="form-select rounded-0 border-2"
                  onChange={handlePastCycles}
                  size="2"
                  defaultValue={["DEFAULT"]}
                  multiple
                  disabled={showLogs || showTable}
                >
                  <option disabled value={"DEFAULT"}>
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
          )}
        </div>
        {showTable ? (
          renderTableComponent({
            currentId: currentId,
            setShowTable: setShowTable,
            setShowLogs: setShowLogs,
            onCategorizeAnotherCycle: onTerminate,
            currentCycle: currentCycle,
          })
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
            button_label={button_label}
            handleClick={handleClick}
            runName={runName}
            modalFile={modalFile}
            numberOfTopReviewers={numberOfTopReviewers}
            closeCollaboratorTimeFrame={closeCollaboratorTimeFrame}
            setSelectedModal={setSelectedModal}
            setRunName={setRunName}
            setNumberOfTopReviewers={setNumberOfTopReviewers}
            setCloseCollaboratorTimeFrame={setCloseCollaboratorTimeFrame}
          />
        )}
      </div>
    </form>
  );
};

export default SinglePage;