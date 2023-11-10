import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../contexts/UserContext";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { useSetCurrentUser } from "../contexts/UserContext";
import styles from "../styles/Header.module.css";

function Header() {
  const navigate = useNavigate();
  const setCurrentUser = useSetCurrentUser();
  const currentUser = useCurrentUser();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <div className={styles["header-outer-div"]}>
      <Navbar expand="lg" className={styles["header"]}>
        <Container>
          <Navbar.Brand
            onClick={() => navigate("/")}
            style={{ color: "white", fontSize: 25 }}
          >
            <i className="fa-solid fa-list-check"></i> Task Tracker
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {currentUser && (
              <>
                <Nav className="me-auto">
                  <Nav.Link onClick={() => navigate("/")}>Tasks</Nav.Link>
                  <Nav.Link onClick={() => navigate("/events")}>
                    Events
                  </Nav.Link>
                </Nav>
                <Navbar.Text className="me-2" style={{ color: "white" }}>
                  Welcome, {currentUser.username}
                </Navbar.Text>
                <Button
                  onClick={handleLogout}
                  variant="outline-danger"
                  className={styles["logout-btn"]}
                >
                  Logout
                </Button>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
