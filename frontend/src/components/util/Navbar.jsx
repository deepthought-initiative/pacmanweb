import { Link, useLocation } from "react-router-dom";
import DefaultPfp from "../../assets/DefaultPfp.png";
import QuestionMark from "../../assets/QuestionMark.png";
import Settings from "../../assets/Settings.png";
import "../../css/navbar.css";

const Navbar = () => {
  const location = useLocation();

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
            className={`nav-item border ms-4${
              isItemActive("/categorize") ? " active" : ""
            }`}
          >
            <Link className="nav-link text-dark" to="/categorize">
              Proposals- Categorize
            </Link>
          </li>
          <li
            className={`nav-item border ms-4${
              isItemActive("/duplication") ? " active" : ""
            }`}
          >
            <Link className="nav-link text-dark" to="/duplication">
              Proposals- Duplication Check
            </Link>
          </li>
          <li
            className={`nav-item border ms-4${
              isItemActive("/review") ? " active" : ""
            }`}
          >
            <Link className="nav-link text-dark" to="/review">
              Match Reviewers
            </Link>
          </li>
          <li
            className={`nav-item border ms-4${
              isItemActive("/upload") ? " active" : ""
            }`}
          >
            <Link className="nav-link text-dark" to="/upload">
              Upload a Zip
            </Link>
          </li>
          <li
            className={`nav-item border ms-4${
              isItemActive("/upload") ? " active" : ""
            }`}
          >
            <Link className="nav-link text-dark" to="/login">
              Login
            </Link>
          </li>
        </ul>
      </div>
      <div id="right-corner">
        <div className="">
          <a href="#">
            <img className="icon" src={Settings} />
          </a>
        </div>
        <div className="">
          <a href="#">
            <img className="icon" src={QuestionMark} />
          </a>
        </div>
        <div>
          <a href="#">
            <img src={DefaultPfp} />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
