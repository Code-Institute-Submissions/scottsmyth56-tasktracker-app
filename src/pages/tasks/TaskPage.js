import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosRequest } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

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

  const filteredTasks = tasks.filter((task) => {
    return (
      (statusFilter === "all" || task.status === statusFilter) &&
      (priorityFilter === "all" || task.priority === priorityFilter)
    );
  });

  return (
    <div>
      <h1>Task List</h1>
      <div>
        <label>Status:</label>
        <select onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div>
        <label>Priority:</label>
        <select onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id}>
            <Link to={`/tasks/${task.id}`}>{task.title}</Link>
          </li>
        ))}
      </ul>
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
