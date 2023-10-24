import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosRequest } from "../api/axiosDefaults"
import SpinnerButton from './Spinner';

function Task() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    axiosRequest.get(`/tasks/${taskId}/`) 
      .then((response) => {
        console.log(response.data)
        setTask(response.data);
        setLoading(false); 
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }, [taskId]);

  
  if (loading) {
    return <SpinnerButton />;
  }

 
  return (
    <div>
      <h1>{task.title}</h1>
      <p>Description: {task.description}</p>
      <p>Due Date: {task.due_date}</p>
      <p>Priority: {task.priority}</p>
      <p>Image:</p>
          <img src={task.image}  />
        </div>
  );
}

export default Task;
