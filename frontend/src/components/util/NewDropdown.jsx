/* eslint-disable react/prop-types */
import { useState } from "react";
import ErrorMessage from "../util/ErrorMessage.jsx";

const NewDropdown = ({
  data,
  label,
  desc,
  setValue,
  placeholderText,
  disabled,
  error,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const handleOptionClick = (value) => {
    setSelectedValue(value);
    setDropdownOpen(false);
    setValue(value);
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="dropdown-container">
      <div className="option-header">
        <label className="form-label">{label}</label>
        {error && <ErrorMessage message={error} />}
      </div>
      <div
        // className={`dropdown-list-box ${dropdownOpen ? "open" : ""}`}
        className="sample"
        onClick={handleDropdownToggle}
        disabled={disabled}
      >
        <ul
        // className={`dropdown-list ${dropdownOpen ? "open" : ""}`}
        >
          {data.map((value) => (
            <li
              key={value}
              //   className={`dropdown-item ${
              //     selectedValue === value ? "selected" : ""
              //   }`}
              onClick={() => handleOptionClick(value)}
            >
              {value}
            </li>
          ))}
        </ul>
      </div>
      <div className="form-text text-start mt-2">{desc}</div>
    </div>
  );
};

export default NewDropdown;
