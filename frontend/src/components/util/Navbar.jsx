/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation } from "react-router-dom";
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

  const loggedIn = localStorage.getItem("loggedIn");
  const isUserAdminContext = localStorage.getItem("isadmin");
  return (
    <Navbar collapseOnSelect expand="xl" className="border bg-body-tertiary">
      <Container className="mx-0 container-nav px-0">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {!loggedIn ? (
              <Nav.Link
                as={Link}
                to="/login"
                className={`nav-item ms-4${
                  isItemActive("/login") ? " active" : ""
                }`}
              >
                Login
              </Nav.Link>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/categorize"
                  className={`nav-item ms-4${
                    isItemActive("/categorize") ? " active" : ""
                  }`}
                >
                  Proposals- Categorize
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/duplication"
                  className={`nav-item ms-4${
                    isItemActive("/duplication") ? " active" : ""
                  }`}
                >
                  Proposals- Duplication Check
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/review"
                  className={`nav-item ms-4${
                    isItemActive("/review") ? " active" : ""
                  }`}
                >
                  Match Reviewers
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/upload"
                  className={`nav-item ms-4${
                    isItemActive("/upload") ? " active" : ""
                  }`}
                >
                  Upload Cycles
                </Nav.Link>
                {isUserAdminContext && (
                  <Nav.Link
                    as={Link}
                    to="/dashboard"
                    className={`nav-item ms-4${
                      isItemActive("/dashboard") ? " active" : ""
                    }`}
                  >
                    Admin Dashboard
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>
          <Nav>
            {loggedIn && (
              <div id="right-corner">
                {screenWidth < 1200 ? (
                  <div className="logout">
                    <Nav.Link
                      as={Link}
                      to="/logout"
                      className={`nav-item ms-3${
                        isItemActive("/logout") ? " active" : ""
                      }`}
                    >
                      Profile
                    </Nav.Link>
                  </div>
                ) : (
                  <div className="logout">
                    <Link to="/logout">
                      <img src={DefaultPfp} alt="Profile" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
