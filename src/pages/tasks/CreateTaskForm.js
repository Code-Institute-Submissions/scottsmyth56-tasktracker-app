import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useCurrentUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { toast } from "react-toastify";
import { Container, Row, Col } from "react-bootstrap";
const TaskForm = () => {
  const currentUser = useCurrentUser();
  const history = useNavigate();
  const imageUpload = useRef(null);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "low",
    category: "",
    status: "todo",
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
    Object.keys(taskData).forEach((key) => {
      if (key === "image" && taskData[key]) {
        formData.append("image", taskData[key]);
      } else if (key !== "image") {
        formData.append(key, taskData[key]);
      }
    });

    try {
      await axios.post("/tasks/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Token " + localStorage.getItem("authToken"),
        },
      });
      history("/");
      toast.success(`Task created sucesfully`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error:", error);
      console.log("Task data:", taskData);
    }
  };

  return (
    <Container className="task-form-container">
      <Row className="justify-content-md-center">
        <Col xs={12} md={8} lg={6}>
          <h1 className="text-center text-white mt-3">Create Task</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="title">
              <Form.Label className="text-white">Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                required 
                value={taskData.title}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label className="text-white">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                name="description"
                value={taskData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="due_date">
              <Form.Label className="text-white">Due Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="due_date"
                required
                value={taskData.due_date}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="priority">
              <Form.Label className="text-white">Priority</Form.Label>
              <Form.Control
                as="select"
                name="priority"
                required
                value={taskData.priority}
                onChange={handleInputChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label className="text-white">Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                required
                value={taskData.category}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="status">
              <Form.Label className="text-white">Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                required
                value={taskData.status}
                onChange={handleInputChange}
              >
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="owner">
              <Form.Label className="text-white">Owner</Form.Label>
              <Form.Control
                type="text"
                name="owner"
                required
                value={taskData.owner}
                onChange={handleInputChange}
                disabled
              />
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label className="text-white">Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                ref={imageUpload}
                onChange={handleFileChange}
              />
            </Form.Group>

            <div className="d-grid gap-2 my-4">
              <Button variant="primary" type="submit">
                Create Task
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default TaskForm;
