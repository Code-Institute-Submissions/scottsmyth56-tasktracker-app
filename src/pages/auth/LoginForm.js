import React, { useState } from "react";
import { axiosRequest } from "../../api/axiosDefaults";
import { useNavigate } from "react-router-dom";
import { useSetCurrentUser } from "../../contexts/UserContext";



function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const setCurrentUser = useSetCurrentUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axiosRequest
      .post("/auth/login/", formData)
      .then((response) => {
        localStorage.setItem("authToken", response.data.key);

        axiosRequest.defaults.headers.common[
          "Authorization"
        ] = `Token ${response.data.key}`;

        try {
          axiosRequest.get("/auth/user/").then((response) => {
            const userData = response.data;
            console.log(userData);
            setCurrentUser(userData);
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }

        navigate("/");
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
