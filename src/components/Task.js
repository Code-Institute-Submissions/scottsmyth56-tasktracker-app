import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosRequest } from "../api/axiosDefaults";
import SpinnerButton from "./Spinner";
import { Link } from "react-router-dom";
import DeleteTaskModal from "./DeleteTaskModal";
import UserSearch from "./UserSearch";
import { toast } from "react-toastify";

function Task() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <div>
      <h1>{task.title}</h1>
      <p>Owner: {task.owner_username}</p>
      <p>Description: {task.description}</p>
      <p>Due Date: {task.due_date}</p>
      <p>Priority: {task.priority}</p>
      <p>Image:</p>
      {task.image && <img src={task.image} alt="Task" />}

      <p>Shared Users:</p>
      <ul>
        {task.shared_users_usernames.map((username) => (
          <li key={username}>{username}</li>
        ))}
      </ul>

      <Link to={`/editTask/${task.id}`}>
        <button>Edit Task</button>
      </Link>
      <DeleteTaskModal taskId={taskId} />

      <div>
        <h3>Invite Users to View Task</h3>
        <UserSearch onSelectUser={handleUserSelect} />
      </div>
    </div>
  );
}

export default Task;
