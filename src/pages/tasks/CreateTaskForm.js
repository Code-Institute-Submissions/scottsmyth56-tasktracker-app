import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useCurrentUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const TaskForm = () => {
    const currentUser = useCurrentUser();
    const history = useNavigate();
    const imageUpload = useRef(null);

    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        due_date: '',
        priority: 'low',
        category: '',
        status: 'todo',
        owner: currentUser.username,
        shared_users: [],
        image: null, 
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTaskData({ ...taskData, [name]: value });
    };

    const handleFileChange = (e) => {
        setTaskData({ ...taskData, image: e.target.files[0] }); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        for (const key in taskData) {
            if (key === 'image') {
                formData.append('image', taskData[key]);
            } else {
                formData.append(key, taskData[key]);
            }
        }

        try {
            await axios.post('/tasks/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Token ' + localStorage.getItem('authToken'),
                },
            });
            history('/');
        } catch (error) {
            console.error('Error:', error);
            console.log('Task data:', taskData);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={taskData.title}
                    onChange={handleInputChange}
                />
            </Form.Group>

            <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={taskData.description}
                    onChange={handleInputChange}
                />
            </Form.Group>

            <Form.Group controlId="due_date">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                    type="datetime-local"
                    name="due_date"
                    value={taskData.due_date}
                    onChange={handleInputChange}
                />
            </Form.Group>

            <Form.Group controlId="priority">
                <Form.Label>Priority</Form.Label>
                <Form.Control
                    as="select"
                    name="priority"
                    value={taskData.priority}
                    onChange={handleInputChange}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Control
                    type="text"
                    name="category"
                    value={taskData.category}
                    onChange={handleInputChange}
                />
            </Form.Group>

            <Form.Group controlId="status">
                <Form.Label>Status</Form.Label>
                <Form.Control
                    as="select"
                    name="status"
                    value={taskData.status}
                    onChange={handleInputChange}
                >
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Done</option>
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="owner">
                <Form.Label>Owner</Form.Label>
                <Form.Control
                    type="text"
                    name="owner"
                    value={taskData.owner}
                    onChange={handleInputChange}
                    disabled
                />
            </Form.Group>

            <Form.Group controlId="shared_users">
                <Form.Label>Shared Users</Form.Label>
                <Form.Control
                    as="select"
                    name="shared_users"
                    value={taskData.shared_users}
                    onChange={handleInputChange}
                    multiple
                >
                    {/* TODO: Change to allow user search on user names */}
                    <option value="user1">User 1</option>
                    <option value="user2">User 2</option>
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="image">
                <Form.Label>Image</Form.Label>
                <Form.Control
                    type="file"
                    name="image"
                    ref={imageUpload}
                    onChange={handleFileChange}
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
};

export default TaskForm;
