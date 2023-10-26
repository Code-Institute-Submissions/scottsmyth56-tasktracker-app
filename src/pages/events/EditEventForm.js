import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { axiosRequest } from "../../api/axiosDefaults";
import { Form, Button } from "react-bootstrap";

function EditEvent() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });

  useEffect(() => {
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
  }, [eventId]);

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
    <Form onSubmit={handleEditEvent}>
      <h1>Edit Event</h1>

      <Form.Group controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={eventData.title}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="description"
          value={eventData.description}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="date">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          name="date"
          value={eventData.date}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="time">
        <Form.Label>Time</Form.Label>
        <Form.Control
          type="time"
          name="time"
          value={eventData.time}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="location">
        <Form.Label>Location</Form.Label>
        <Form.Control
          type="text"
          name="location"
          value={eventData.location}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Save Changes
      </Button>
      <Link to={`/events/${eventId}`}>
        <Button variant="secondary" className="ml-2">
          Cancel
        </Button>
      </Link>
    </Form>
  );
}

export default EditEvent;
