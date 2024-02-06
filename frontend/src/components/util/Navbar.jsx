import { useState } from "react";
import { GearFill, QuestionCircle } from "react-bootstrap-icons";
import { Link, useLocation } from "react-router-dom";
import sample from "../../assets/react.svg";
import "../../css/navbar.css";

const Navbar = () => {
  const location = useLocation();
  const [highlightedItem, setHighlightedItem] = useState(null);

  // Function to handle click on a navbar item
  const handleItemClick = (itemId) => {
    setHighlightedItem(itemId === highlightedItem ? null : itemId);
  };

  // Function to determine if a navbar item should be highlighted
  const isItemActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light border">
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="nav">
          <li
            className={`nav-item border ms-5${
              isItemActive("/categorize") && " active"
            }`}
          >
            <Link
              className="nav-link text-dark"
              to="/categorize"
              onClick={() => handleItemClick(1)}
            >
              Proposals- Categorize
            </Link>
          </li>
          <li
            className={`nav-item border ms-5${
              isItemActive("/duplication") && " active"
            }`}
          >
            <Link
              className="nav-link text-dark"
              to="/duplication"
              onClick={() => handleItemClick(2)}
            >
              Proposals- Duplication Check
            </Link>
          </li>
          <li
            className={`nav-item border ms-5${
              isItemActive("/review") && " active"
            }`}
          >
            <Link
              className="nav-link text-dark"
              to="/review"
              onClick={() => handleItemClick(3)}
            >
              Match Reviewers
            </Link>
          </li>
          <li
            className={`nav-item border ms-5${
              isItemActive("/upload") && " active"
            }`}
          >
            <Link
              className="nav-link text-dark"
              to="/upload"
              onClick={() => handleItemClick(4)}
            >
              Upload a Zip
            </Link>
          </li>
        </ul>
      </div>
      <div id="right-corner">
        <div className="">
          <a href="#">
            <QuestionCircle size={20} color="black" />
          </a>
        </div>
        <div className="">
          <a href="#">
            <GearFill size={20} color="black" />
          </a>
        </div>
        <div>
          <a href="#">
            <img src={sample} />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
