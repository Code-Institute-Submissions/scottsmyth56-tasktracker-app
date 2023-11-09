import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosRequest } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import format from "date-fns/format";
import styles from "../../styles/TaskPage.module.css";
import no_results from "../../assets/no_results.png";


function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const currentUser = useCurrentUser();
  const navigate = useNavigate();

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

  const handleRowClick = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <div>
      <Container fluid>
        <Row>
          <Col xs={12} lg={8} className="task-list-section">
            <div className={styles["filter-div"]}>
              <label className={styles["filter-label"]}>Status:</label>
              <Form.Select onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </Form.Select>
            </div>

            <div className={styles["filter-div"]}>
              <label className={styles["filter-label"]}>Priority:</label>
              <Form.Select onChange={(e) => setPriorityFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Form.Select>
            </div>

            <Link to="/createTask">
              <Button className={styles["create-btn"]}>Create Task +</Button>
            </Link>

            {myFilteredTasks.length === 0 && (
              <div className={styles["no-tasks-container"]}>
                <img src={no_results} alt="No tasks" />
                <h3 className={styles["filter-label"]}>No Tasks Found</h3>
              </div>
            )}

            <>
              {myFilteredTasks.length > 0 && (
                <>
                  <h2 className={styles["white-text-title-large"]}>Your Tasks</h2>
                  <Table striped bordered hover responsive >
                    <thead style={{backgroundColor:"black"}}>
                      <tr>
                        <th>Title</th>
                        <th>Due Date</th>
                        <th>Priority</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myFilteredTasks.map((task) => (
                        <tr
                          key={task.id}
                          className={getPriorityColor(task.priority)}
                          onClick={() => handleRowClick(task.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <td>{task.title}</td>
                          <td>
                            {format(new Date(task.due_date), "dd-MM-yyyy")}
                          </td>
                          <td>{task.priority}</td>
                          <td>{task.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              )}
            </>
          </Col>

          <Col xs={12} lg={4} className="shared-tasks-section">
            <h2 className={styles["white-text-title-large"]}> Shared Tasks</h2>

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
                  <tr
                    key={task.id}
                    className={getPriorityColor(task.priority)}
                    onClick={() => handleRowClick(task.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{task.title}</td>
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
    </div>
  );
}

export default TaskPage;
