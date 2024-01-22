import React from 'react';
import "../css/searchBox.css";
import DropdownConfigOption from "./DropdownConfigOption";
import OtherConfigOptions from "./OtherConfigOptions";

const ProposalDuplicationChecker = () => {
  const numbers = [123456, 987654, 456789, 567890, 234567, 890123, 345678, 678901, 789012, 172345];

  return (
    <div className="mt-5" id="main-container">
      <form>
        <div className='row'>
          <div className='col-md-6'>
            <DropdownConfigOption data={numbers} label="Selected Current Cycle" desc="Prefix used throughout script to match with cycle description"/>
          </div>
          <div className='col-md-6'>
            <DropdownConfigOption data={numbers} label="Selected Past Cycle" desc="Cycle prefixes of past cycles"/>
          </div>
        </div>
        <OtherConfigOptions />  
      </form>
    </div>
  )
}

export default ProposalDuplicationChecker