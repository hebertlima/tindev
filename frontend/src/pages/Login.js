import React, { useState } from 'react';
import logo from '../assets/logo.svg';
import './login.css';

import api from '../services/api';

export default function Login({ history }) {
    const [username, setUsername] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        const response = await api.post('/users', { username });

        const { _id: id } = response.data;

        history.push(`/user/${id}`);
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <img src={logo} alt="Tinddev" />
                <input
                    placeholder="Github username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <button type="submit">logar</button>
            </form>
        </div>
    );
}