import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { axiosRequest } from "../../api/axiosDefaults";
import SpinnerButton from "../../components/Spinner";
import { Button, Form, Image } from "react-bootstrap";

function EditTask() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const imageInput = useRef(null);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "low",
    category: "",
    status: "todo",
    owner_username: "",
    image: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosRequest.get(`/tasks/${taskId}/`);
        const {
          title,
          description,
          due_date,
          priority,
          category,
          status,
          owner_username,
          image,
        } = response.data;
        const formattedDueDate = new Date(due_date).toISOString().slice(0, 16);

        setTaskData({
          title,
          description,
          due_date: formattedDueDate,
          priority,
          category,
          status,
          owner_username,
          image,
        });

        console.log(response.data);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };
    fetchData();
  }, [taskId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files.length) {
      URL.revokeObjectURL(taskData.image);
      setTaskData({
        ...taskData,
        image: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(taskData).forEach(([key, value]) => {
      if (key !== "image") {
        formData.append(key, value);
      }
    });

    if (imageInput.current.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }

    try {
      await axiosRequest.put(`/tasks/${taskId}/`, formData);
      navigate(`/tasks/${taskId}`);
    } catch (error) {
      console.error("Error:", error);

      // console.log('loggin Task data:', taskData);
      // for (let [key, value] of formData.entries()) {
      //     console.log(key, value);
      // }
    }
  };

  if (!taskData.title) {
    return <SpinnerButton />;
  }

  return (
    <Form onSubmit={handleEditTask}>
      <h1>Edit Task</h1>
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
          rows={4}
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
          value={taskData.owner_username}
          onChange={handleInputChange}
          disabled
        />
      </Form.Group>

      <Form.Group className="text-center">
        <Image src={taskData.image} thumbnail />
        <Form.Label htmlFor="image-upload">Change Image</Form.Label>
        <Form.Control
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={imageInput}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Save Changes
      </Button>
      <Link to={`/tasks/${taskId}`}>
        <Button variant="secondary" className="ml-2">
          Cancel
        </Button>
      </Link>
    </Form>
  );
}

export default EditTask;
