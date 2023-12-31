import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { axiosRequest } from "../../api/axiosDefaults";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/CreateEventForm.module.css";
import { toast } from "react-toastify";
import { useCurrentUser } from "../../contexts/UserContext";
import { useEffect } from "react";

function CreateEvent() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });
  useEffect(() => {
    if (!currentUser) {
      const toastId = "unauthorized";
      if (!toast.isActive(toastId)) {
        toast.error("You need to be logged in to create an event.", {
          toastId,
          position: toast.POSITION.TOP_CENTER,
        });
        navigate("/login");
      }
    }
  }, [currentUser, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosRequest.post("/events/", eventData);
      navigate("/events");
      const toastId = "createEventSuccess";
      if (!toast.isActive(toastId)) {
        toast.success("Event Created Succesfully", {
          toastId,
          position: "top-center",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container className={styles["create-event-container"]}>
      <Row className="justify-content-md-center">
        <Col xs={12} md={8} lg={6}>
          <h1 className="text-center text-white">Create Event</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="title" className="mb-3">
              <Form.Label className="text-white">Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                required
                value={eventData.title}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="description" className="mb-3">
              <Form.Label className="text-white">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                required
                value={eventData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="date" className="mb-3">
              <Form.Label className="text-white">Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                required
                value={eventData.date}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="time" className="mb-3">
              <Form.Label className="text-white">Time</Form.Label>
              <Form.Control
                type="time"
                name="time"
                required
                value={eventData.time}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="location" className="mb-3">
              <Form.Label className="text-white">Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                required
                value={eventData.location}
                onChange={handleInputChange}
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit">
                Create Event
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateEvent;
