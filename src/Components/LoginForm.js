// LoginForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Login.css'

const LoginForm = ({ login }) => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (username === 'test' && password === 'test') {
            login('fake-token'); 
            navigate('/testLoginSuccess');
        } else {
            alert('로그인 실패: 아이디와 비밀번호를 확인해주세요.');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="Login-form">
            <div className="Login-container">
                <div className="Login-input-field">
                    <div className="input-wrapper">
                        <input
                            className="Login-input"
                            type="text"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="EMAIL"
                            required
                        />
                    </div>
                    <div className="input-wrapper">
                        <input
                            className="Login-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </div>
                </div>
                <button className="Login-button" type="submit">
                    LOGIN
                </button>
            </div>
        </form>
    );
};

export default LoginForm;
