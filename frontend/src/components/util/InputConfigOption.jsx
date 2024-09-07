/* eslint-disable react/prop-types */
import { useCallback } from "react";
import ErrorMessage from "../util/ErrorMessage.jsx";

const InputConfigOption = ({
  label,
  desc,
  setValue,
  value,
  error,
  disabled,
}) => {
  const handleOnChange = useCallback(
    (event) => {
      setValue(event.target.value);
    },
    [setValue]
  );
  return (
    <div className="dropdown-container">
      <div className="option-header">
        <label
          className={`custom-input-form-label ${
            disabled ? "label-disabled" : ""
          } `}
        >
          {label}
        </label>
      </div>
      <div className={`input-group ${error ? "required" : ""}`}>
        <input
          value={value}
          onChange={handleOnChange}
          type="text"
          className={`rounded-0 ${disabled ? "disabled" : ""}`}
          disabled={disabled}
        />
      </div>
      <div className="option-header">
        <div className="form-text text-start ms-4">{desc}</div>
        {error && <ErrorMessage message={error} />}
      </div>
    </div>
  );
};

export default InputConfigOption;
