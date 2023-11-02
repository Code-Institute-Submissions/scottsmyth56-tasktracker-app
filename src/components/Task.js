import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosRequest } from "../api/axiosDefaults";
import SpinnerButton from './Spinner';
import { Link } from 'react-router-dom';
import DeleteTaskModal from './DeleteTaskModal';
import UserSearch from './UserSearch'; 
import { toast } from "react-toastify"; 

function Task() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosRequest.get(`/tasks/${taskId}/`)
      .then((response) => {
        setTask(response.data);
        setLoading(false);
        
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }, [taskId]);

  const handleUserSelect = (user) => {
    //  need to update the tasks shared users field to include the invitd user
    console.log(" test Inviting user to task:", user.username);
    
  };

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
      {task.image && <img src={task.image} alt="Task" />}

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
