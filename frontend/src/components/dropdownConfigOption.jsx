import React from 'react';
import "../css/dropdownConfigOption.css";

const DropdownConfigOption = ({ data, label, desc }) => {
  return (
    <div className="dropdown-container">
      <label className="form-label" htmlFor="CurrentCycle">{label}</label>
      <div className="select-wrapper">
        <select id="CurrentCycle" className="form-select" aria-label="Select Current Cycle">
          {data.map((number) => (
            <option key={number} value={number}>
              {number}
            </option>
          ))}
        </select>
      </div>
      <div className='form-text text-start mt-2'>{desc}</div> 
    </div>
  );
};

export default DropdownConfigOption;
