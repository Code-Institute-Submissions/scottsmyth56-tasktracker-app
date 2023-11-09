import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosRequest } from "../../api/axiosDefaults";
import styles from "../../styles/EventPage.module.css";
import { useCurrentUser } from "../../contexts/UserContext";
import { Container, Row, Col, Button, Card, ListGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { format } from "date-fns";
import no_results from "../../assets/no_results.png";
import { useNavigate } from "react-router-dom";
function EventPage() {
  const [events, setEvents] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [acceptedEvents, setAcceptedEvents] = useState([]);
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      const toastId = "unauthorized";
      if (!toast.isActive(toastId)) {
        toast.error("You need to be logged in to view events.", {
          toastId,
          position: toast.POSITION.TOP_CENTER,
        });
      }
      return;
    }
    const fetchEventsAndInvitations = async () => {
      try {
        const [eventsResponse, invitationsResponse] = await Promise.all([
          axiosRequest.get("/events/"),
          axiosRequest.get("/events/invite"),
        ]);

        const eventsData = eventsResponse.data;
        const currentUserEvents = eventsData.filter(
          (event) => event.owner_username === currentUser.username
        );

        const invitationsData = invitationsResponse.data.filter(
          (invite) =>
            !invite.accepted &&
            invite.recipient_username === currentUser.username
        );
        const newAcceptedEvents = eventsData.filter(
          (event) =>
            event.accepted_users &&
            event.accepted_users.includes(currentUser.username)
        );
        setAcceptedEvents(newAcceptedEvents);
        setEvents(currentUserEvents);
        setInvitations(invitationsData);
      } catch (error) {
        toast.error("An error occurred while fetching data.");
      }
    };

    if (currentUser) {
      fetchEventsAndInvitations();
    }
  }, [currentUser,navigate]);

  const handleAccept = async (invitationId) => {
    try {
      const response = await axiosRequest.post(
        `/event-invitations/${invitationId}/accept/`
      );
      toast.success(response.data.message);

      const acceptedInvitation = invitations.find(
        (invitation) => invitation.id === invitationId
      );

      const eventToAccept = events.find(
        (event) => event.id === acceptedInvitation.event
      );

      setAcceptedEvents((prevAcceptedEvents) => [
        ...prevAcceptedEvents,
        eventToAccept,
      ]);

      setInvitations((currentInvitations) =>
        currentInvitations.filter(
          (invitation) => invitation.id !== invitationId
        )
      );
    } catch (error) {
      console.error("Error accepting invitation:", error);
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("You need to be logged in to accept an invitation.");
        } else if (error.response.status === 400) {
          toast.error("This invitation has already been accepted.");
        } else {
          toast.error(
            "An error occurred while trying to accept the invitation."
          );
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleDecline = async (invitationId) => {
    try {
      await axiosRequest.delete(`/event-invitations/${invitationId}/`);
      toast.success("Invitation declined");

      setInvitations((currentInvitations) =>
        currentInvitations.filter(
          (invitation) => invitation.id !== invitationId
        )
      );
    } catch (error) {
      console.error("Error declining invitation:", error);
    }
  };

  if (!currentUser) {
    navigate("/");
  }

  return (
    <Container fluid>
      <Row>
        <Col md={8}>
          <h1 className={styles["white-text-title-large"]}> Events</h1>
          <Button as={Link} to="/createEvent" className={styles["action-btn"]}>
            Create Event +
          </Button>
          <ListGroup className="mb-4">
            {events.length === 0 ? (
              <div className={styles["no-events-container"]}>
                <img src={no_results} alt="No tasks" />
                <h3 className={styles["filter-label"]}>No Events Found</h3>
              </div>
            ) : (
              events.map((event) => (
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
                        <small className="text-muted">
                          Date: {format(new Date(event.date), "dd-MM-yyyy")}
                        </small>
                      </p>
                      <p className="mb-0">
                        <small className="text-muted">Time: {event.time}</small>
                      </p>
                    </div>
                  </div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>

          <h1 className={styles["white-text-title-large"]}>Accepted Events</h1>
          <ListGroup className={styles["event-container"]}>
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
          <Card className="mt-4">
            <Card.Header as="h4">Event Invitations</Card.Header>
            <ListGroup variant="flush">
              {invitations.length > 0 ? (
                invitations.map((invitation) => (
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
                ))
              ) : (
                <Card.Body>
                  <Card.Text>No event invitations yet.</Card.Text>
                </Card.Body>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default EventPage;
