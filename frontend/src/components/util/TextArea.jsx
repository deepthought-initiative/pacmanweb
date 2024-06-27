/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/esm/FormGroup";

const TextArea = ({ setValue, textAreaError, setTextAreaError }) => {
  const [textEntered, setTextEntered] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const listOfPanelists = validateAndCleanPanelistNames(textEntered);
    setValue(listOfPanelists);
  }, [textEntered, setValue]);

  const handleOnChange = (event) => {
    setTextEntered(event.target.value);
  };

  const validateAndCleanPanelistNames = (input) => {
    const regex = /^[a-zA-Z\s.]{2,}$/;
    const panelistNames = input.trim().split(/,|\n/);
    const validPanelistNames = [];
    let hasValidationError = false;

    for (let i = 0; i < panelistNames.length; i++) {
      let name = panelistNames[i].trim().replace(/\s+/g, " ");
      if (name !== "") {
        if (regex.test(name)) {
          validPanelistNames.push(name.toLowerCase());
        } else {
          hasValidationError = true;
          if (!/^[a-zA-Z\s.]+$/.test(name)) {
            setValidationError(
              "Names can only contain letters, spaces, and dots; Remove all other special characters!"
            );
            setTextAreaError(true);
            break;
          } else if (!/^[a-zA-Z\s]{2,}$/.test(name)) {
            setValidationError("Names must be at least 2 characters long.");
            setTextAreaError(true);
            break;
          } else {
            setValidationError("Please enter a valid name.");
            setTextAreaError(true);
          }
        }
      }
    }

    if (!hasValidationError) {
      setValidationError("");
      setTextAreaError(false);
    }
    console.log(validPanelistNames);

    return validPanelistNames;
  };

  return (
    <div>
      <FormGroup className="dropdown-container">
        <Form.Label
          className={`custom-input-form-label ${
            textAreaError ? "is-invalid" : ""
          }`}
        >
          <strong>Panelist Names</strong>
        </Form.Label>
        <Form.Control
          as="textarea"
          value={textEntered}
          aria-label="With textarea"
          onChange={handleOnChange}
          isInvalid={textAreaError}
          className="textarea-input"
        />
        {validationError && (
          <Form.Control.Feedback type="invalid">
            {validationError}
          </Form.Control.Feedback>
        )}
      </FormGroup>
    </div>
  );
};

export default TextArea;
