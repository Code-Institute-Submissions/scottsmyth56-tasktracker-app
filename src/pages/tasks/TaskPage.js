import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosRequest } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Table } from "react-bootstrap";
import format from "date-fns/format";
import styles from "../../styles/TaskPage.module.css";

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const currentUser = useCurrentUser();
  const history = useNavigate();

  function handleLogout() {
    localStorage.removeItem("authToken");
    console.log("logged out" + localStorage.getItem("authToken"));
    history("/login");
  }

  useEffect(() => {
    axiosRequest
      .get("/tasks/")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);
  const myFilteredTasks = tasks.filter(
    (task) =>
      task.owner_username === currentUser?.username &&
      (statusFilter === "all" || task.status === statusFilter) &&
      (priorityFilter === "all" || task.priority === priorityFilter)
  );

  const sharedFilteredTasks = tasks.filter(
    (task) =>
      task.shared_users_usernames.includes(currentUser?.username) &&
      (statusFilter === "all" || task.status === statusFilter) &&
      (priorityFilter === "all" || task.priority === priorityFilter)
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "table-danger";
      case "medium":
        return "table-warning";
      case "low":
        return "table-success";
      default:
        return "";
    }
  };

  return (
    <div>
      <Container fluid>
        <Row>
          <Col xs={12} lg={8} className="task-list-section">
            <h1>My Tasks</h1>
            <div className={styles['filter-div']}>
              <label>Status:</label>
              <select onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className={styles['filter-div']}>
              <label>Priority:</label>
              <select onChange={(e) => setPriorityFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myFilteredTasks.map((task) => (
                  <tr key={task.id} className={getPriorityColor(task.priority)}>
                    <td>
                      <Link to={`/tasks/${task.id}`}>{task.title}</Link>
                    </td>
                    <td>{format(new Date(task.due_date), "dd-MM-yyyy")}</td>
                    <td>{task.priority}</td>
                    <td>{task.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>

          <Col xs={12} lg={4} className="shared-tasks-section">
            <h2>Shared With Me</h2>

            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sharedFilteredTasks.map((task) => (
                  <tr key={task.id} className={getPriorityColor(task.priority)}>
                    <td>
                      <Link to={`/tasks/${task.id}`}>{task.title}</Link>
                    </td>
                    <td>{format(new Date(task.due_date), "dd-MM-yyyy")}</td>
                    <td>{task.priority}</td>
                    <td>{task.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
      <h1>Task List</h1>

      <h2>Welcome, {currentUser?.username || "Guest"}</h2>
      <button onClick={handleLogout}>Logout</button>
      <Link to="/register">
        <button>Register</button>
      </Link>
      <Link to="/createTask">
        <button>Create Task +</button>
      </Link>
    </div>
  );
}

export default TaskPage;
