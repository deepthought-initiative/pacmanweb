import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useLocation } from "react-router-dom";
import DefaultPfp from "../../assets/DefaultPfp.png";
import "../../css/navbar.css";

const MainNavbar = () => {
  const location = useLocation();
  // Update screen width state when the window is resized
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const isItemActive = (path) => {
    return location.pathname === path;
  };
  return (
    <Navbar collapseOnSelect expand="xl" className="border bg-body-tertiary">
      <Container className="mx-0 container-nav px-0">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              className={`nav-item ms-4${
                isItemActive("/categorize") ? " active" : ""
              }`}
              href="/categorize"
            >
              Proposals- Categorize
            </Nav.Link>
            <Nav.Link
              className={`nav-item ms-4${
                isItemActive("/duplication") ? " active" : ""
              }`}
              href="/duplication"
            >
              Proposals- Duplication Check
            </Nav.Link>
            <Nav.Link
              className={`nav-item ms-4${
                isItemActive("/review") ? " active" : ""
              }`}
              href="/review"
            >
              Match Reviewers
            </Nav.Link>
            <Nav.Link
              className={`nav-item ms-4${
                isItemActive("/upload") ? " active" : ""
              }`}
              href="/upload"
            >
              Upload Cycles
            </Nav.Link>
            <Nav.Link
              className={`nav-item ms-4${
                isItemActive("/dashboard") ? " active" : ""
              }`}
              href="/dashboard"
            >
              Admin Dashboard
            </Nav.Link>
          </Nav>
          <Nav className="">
            <div id="right-corner">
              {/* 
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
                */}
              {screenWidth < 1200 ? (
                <div className="logout">
                  <Nav.Link
                    className={`nav-item ms-3${
                      isItemActive("/logout") ? " active" : ""
                    }`}
                    href="/logout"
                  >
                    Profile
                  </Nav.Link>
                </div>
              ) : (
                <div className="logout">
                  <a href="/logout">
                    <img src={DefaultPfp} alt="Profile" />
                  </a>
                </div>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
