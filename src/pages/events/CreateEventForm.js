import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { axiosRequest } from '../../api/axiosDefaults';
import { useNavigate } from 'react-router-dom';

function CreateEvent() {
    const history = useNavigate();


    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventData({ ...eventData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axiosRequest.post('/events/', eventData, {});
            console.log('Event data:', eventData);
            history('/events');

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Create Event</h1>
            <Form onSubmit={handleSubmit}>
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
                        rows={3}
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
                    Create Event
                </Button>
            </Form>
        </div>
    );
}

export default CreateEvent;
