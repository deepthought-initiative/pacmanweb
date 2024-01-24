import { useState } from "react";
import "../../css/searchBox.css";
import DropdownConfigOption from "../util/DropdownConfigOption";
import OtherConfigOptions from "../util/OtherConfigOptions";
import TableForDuplicationChecker from "./TableForDuplicationChecker";

const ProposalDuplicationChecker = () => {
  const [showTable, setShowTable] = useState(false);

  const numbers = [123456, 987654, 456789, 567890, 234567, 890123, 345678, 678901, 789012, 172345];
  const handleClick = () => {
    let headers = new Headers();

    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    fetch("http://127.0.0.1:5000/api/run_pacman?past_cycles=221026,231026&categorize_one_cycle=true&get_science_categories=true", {
      method: "GET",
      headers: { Authorization: "Basic " + btoa("default:barebones") },
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
    setShowTable(!showTable);
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
            <DropdownConfigOption data={numbers} label="Selected Past Cycle" desc="Cycle prefixes of past cycles" />
          </div>
        </div>
        {showTable ? <TableForDuplicationChecker /> : <OtherConfigOptions button_label="Find Duplicates" handleClick={handleClick} />}
      </form>
    </div>
  );
};

export default ProposalDuplicationChecker;
