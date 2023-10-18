import React, { useState } from 'react';
import { axiosRequest } from '../../api/axiosDefaults';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const history = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();


        axiosRequest.post('/auth/login/', formData)
            .then((response) => {

                console.log('Login successful:', response.data);
                
                localStorage.setItem('authToken', response.data.key);
                //remove line below
                console.log(localStorage.getItem('authToken'));
                history('/events');
            })
            .catch((error) => {

                console.error('Login error:', error);
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
