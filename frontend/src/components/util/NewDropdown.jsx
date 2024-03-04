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

  // useEffect(() => {
  //   const handleInputChange = () => {
  //     setInputField(inputField.filter((item) => item !== value));
  //   };
  //   handleInputChange();
  // }, []);

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
        <label className="custom-form-label">{label}</label>
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
          : inputField || " "}
        <div className={`triangle ${dropdownOpen ? "reverse" : ""}`}></div>
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
                  key={value.cycleNumber}
                  onClick={() => handleOptionClick(value.cycleNumber)}
                  className={
                    multiple
                      ? inputField.includes(value.cycleNumber)
                        ? "selected"
                        : ""
                      : inputField === value.cycleNumber
                      ? "selected"
                      : ""
                  }
                  style={value.style}
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
