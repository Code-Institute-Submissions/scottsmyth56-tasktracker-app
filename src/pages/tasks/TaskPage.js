import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {axiosRequest} from '../../api/axiosDefaults';
import { useCurrentUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const currentUser = useCurrentUser();
  const history = useNavigate();

  function handleLogout() {
    localStorage.removeItem('authToken');
    console.log("logged out" + localStorage.getItem('authToken')); 
    history('/login'); 
  }


  useEffect(() => {
    axiosRequest.get('/tasks/') 
      .then((response) => {
        // console.log(response.data)
        setTasks(response.data); 
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }, []);

  return (
    <div>
      <h1>Task List</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <Link to={`/tasks/${task.id}`}>{task.title}</Link>
          </li>
        ))}
      </ul>
      <h2>Welcome, {currentUser?.username || 'Guest'}</h2>
       <button onClick={handleLogout}>Logout</button> 
       <Link to="/register">
      <button> Register</button>
      </Link>
      <Link to="/createTask">
      <button>Create Task + </button>
      </Link>
    </div>
  );
}

export default TaskPage;
