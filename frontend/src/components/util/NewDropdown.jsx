/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import ErrorMessage from "../util/ErrorMessage.jsx";

const NewDropdown = ({
  data,
  label,
  desc,
  currentCycle,
  setCurrentCycle,
  disabled,
  error,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleOptionClick = (value) => {
    setCurrentCycle(value);
    setDropdownOpen(false);
  };

  const handleDropdownToggle = () => {
    setDropdownOpen((prevOpen) => !prevOpen);
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div className="option-header">
        <label className="custom-form-label">{label}</label>
      </div>
      <div
        className={`sample ${disabled ? "disabled" : ""}`}
        onClick={handleDropdownToggle}
      >
        {currentCycle || " "}
      </div>
      <div className="option-header">
        <div className="form-text text-start ms-4">{desc}</div>
        {error && <ErrorMessage message={error} />}
      </div>
      {dropdownOpen && !disabled && (
        <div className="gg">
          <div className="dropdown-list">
            <ul>
              {data.map((value) => (
                <li
                  key={value}
                  onClick={() => handleOptionClick(value)}
                  className={currentCycle === value ? "selected" : ""}
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
