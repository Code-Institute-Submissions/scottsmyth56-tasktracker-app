import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosRequest } from "../api/axiosDefaults";
import SpinnerButton from "./Spinner";
import { Link } from "react-router-dom";
import DeleteTaskModal from "./DeleteTaskModal";
import UserSearch from "./UserSearch";
import { toast } from "react-toastify";
import { Row, Col, ListGroup, Button, Image, Container } from "react-bootstrap";
import { useCurrentUser } from "../contexts/UserContext";
import styles from "../styles/Task.module.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

function Task() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      const toastId = "unauthorized";
      if (!toast.isActive(toastId)) {
        toast.error("You need to be logged in to view a task.", {
          toastId,
          position: toast.POSITION.TOP_CENTER,
        });
        navigate("/login");
      }
    }

    axiosRequest
      .get(`/tasks/${taskId}/`)
      .then((response) => {
        setTask(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, [taskId,currentUser,navigate]);

  const handleUserSelect = (selectedUser) => {
    if (task.shared_users_usernames.includes(selectedUser.username)) {
      toast.error(
        `${selectedUser.username} has already been invited to this task.`
      );
      return;
    }

    const updatedUsernames = Array.isArray(task.shared_users_usernames)
      ? [...task.shared_users_usernames, selectedUser.username]
      : [selectedUser.username];

    axiosRequest
      .patch(`/tasks/${taskId}/`, {
        shared_users_usernames: updatedUsernames,
      })
      .then((response) => {
        setTask(response.data);
        toast.success(
          `${selectedUser.username} has been invited to this event`
        );
      })
      .catch((error) => {
        console.error("Error updating task shared users:", error);
        toast.error(` Error adding ${selectedUser.username}, to this event`);
      });
  };

  if (loading) {
    return <SpinnerButton />;
  }

  return (
    <Container fluid>
      <Row style={{ maxWidth: "100" }}>
        <Col
          md={8}
          className="d-flex align-items-center justify-content-center"
        >
          <div className={styles["shared-users-div"]}>
            <div className="card">
              <div className="card-body d-flex">
                <div className="flex-grow-1">
                  <h1 className="card-title">{task.title}</h1>
                  <p className="card-text">Description: {task.description}</p>
                  <p className="card-text">
                    Due Date: {format(new Date(task.due_date), "dd-MM-yyyy")}
                  </p>
                  <p className="card-text">Priority: {task.priority}</p>
                  <p className="card-text">Category: {task.category}</p>
                  <p className="card-text">Status: {task.status}</p>
                </div>

                {task.image && (
                  <div className="ms-3">
                    <Image
                      src={task.image}
                      alt="Task"
                      thumbnail
                      className="img-fluid"
                      style={{ maxHeight: "300px" }}
                    />
                  </div>
                )}
              </div>
              {task.owner_username === currentUser.username && (
                <div className="mt-3">
                  <Link to={`/editTask/${task.id}`}>
                    <Button variant="primary" className={styles["action-btn"]}>
                      Edit Task
                    </Button>
                  </Link>
                  <DeleteTaskModal taskId={taskId} />
                </div>
              )}
            </div>
          </div>
        </Col>

        <Col md={4}>
          <div className={styles["shared-users-div"]}>
            {task.owner_username === currentUser.username && (
              <>
                <h4 className={styles["white-text-title"]}>
                  Share Task with Users
                </h4>
                <UserSearch onSelectUser={handleUserSelect} />
              </>
            )}

            <ListGroup>
              <h4 className={styles["white-text-title"]}> Shared Users:</h4>
              {task.shared_users_usernames.map((username) => (
                <ListGroup.Item key={username}>{username}</ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Task;
