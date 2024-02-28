/* eslint-disable react/prop-types */
import { useState } from "react";
import ErrorMessage from "../util/ErrorMessage.jsx";

const NewDropdown = ({ data, label, desc, setValue, disabled, error }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const handleOptionClick = (value) => {
    setSelectedValue(value);
    setValue(value);
    setDropdownOpen(false);
  };

  const handleDropdownToggle = () => {
    setDropdownOpen((prevOpen) => !prevOpen);
  };

  return (
    <div className="dropdown-container">
      <div className="option-header">
        <label className="form-label">{label}</label>
        {error && <ErrorMessage message={error} />}
      </div>
      <div
        className={`sample ${disabled ? "disabled" : ""}`}
        onClick={handleDropdownToggle}
      >
        {selectedValue || data[0]}{" "}
      </div>
      <div className="form-text text-start mt-2">{desc}</div>
      {dropdownOpen && !disabled && (
        <div className="gg">
          <div className="dropdown-list">
            <ul>
              {data.map((value) => (
                <li
                  key={value}
                  onClick={() => handleOptionClick(value)}
                  className={selectedValue === value ? "selected" : ""}
                >
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewDropdown;
