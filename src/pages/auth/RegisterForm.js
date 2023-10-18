import React, { useState } from 'react';
import { axiosRequest } from '../../api/axiosDefaults';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password1: '',
        password2: '',
    });

    const history = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axiosRequest.post('/auth/registration/', formData)
            .then((response) => {
                console.log('Registration successful:', response.data);
                localStorage.removeItem('authToken');
                localStorage.setItem('authToken', response.data.key);
                history('/login');
            })
            .catch((error) => {
                console.error('Registration error:', error);
            });
    };

    return (
        <div>
            <h2>Register</h2>
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
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password1"
                        value={formData.password1}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        name="password2"
                        value={formData.password2}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default RegisterForm;
