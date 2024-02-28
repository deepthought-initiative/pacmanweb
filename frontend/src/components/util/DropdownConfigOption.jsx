/* eslint-disable react/prop-types */
import { useState } from "react";
import ErrorMessage from "../util/ErrorMessage.jsx";

const DropdownConfigOption = ({
  data,
  label,
  desc,
  setValue,
  placeholderText,
  disabled,
  error,
}) => {
  const [dropdownClicked, setDropdownClicked] = useState(false);

  const handleOnChange = (event) => {
    setValue(event.target.value);
    console.log(event.target.value);
  };

  const handleDropdownClick = (event) => {
    setDropdownClicked(!dropdownClicked);
    // Prevent default behavior to prevent potential form submission
    event.preventDefault();
  };

  return (
    <div className="dropdown-container">
      <div className="option-header">
        <label className="form-label" htmlFor="CurrentCycle">
          {label}
        </label>
        {error && <ErrorMessage message={error} />}
      </div>
      <div
        className={`dropdown-wrapper ${
          dropdownClicked ? "expanded overflow-auto" : ""
        }`}
        style={{ position: "relative" }}
      >
        <select
          id="CurrentCycle"
          className={`form-select rounded-0 border-2 dropdown-wrapper ${
            dropdownClicked ? "expanded overflow-auto" : ""
          }`}
          aria-label="Select Current Cycle"
          size="3"
          onChange={handleOnChange}
          onClick={handleDropdownClick}
          disabled={disabled}
        >
          {data &&
            data.map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
        </select>
      </div>
      <div className="form-text text-start mt-2">{desc}</div>
    </div>
  );
};

export default DropdownConfigOption;
