/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
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
  const [terminateProcessBtn, setTerminateProcessBtn] = useState(false);
  const [currentCycle, setCurrentCycle] = useState();

  // state variables for other config options
  const [runName, setRunName] = useState();
  const [modalFile, setModalFile] = useState();
  const [numberOfTopReviewers, setNumberOfTopReviewers] = useState();
  const [closeCollaboratorTimeFrame, setCloseCollaboratorTimeFrame] =
    useState();

  useEffect(() => {
    async function fetchLogs() {
      if (!currentId) {
        return;
      }

      const eventSource = new EventSource(
        `http://127.0.0.1:5000/api/stream/${currentId}?api_key=barebones`
      );

      eventSource.onopen = () => {
        setShowLogs(true);
        setTerminateProcessBtn(true);
      };

      eventSource.onmessage = (event) => {
        const newLog = event.data;
        if (
          newLog.includes("PROCESS COMPLETE") ||
          newLog.includes("run complete")
        ) {
          eventSource.close();
          setTerminateProcessBtn(false);
        }
        setLogs((prevLogs) => [...prevLogs, newLog]);
      };

      eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
        setTerminateProcessBtn(false);
      };
    }

    fetchLogs();
  }, [currentId, setLogs, setShowLogs]);

  const numbers = [
    123456, 987654, 456789, 567890, 234567, 890123, 345678, 678901, 789012,
    172345,
  ];
  const handleClick = async (event) => {
    event.preventDefault();

    // Call the first API to get the task ID
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
        />
      ) : showLogs ? (
        <Logs
          data={logs}
          setShowTable={setShowTable}
          currentId={currentId}
          terminateProcessBtn={terminateProcessBtn}
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
