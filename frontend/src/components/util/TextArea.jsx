/* eslint-disable react/prop-types */
import { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const TextArea = ({ setValue }) => {
  const regex = /^[a-zA-Z\s.]{2,}$/;

  const handleOnChange = (event) => {
    setTextEntered(event.target.value);
    let listOfPanelists = event.target.value
      .trim()
      .split(/,|\n/)
      .filter((item) => item !== "" && regex.test(item))
      .map((panelist) => panelist.toLowerCase().trim());
    console.log(listOfPanelists);
    cleanPanelistNames(listOfPanelists);
    setValue(listOfPanelists);
  };
  const cleanPanelistNames = (userEnteredPanelists) => {
    for (let i = 0; i < userEnteredPanelists.length; i++) {
      console.log(userEnteredPanelists[i]);
    }
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
