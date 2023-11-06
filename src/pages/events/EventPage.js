import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosRequest } from "../../api/axiosDefaults";
import styles from "../../styles/EventPage.module.css";
import { useCurrentUser } from "../../contexts/UserContext";

function EventPage() {
  const [events, setEvents] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const currentUser = useCurrentUser();

  useEffect(() => {
    axiosRequest
      .get("/events/")
      .then((response) => {
        console.log(response.data);
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });

    axiosRequest
      .get("/events/invite")
      .then((response) => {
        setInvitations(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching event invitations:", error);
      });
  }, []);

  const invitedEvents = invitations.filter(
    (invitation) => invitation.recipient_username === currentUser?.username
  );
  // console.log(currentUser);
  // console.log(invitedEvents);

  const handleAccept = async (invitationId) => {
    console.log("accpeted ");
  };

  const handleDecline = async (invitationId) => {
    console.log("declined");
  };
  return (
    <div>
      <div>
        <h1>My Events</h1>
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <Link to={`/events/${event.id}`}>{event.title}</Link>
            </li>
          ))}
        </ul>
        <Link to="/createEvent">
          <button>Create Event +</button>
        </Link>
      </div>

      <div>
        <h1>Event Invitations</h1>
        <ul>
          {invitedEvents.map((invitation) => (
            <li key={invitation.id}>
              <p>{`${invitation.sender_username} has invited you to ${invitation.event_title}`}</p>
              <div>
                <button onClick={() => handleAccept(invitation.id)}>
                  Accept
                </button>
                <button onClick={() => handleDecline(invitation.id)}>
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EventPage;
