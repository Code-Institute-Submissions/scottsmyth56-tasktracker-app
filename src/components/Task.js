import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosRequest } from "../api/axiosDefaults"

function TaskDetail() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    axiosRequest.get(`/tasks/${taskId}/`) 
      .then((response) => {

        setTask(response.data); 
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }, [taskId]);


  return (
    <div>
      <h1>{task.title}</h1>
      <p>Description: {task.description}</p>
      <p>Due Date: {task.due_date}</p>
      <p>Priority: {task.priority}</p>
      
    </div>
  );
}

export default TaskDetail;
