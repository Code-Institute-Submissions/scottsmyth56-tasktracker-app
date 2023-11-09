import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { axiosRequest } from "../../api/axiosDefaults";
import SpinnerButton from "../../components/Spinner";
import { Button, Form, Image, Row, Col, Container } from "react-bootstrap";
import { useCurrentUser } from "../../contexts/UserContext";
import { toast } from "react-toastify";

function EditTask() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const imageInput = useRef(null);
  const currentUser = useCurrentUser();
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
    if (!currentUser) {
      const toastId = "unauthorized";
      if (!toast.isActive(toastId)) {
        toast.error("You need to be logged in to edit a task.", {
          toastId,
          position: toast.POSITION.TOP_CENTER,
        });
        navigate("/login");
      }
    }

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
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };
    fetchData();
  }, [taskId,currentUser,navigate]);

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
    }
  };

  if (!taskData.title) {
    return <SpinnerButton />;
  }

  return (
    <Container className="edit-event-container">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Form onSubmit={handleEditTask}>
            <h1 className="text-center text-white mt-3">Edit Task</h1>
            <Form.Group controlId="title">
              <Form.Label className="text-white">Title</Form.Label>
              <Form.Control
                type="text"
                required
                name="title"
                value={taskData.title}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label className="text-white">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
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
                required
                name="owner"
                value={taskData.owner_username}
                onChange={handleInputChange}
                disabled
              />
            </Form.Group>

            <Form.Group className="text-center mt-3 mb-3">
              {taskData.image && (
                <div
                  className="image-preview mb-3"
                  style={{ width: "auto", height: "200px" }}
                >
                  <Image
                    src={taskData.image}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    thumbnail
                  />
                </div>
              )}

              <div>
                <Form.Control
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={imageInput}
                  style={{ display: "none" }}
                />

                <Form.Label
                  htmlFor="image-upload"
                  className="btn btn-link text-white"
                  style={{ textDecoration: "none", cursor: "pointer" }}
                >
                  Change Image
                </Form.Label>
              </div>
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
              <Link to={`/tasks/${taskId}`} className="d-grid">
                <Button variant="secondary" className="ml-2" size="md">
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

export default EditTask;
