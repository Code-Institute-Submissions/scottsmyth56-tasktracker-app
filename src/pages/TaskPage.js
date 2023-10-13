import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {axiosRequest} from '../api/axiosDefaults';

function TaskPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axiosRequest.get('/tasks/') 
      .then((response) => {
        console.log(response.data)
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
    </div>
  );
}

export default TaskPage;
