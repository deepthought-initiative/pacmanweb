/* eslint-disable react/prop-types */
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation } from "react-router-dom";
import "../../css/navbar.css";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const MainNavbar = () => {
  const location = useLocation();
  const { loggedInUser } = useContext(AuthContext);

  const navItems = [
    {
      label: "Proposals- Categorize",
      path: "/categorize",
    },
    {
      label: "Proposals- Duplication Check",
      path: "/duplication",
    },
    {
      label: "Match Reviewers",
      path: "/review",
    },
    {
      label: "Upload Cycles",
      path: "/upload",
    },
    {
      label: "Admin Dashboard",
      path: "/dashboard",
      condition: loggedInUser.isadmin,
    },
    {
      label: "Profile",
      path: "/profile",
    },
  ];

  const isItemActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {location.pathname !== "/404" && (
        <Navbar
          collapseOnSelect
          expand="xl"
          className="border bg-body-tertiary"
        >
          <Container className="mx-0 container-nav px-0">
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                {navItems.map((item, index) => (
                  item.condition !== false && (
                    <Nav.Link
                      key={index}
                      as={Link}
                      to={item.path}
                      className={`nav-item ms-4${
                        isItemActive(item.path) ? " active" : ""
                      }`}
                    >
                      {item.label}
                    </Nav.Link>
                  )
                ))}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </>
  );
};

export default MainNavbar;
