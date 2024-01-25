/* eslint-disable no-unused-vars */

import { useState } from "react";
import "../../css/searchBox.css";
import DropdownConfigOption from "../util/DropdownConfigOption";
import Logs from "../util/Logs";
import OtherConfigOptions from "../util/OtherConfigOptions";
import ProposalTable from "./ProposalTable";

const ProposalCategorize = () => {
  const [showTable, setShowTable] = useState(false)
  const [showLogs, setShowLogs] = useState(false)
  const [logs, setLogs] = useState([]);
  
  const numbers = [123456, 987654, 456789, 567890, 234567, 890123, 345678, 678901, 789012, 172345];
  const handleClick = async(event) => {
    event.preventDefault();
    
    let headers = new Headers();

    headers.append("Content-Type", "application/json");
      
    // Call the first API to get the task ID
    const spawnResponse = await fetch("http://127.0.0.1:5000/api/run_pacman?categorize_one_cycle=true&get_science_categories=true&main_test_cycle=221026", {
    method: "GET",
    headers: { Authorization: "Basic " + btoa("default:barebones") },
    });

  const data = await spawnResponse.json();
  const currentId = data["result_id"]
  const streamResponse = await fetch(`http://127.0.0.1:5000/api/stream/${currentId}?api_key=barebones`, {
    method: "GET",
    headers: { Authorization: "Basic " + btoa("default:barebones") },
    });
    setShowLogs(true)
    const allLogs = await streamResponse.text();
    setLogs(allLogs.split('\n'))
  }
  return (
    <div className="mt-5" id="main-container">
      <form>
        <div className='row'>
          <div>
            <DropdownConfigOption data={numbers} label="Selected Current Cycle" desc="Prefix used throughout script to match with cycle description"/>
          </div>
        </div>
        {showTable ? (
          <ProposalTable />
        ) 
        : 
        (
          showLogs ? (
            <Logs data={logs} setShowTable={setShowTable}/>
          ) : (
            <OtherConfigOptions button_label="Categorize Proposal" handleClick={handleClick}/>
          )
        )}
      </form>
    </div>
  )
}

export default ProposalCategorize