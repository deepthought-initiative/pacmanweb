/* eslint-disable react/prop-types */
import { useCallback } from "react";
import ErrorMessage from "../util/ErrorMessage.jsx";
import ShowPasswordIcon from "../../assets/show.png";
import HidePasswordIcon from "../../assets/hide.png";

const PasswordInput = ({
  label,
  value,
  setValue,
  error,
  desc,
  showPassword,
  toggleShowPassword,
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
          }`}
        >
          {label}
        </label>
      </div>
      <div className={`input-group`}>
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={handleOnChange}
          className={`password-input custom rounded-0 ${
            error ? "required" : ""
          }${disabled ? "disabled" : ""}`}
          disabled={disabled}
          autoFocus
        />
        <button
          onClick={toggleShowPassword}
          type="button"
          className="show-password-btn"
          disabled={disabled}
        >
          <img
            src={showPassword ? HidePasswordIcon : ShowPasswordIcon}
            alt="Toggle Password Visibility"
          />
        </button>
      </div>
      <div className="option-header">
        <div className="form-text text-start ms-4">{desc}</div>
        {error && <ErrorMessage message={error} />}
      </div>
    </div>
  );
};

export default PasswordInput;
