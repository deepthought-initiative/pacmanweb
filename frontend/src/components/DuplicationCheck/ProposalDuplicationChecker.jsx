/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "../../css/searchBox.css";
import DropdownConfigOption from "../util/DropdownConfigOption";
import Logs from "../util/Logs";
import OtherConfigOptions from "../util/OtherConfigOptions";
import TableForDuplicationChecker from "./TableForDuplicationChecker";

const ProposalDuplicationChecker = ({ currentId, setCurrentId }) => {
  const [showTable, setShowTable] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);

  const numbers = [
    123456, 987654, 456789, 567890, 234567, 890123, 345678, 678901, 789012,
    172345,
  ];

  useEffect(() => {
    async function fetchLogs() {
      if (!currentId) {
        return;
      }
      const streamResponse = await fetch(
        `http://127.0.0.1:5000/api/stream/${currentId}?api_key=barebones`,
        {
          method: "GET",
          headers: { Authorization: "Basic " + btoa("default:barebones") },
        }
      );
      setShowLogs(true);
      const allLogs = await streamResponse.text();
      setLogs(allLogs.split("\n"));
    }
    fetchLogs();
  }, [currentId, setLogs, setShowLogs]);

  const handleClick = async (event) => {
    event.preventDefault();

    // Call the first API to get the task ID
    const spawnResponse = await fetch(
      "http://127.0.0.1:5000/api/run_pacman?mode=DUP&past_cycles=221026,231026&main_test_cycle=221026",
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
      <form>
        <div className="row">
          <div className="col-md-6">
            <DropdownConfigOption
              data={numbers}
              label="Selected Current Cycle"
              desc="Prefix used throughout script to match with cycle description"
            />
          </div>
          <div className="col-md-6">
            <DropdownConfigOption
              data={numbers}
              label="Selected Past Cycle"
              desc="Cycle prefixes of past cycles"
            />
          </div>
        </div>
        {showTable ? (
          <TableForDuplicationChecker
            currentId={currentId}
            setShowTable={setShowTable}
            setShowLogs={setShowLogs}
          />
        ) : showLogs ? (
          <Logs data={logs} setShowTable={setShowTable} currentId={currentId} />
        ) : (
          <OtherConfigOptions
            button_label="Find Duplicates"
            handleClick={handleClick}
          />
        )}
      </form>
    </div>
  );
};

export default ProposalDuplicationChecker;
