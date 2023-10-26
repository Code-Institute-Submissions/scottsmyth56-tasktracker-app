import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { axiosRequest } from "../api/axiosDefaults"
import SpinnerButton from './Spinner';

function Event() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    axiosRequest.get(`/events/${eventId}/`) 
      .then((response) => {
        console.log(response.data)
        setEvent(response.data);
        setLoading(false); 
      })
      .catch((error) => {
        console.error('Error fetching event:', error);
      });
  }, [eventId]);

  
  if (loading) {
    return <SpinnerButton />;
  }

 
  return (
    <div>
      <h1>{event.title}</h1>
      <p>Description: {event.description}</p>
      <p> Date: {event.date}</p>
      <p>location: {event.location}</p>
      <Link to={`/editEvent/${event.id}`}>
        <button>Edit Task  </button>
      </Link>
      {/* <DeleteTaskModal taskId={taskId} /> */}
    </div>
    
  );
}

export default Event;
