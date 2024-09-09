/* eslint-disable react/prop-types */
import { useCallback } from "react";
import ErrorMessage from "../util/ErrorMessage.jsx";

const InputConfigOption = ({
  label,
  value,
  setValue,
  error,
  desc,
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
      <div className={`input-group`}>
        <input
          value={value}
          onChange={handleOnChange}
          type="text"
          className={`rounded-0 custom ${disabled ? "disabled" : ""} ${error ? "required" : ""}`}
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
