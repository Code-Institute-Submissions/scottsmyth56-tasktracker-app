import React, { useState } from "react";
import { axiosRequest } from "../../api/axiosDefaults";
import { useNavigate } from "react-router-dom";
import { useSetCurrentUser } from "../../contexts/UserContext";
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const setCurrentUser = useSetCurrentUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required.";
    if (!formData.password) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    axiosRequest
      .post("/auth/login/", formData)
      .then((response) => {
        localStorage.setItem("authToken", response.data.key);
        axiosRequest.defaults.headers.common[
          "Authorization"
        ] = `Token ${response.data.key}`;
        setCurrentUser(response.data.user);
        navigate("/");
      })
      .catch((error) => {
        console.error("Login error:", error);
        toast.warning(`Invalid username or password`, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });
      });
  };

  return (
    <Row className="justify-content-md-center m-0">
      <Col xs={12} md={8} lg={6}>
        <Form noValidate onSubmit={handleSubmit}>
          <h2 className="text-center text-white mt-3">Login</h2>

          <Form.Group controlId="username">
            <Form.Label className="text-white">Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              isInvalid={!!errors.username}
            />
            <Form.Control.Feedback type="invalid">
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label className="text-white">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-grid gap-2 my-4">
            <Button variant="primary" type="submit" className="mt-3">
              Login
            </Button>
          </div>
          <p className="mt-3 text-center text-white">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary">
              Sign up here
            </Link>
          </p>
        </Form>
      </Col>
    </Row>
  );
}

export default LoginForm;
