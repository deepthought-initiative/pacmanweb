
import { useState } from "react";
import "../../css/searchBox.css";
import DropdownConfigOption from "../util/DropdownConfigOption";
import OtherConfigOptions from "../util/OtherConfigOptions";
import ProposalTable from "./ProposalTable";

const ProposalCategorize = () => {
  const [showTable, setShowTable] = useState(false)

  const numbers = [123456, 987654, 456789, 567890, 234567, 890123, 345678, 678901, 789012, 172345];
  const handleClick = () =>{
    setShowTable(!showTable)
  }
  return (
    <div className="mt-5" id="main-container">
      <form>
        <div className='row'>
          <div>
            <DropdownConfigOption data={numbers} label="Selected Current Cycle" desc="Prefix used throughout script to match with cycle description"/>
          </div>
        </div>
        {showTable ?
        <ProposalTable />
        :
        <OtherConfigOptions button_label="Categorize Proposal" handleClick={handleClick}/>
        }
      </form>
    </div>
  )
}

export default ProposalCategorize