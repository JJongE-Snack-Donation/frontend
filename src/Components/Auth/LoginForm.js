import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/Login.css'

const LoginForm = ({ login }) => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    //  const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        /// 서버 통신 X
        if (username === 'test' && password === 'test') {
            login('fake-token'); 
            navigate('/testLoginSuccess');
        } else {
            alert('로그인 실패: 아이디와 비밀번호를 확인해주세요.');
        }
        
        /// 서버 통신 O (API 적용)
        // try {
        //     const response = await fetch('/api/login', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ username, password }),
        //     });

        //     const data = await response.json();

        //     if (response.status === 200) {
        //         login(data.result.token);
        //         navigate('/testLoginSuccess');
        //     } else if (response.status === 401) {
        //         setError(data.message);
        //     } else {
        //         setError('로그인 중 오류가 발생했습니다.');
        //     }
        // } catch (error) {
        //     setError('서버와의 통신 중 오류가 발생했습니다.');
        // }
    }
    return (
        <form onSubmit={handleSubmit} className="Login-form">
            <div className="Login-container">
                <div className="Login-input-field">
                    <div className="Login-label">ID</div>
                    <input
                        className="Login-input"
                        type="text"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="아이디를 입력하세요"
                        required
                    />
                    <div className="Login-label">Password</div>
                    <input
                        className="Login-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호를 입력하세요"
                        required
                    />
                </div>
            </div>

            <button className="Login-button" type="submit">
                로그인
            </button>
        </form>
    );
};

export default LoginForm;