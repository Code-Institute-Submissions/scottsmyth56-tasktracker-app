import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosRequest } from "../../api/axiosDefaults";
import styles from "../../styles/EventPage.module.css";
import { useCurrentUser } from "../../contexts/UserContext";
import { Container, Row, Col, Button, Card, ListGroup } from "react-bootstrap";
import { toast } from "react-toastify";

function EventPage() {
  const [events, setEvents] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [acceptedEvents, setAcceptedEvents] = useState([]); 
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

  };

  const handleDecline = async (invitationId) => {
    console.log("declined");
  };
  return (
    <Container fluid>
      <Row>
        <Col md={8}>
          <h1>My Events</h1>
          <ListGroup>
            {events.map((event) => (
              <ListGroup.Item
                key={event.id}
                action
                as={Link}
                to={`/events/${event.id}`}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0">{event.title}</h5>
                    <small className="text-muted">{event.location}</small>
                  </div>
                  <div className="text-end">
                    <p className="mb-0">
                      <small className="text-muted">Date: {event.date}</small>
                    </p>
                    <p className="mb-0">
                      <small className="text-muted">Time: {event.time}</small>
                    </p>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Button as={Link} to="/createEvent" className="mt-3">
            Create Event +
          </Button>
          <hr />
          <h1>Accepted Events</h1>
          <ListGroup>
            {acceptedEvents.map((event) => (
              <ListGroup.Item
                key={event.id}
                action
                as={Link}
                to={`/events/${event.id}`}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0">{event.title}</h5>
                    <small className="text-muted">{event.location}</small>
                  </div>
                  <div className="text-end">
                    <p className="mb-0">
                      <small className="text-muted">Date: {event.date}</small>
                    </p>
                    <p className="mb-0">
                      <small className="text-muted">Time: {event.time}</small>
                    </p>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header as="h4">Event Invitations</Card.Header>
            <ListGroup variant="flush">
              {invitedEvents.map((invitation) => (
                <ListGroup.Item key={invitation.id}>
                  <p>{`${invitation.sender_username} has invited you to ${invitation.event_title}`}</p>
                  <Button
                    onClick={() => handleAccept(invitation.id)}
                    size="sm"
                    variant="success"
                    className={styles["invite-btn"]}
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleDecline(invitation.id)}
                    size="sm"
                    variant="danger"
                  >
                    Decline
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default EventPage;
