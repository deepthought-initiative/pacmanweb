/* eslint-disable react/prop-types */
import { useRef, useState } from "react";

const Tooltip = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef(null);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleDocumentClick = (event) => {
    if (!tooltipRef.current?.contains(event.target)) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className="custom-tooltip"
      data-tooltip={content}
      onClick={handleClick}
    >
      {isOpen && (
        <div ref={tooltipRef} className="tooltip-content">
          {content}
        </div>
      )}
      {isOpen && (
        <div onClick={handleDocumentClick} className="tooltip-overlay" />
      )}
    </div>
  );
};

export default Tooltip;
