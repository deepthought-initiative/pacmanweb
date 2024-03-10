/* eslint-disable react/prop-types */
import { useState } from "react";
import QuestionMark from "../../assets/QuestionMark.png";
import closeimg from "../../assets/close.png";

const CustomTooltip = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (event) => {
    event.preventDefault(); // Added to prevent default behavior (optional)
    setIsOpen(true);
  };

  const handleClose = (event) => {
    event.preventDefault();
    setIsOpen(false);
  };

  return (
    <>
      {isOpen ? (
        <div className={`content-box ${isOpen ? "open" : ""}`}>
          <div className="tooltip-content">{content}</div>
          <div className="img-container ms-auto">
            <img src={closeimg} onClick={handleClose} alt="Close tooltip" />
          </div>
        </div>
      ) : (
        <div onClick={handleOpen}>
          <img
            className="custom-tooltip"
            src={QuestionMark}
            alt="Click for tooltip"
          />
        </div>
      )}
    </>
  );
};

export default CustomTooltip;
