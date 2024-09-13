/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import ErrorMessage from "../util/ErrorMessage.jsx";

const NewDropdown = ({
  data,
  label,
  desc,
  multiple,
  inputField,
  setInputField,
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
    if (multiple) {
      const updatedInputField = inputField.includes(value)
        ? inputField.filter((item) => item !== value)
        : [...inputField, value];
      setInputField(updatedInputField);
    } else {
      setInputField(value);
      setDropdownOpen(false);
    }
  };

  const handleDropdownToggle = () => {
    setDropdownOpen((prevOpen) => !prevOpen);
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div className="option-header">
        <label
          className={`custom-form-label ${disabled ? "label-disabled" : ""} `}
          style={{ color: error ? "red" : "" }}
        >
          {label}
        </label>
      </div>
      <div
        className={`option-display ${error ? "required" : ""} ${
          disabled ? "disabled" : ""
        }`}
        onClick={handleDropdownToggle}
      >
        {multiple
          ? inputField.length > 0
            ? inputField.join(", ")
            : " "
          : <div className="input-field-selected-value">{inputField}</div> ||
            " "}
        <div
          className={`triangle ${dropdownOpen ? "reverse" : ""}`}
          style={{ right: error ? "60px" : "" }}
        ></div>
        {error && (
          <img
            src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e"
            alt="Exclamation Icon"
            className="error-sign"
          />
        )}
      </div>
      <div className="option-header">
        <div className="form-text text-start ms-4">{desc}</div>
        {error && <ErrorMessage message={error} />}
      </div>
      {dropdownOpen && !disabled && (
        <div className="dropdown-list-container">
          <div className="dropdown-list">
            <ul>
              {data.map((value) => (
                <li
                  key={value.cycleNumber || value.label}
                  onClick={() =>
                    handleOptionClick(value.cycleNumber || value.label)
                  }
                  className={
                    multiple
                      ? inputField.includes(value.cycleNumber || value.label)
                        ? "selected"
                        : ""
                      : inputField === (value.cycleNumber || value.label)
                      ? "selected"
                      : ""
                  }
                  style={value.style ? value.style : {}}
                >
                  {value.label}
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
