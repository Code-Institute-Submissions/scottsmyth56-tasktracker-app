import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../contexts/UserContext';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';

function Header() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  function handleLogout() {
    localStorage.removeItem("authToken");
    console.log("logged out" + localStorage.getItem("authToken"));
    navigate("/login");
  }

  return (
    <Navbar bg="light" expand="lg" className="py-3">
      <Container>
        <Navbar.Brand onClick={() => navigate('/')}>Task Tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate('/')}>Tasks</Nav.Link>
            <Nav.Link onClick={() => navigate('/events')}>Events</Nav.Link>
          </Nav>
          <Navbar.Text className="me-2">
            Welcome, {currentUser?.username || "Guest"}
          </Navbar.Text>
          <Button onClick={handleLogout} variant="outline-danger">Logout</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
