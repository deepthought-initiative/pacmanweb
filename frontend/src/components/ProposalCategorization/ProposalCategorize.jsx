/* eslint-disable no-unused-vars */
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

  useEffect(() => {
    async function fetchLogs() {
      if (!currentId) {
        return;
      }
      const sse = new EventSource(
        `http://127.0.0.1:5000/api/stream/${currentId}?api_key=barebones`
      );
      sse.onmessage = (e) => setLogs((prevLogs) => prevLogs.concat(e.data));
      sse.onerror = () => {
        // error log here
        sse.close();
      };
      setShowLogs(true);
      return () => {
        sse.close();
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

    let headers = new Headers();

    headers.append("Content-Type", "application/json");

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
        <Logs data={logs} setShowTable={setShowTable} currentId={currentId} />
      ) : (
        <OtherConfigOptions
          button_label="Categorize Proposal"
          handleClick={handleClick}
        />
      )}
    </div>
  );
};

export default ProposalCategorize;
