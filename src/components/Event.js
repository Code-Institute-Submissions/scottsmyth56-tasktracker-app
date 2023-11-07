import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosRequest } from "../api/axiosDefaults";
import SpinnerButton from "./Spinner";
import DeleteEventModal from "./DeleteEventModal";
import UserSearch from "./UserSearch";
import { useCurrentUser } from "../contexts/UserContext";
import { toast } from "react-toastify";


function Event() {
  const currentUser = useCurrentUser();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosRequest
      .get(`/events/${eventId}/`)
      .then((response) => {
        console.log(response.data);
        setEvent(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
      });
  }, [eventId]);

  const handleUserSelect = (user) => {
    //console.log("Inviting user to event:", user.username);

    const postData = {
      sender: currentUser.pk,
      recipient: user.user_id,
      event: event.id,
      accepted: false,
    };

    axiosRequest
      .post("events/invite/", postData)
      .then((response) => {
        console.log(response.data);
        toast.success(`${user.username}, has been invited to this event`, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          toast.warning(
            `${user.username}, has already been invited to this event`,
            {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 5000,
            }
          );
        } else {
          console.error("Error inviting user:", error);
          toast.error(`Error inviting ${user.username} please try again!`, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000,
          });
        }
      });
  };

  if (loading) {
    return <SpinnerButton />;
  }

  return (
    <div>
      <p>event owner{event.owner_username}</p>
      <h1>{event.title}</h1>
      <p>Description: {event.description}</p>
      <p>Date: {event.date}</p>
      <p>Location: {event.location}</p>
      <p>Time: {event.time}</p>

      <Link to={`/editEvent/${event.id}`}>
        <button>Edit Event</button>
      </Link>
      <DeleteEventModal eventId={eventId} />

      <div>
        <h3>Invite Users to Event</h3>
        <UserSearch onSelectUser={handleUserSelect} />
      </div>
    </div>
  );
}

export default Event;
