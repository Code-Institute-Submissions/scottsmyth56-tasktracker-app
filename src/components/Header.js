import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

function Header() {

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">Task Tracker</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link href="/">Tasks</Nav.Link>
          <Nav.Link href="/events">Events</Nav.Link>
          <Nav.Link href="/profile">Profile</Nav.Link>
        </Nav>
        

      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
