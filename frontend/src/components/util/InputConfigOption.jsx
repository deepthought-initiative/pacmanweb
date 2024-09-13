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
          style={{ color: error ? "red" : "" }}
        >
          {label}
        </label>
      </div>
      <div className={`input-group`}>
        <input
          value={value}
          onChange={handleOnChange}
          type="text"
          className={`rounded-0 custom ${disabled ? "disabled" : ""} ${
            error ? "required" : ""
          }`}
          disabled={disabled}
        />
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
    </div>
  );
};

export default InputConfigOption;
