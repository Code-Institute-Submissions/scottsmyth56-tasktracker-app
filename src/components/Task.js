import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosRequest } from "../api/axiosDefaults";
import SpinnerButton from "./Spinner";
import { Link } from "react-router-dom";
import DeleteTaskModal from "./DeleteTaskModal";
import UserSearch from "./UserSearch";
import { toast } from "react-toastify";
import { Row, Col, ListGroup, Button, Image } from "react-bootstrap";
import { useCurrentUser } from "../contexts/UserContext";

function Task() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = useCurrentUser();

  useEffect(() => {
    axiosRequest
      .get(`/tasks/${taskId}/`)
      .then((response) => {
        setTask(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, [taskId]);

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
        console.log(response.data);
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
    <Row>
      <Col md={8} className="d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title">{task.title}</h1>
              <h5 className="card-subtitle mb-2 text-muted">
                Owner: {task.owner_username}
              </h5>
              <p className="card-text">Description: {task.description}</p>
              <p className="card-text">Due Date: {task.due_date}</p>
              <p className="card-text">Priority: {task.priority}</p>
              {task.image && (
                <div className="d-flex justify-content-center">
                  <Image src={task.image} alt="Task" thumbnail />
                </div>
              )}
            </div>
          </div>
        </div>
      </Col>

      <Col md={4}>
        <h4>Share Task with Users</h4>
        <UserSearch onSelectUser={handleUserSelect} />
        <h3>Shared Users</h3>
        <ListGroup>
          {task.shared_users_usernames.map((username) => (
            <ListGroup.Item key={username}>{username}</ListGroup.Item>
          ))}
        </ListGroup>

        {task.owner_username === currentUser.username && (
          <div className="mt-3">
            <Link to={`/editTask/${task.id}`}>
              <Button variant="primary">Edit Task</Button>
            </Link>
            <DeleteTaskModal taskId={taskId} />
          </div>
        )}
      </Col>
    </Row>
  );
}

export default Task;
