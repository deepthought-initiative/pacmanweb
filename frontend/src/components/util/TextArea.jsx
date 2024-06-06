/* eslint-disable react/prop-types */
import { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const TextArea = ({ setValue }) => {
  const handleOnChange = (event) => {
    setTextEntered(event.target.value);
    let listOfPanelists = event.target.value
      .trim()
      .split(/\n+/)
      .map((panelist) => panelist.trim());
    setValue(listOfPanelists);
  };
  const [textEntered, setTextEntered] = useState("");
  return (
    <div>
      <InputGroup>
        <Form.Control
          as="textarea"
          value={textEntered}
          aria-label="With textarea"
          onChange={handleOnChange}
        />
      </InputGroup>
    </div>
  );
};

export default TextArea;
