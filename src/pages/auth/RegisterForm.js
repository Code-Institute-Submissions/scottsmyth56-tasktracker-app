import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { axiosRequest } from "../../api/axiosDefaults";
import { toast } from "react-toastify";

function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password1 !== formData.password2) {
      setErrors({ ...errors, password2: ["Passwords do not match."] });
      return;
    }

    axiosRequest
      .post("/auth/registration/", formData)
      .then((response) => {
        localStorage.setItem("authToken", response.data.key);
        navigate("/login");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          Object.keys(error.response.data).forEach((key) => {
            toast.warning(error.response.data[key].toString());
          });
          setErrors(error.response.data);
        }
      });
  };

  return (
    <Row className="justify-content-center m-0">
      <Col xs={12} md={6} lg={4}>
        <Form onSubmit={handleSubmit}>
          <h2 className="text-center text-white mt-3">Register</h2>

          <Form.Group controlId="username">
            <Form.Label className="text-white">Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              isInvalid={!!errors.username}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.username?.join(" ")}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label className="text-white">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.join(" ")}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="password1">
            <Form.Label className="text-white">Password</Form.Label>
            <Form.Control
              type="password"
              name="password1"
              value={formData.password1}
              onChange={handleChange}
              isInvalid={!!errors.password1}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.password1?.join(" ")}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="password2">
            <Form.Label className="text-white">Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              isInvalid={
                !!errors.password2 || formData.password1 !== formData.password2
              }
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.password2?.join(" ")}
            </Form.Control.Feedback>
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
          </div>
        </Form>
      </Col>
    </Row>
  );
}

export default RegisterForm;
