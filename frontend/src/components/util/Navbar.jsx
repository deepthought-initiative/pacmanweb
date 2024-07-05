/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation } from "react-router-dom";
import DefaultPfp from "../../assets/DefaultPfp.png";
import "../../css/navbar.css";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const MainNavbar = () => {
  const location = useLocation();
  // Update screen width state when the window is resized
  const { loggedInUser} = useContext(AuthContext);

  const isItemActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Navbar collapseOnSelect expand="xl" className="border bg-body-tertiary">
      <Container className="mx-0 container-nav px-0">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
              <>
                <Nav.Link
                  as={Link}
                  to="/categorize"
                  className={`nav-item ms-4${isItemActive("/categorize") ? " active" : ""
                    }`}
                >
                  Proposals- Categorize
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/duplication"
                  className={`nav-item ms-4${isItemActive("/duplication") ? " active" : ""
                    }`}
                >
                  Proposals- Duplication Check
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/review"
                  className={`nav-item ms-4${isItemActive("/review") ? " active" : ""
                    }`}
                >
                  Match Reviewers
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/upload"
                  className={`nav-item ms-4${isItemActive("/upload") ? " active" : ""
                    }`}
                >
                  Upload Cycles
                </Nav.Link>
                {loggedInUser.isadmin && (
                  <Nav.Link
                    as={Link}
                    to="/dashboard"
                    className={`nav-item ms-4${isItemActive("/dashboard") ? " active" : ""
                      }`}
                  >
                    Admin Dashboard
                  </Nav.Link>
                )}
                 <Nav.Link
                      as={Link}
                      to="/profile"
                      className={`nav-item ms-4${isItemActive("/profile") ? " active" : ""
                        }`}
                    >
                    Profile
                </Nav.Link>
              </>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
