import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { axiosRequest } from '../../api/axiosDefaults';

function EventPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axiosRequest.get('/events/')
      .then((response) => {
        console.log(response.data)
        setEvents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  }, []);

  return (
    <div>
      <h1>Event List</h1>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <Link to={`/events/${event.id}`}>{event.title}</Link>
           
          </li>
        ))}
      </ul>
      <Link to="/createEvent">
              <button>Create Event + </button>
            </Link>
    </div>
  );
}

export default EventPage;
