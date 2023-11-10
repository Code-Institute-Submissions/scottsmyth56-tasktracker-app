import  { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { axiosRequest } from "../../api/axiosDefaults";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { useCurrentUser } from "../../contexts/UserContext";
import { toast } from "react-toastify";

function EditEvent() {
  const { eventId } = useParams();
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
        toast.error("You need to be logged in to edit an Event.", {
          toastId,
          position: toast.POSITION.TOP_CENTER,
        });
        navigate("/login");
      }
    }

    const fetchData = async () => {
      try {
        const response = await axiosRequest.get(`/events/${eventId}/`);
        setEventData({
          title: response.data.title,
          description: response.data.description,
          date: response.data.date,
          time: response.data.time,
          location: response.data.location,
        });
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchData();
  }, [eventId,currentUser,navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditEvent = async (e) => {
    e.preventDefault();
    try {
      await axiosRequest.put(`/events/${eventId}/`, eventData);
      navigate(`/events/${eventId}`);
    } catch (error) {
      console.error("Error editing event:", error);
    }
  };

  return (
    <Container className="edit-event-container">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Form onSubmit={handleEditEvent}>
            <h1 className="text-center text-white mt-3">Edit Event</h1>

            <Form.Group controlId="title">
              <Form.Label className="text-white">Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                required
                value={eventData.title}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label className="text-white">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                required
                value={eventData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="date">
              <Form.Label className="text-white">Date</Form.Label>
              <Form.Control
                type="date"
                required
                name="date"
                value={eventData.date}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="time">
              <Form.Label className="text-white">Time</Form.Label>
              <Form.Control
                type="time"
                required
                name="time"
                value={eventData.time}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="location">
              <Form.Label className="text-white">Location</Form.Label>
              <Form.Control
                type="text"
                required
                name="location"
                value={eventData.location}
                onChange={handleInputChange}
              />
            </Form.Group>
            <div className="d-grid gap-2 my-4">
              <Button
                variant="primary"
                type="submit"
                size="md"
                className="d-grid"
              >
                Save Changes
              </Button>
              <Link to={`/events/${eventId}`} className="d-grid">
                <Button variant="secondary" size="md" className="d-grid">
                  Cancel
                </Button>
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default EditEvent;
