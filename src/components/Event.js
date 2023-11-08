import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosRequest } from "../api/axiosDefaults";
import SpinnerButton from "./Spinner";
import DeleteEventModal from "./DeleteEventModal";
import UserSearch from "./UserSearch";
import { useCurrentUser } from "../contexts/UserContext";
import { toast } from "react-toastify";
import {
  Row,
  Col,
  ListGroup,
  Button,
  Image,
  Container,
  Card,
} from "react-bootstrap";
import styles from "../styles/Event.module.css";

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
  console.log(event.accepted_users);
  const isOwner = currentUser && event.owner_username === currentUser.username;
  return (
    <Container className="mt-4">
      <Row>
        <Col md={8}>
          <Card className={styles["card-shadow"]}>
            <Card.Body>
              <Card.Title>{event.title}</Card.Title>
              <Card.Text>
                <strong>Description:</strong> {event.description}
              </Card.Text>
              <Card.Text>
                <strong>Date:</strong> {event.date}
              </Card.Text>
              <Card.Text>
                <strong>Location:</strong> {event.location}
              </Card.Text>
              <Card.Text>
                <strong>Time:</strong> {event.time}
              </Card.Text>
              {isOwner && (
                <>
                  <Link to={`/editEvent/${event.id}`}>
                    <Button variant="primary" className="mx-2">Edit Event</Button>
                  </Link>
                  <DeleteEventModal eventId={eventId} />
                </>
              )}
            </Card.Body>
          </Card>
          <Card className="mt-3 mb-3">
            <Card.Body>
              <Card.Title>Accepted Users</Card.Title>
              {event.accepted_users.length > 0 ? (
                <ListGroup variant="flush">
                  {event.accepted_users.map((username, index) => (
                    <ListGroup.Item key={index}>{username}</ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <Card.Text>No users have accepted yet.</Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>

        {isOwner && (
          <Col md={4} >
            <Card className={styles["card-shadow"]}>
              <Card.Body>
                <Card.Title>Invite Users to Event</Card.Title>
                <UserSearch onSelectUser={handleUserSelect} />
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default Event;
