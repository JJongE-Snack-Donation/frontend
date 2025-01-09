import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Api';
import '../Styles/Login.css';
import img from '../Assets/Imgs/png/loginImg.png';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // axios를 사용한 로그인 요청
            const response = await api.post(
                `/admin/login`,
                { username, password }, // JSON 형식으로 전달
                { withCredentials: true } // 쿠키 포함
            );

            // 로그인 성공 처리
            if (response.status === 200) {
                alert('로그인 성공!');
                navigate('/project'); // 페이지 이동
            }
        } catch (err) {
            console.error('로그인 에러:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message); // 서버에서 받은 에러 메시지
            } else {
                setError('서버와의 통신 중 문제가 발생했습니다.');
            }
        }
    };

    return (
        <div className="wrap login-wrap">
            <h3>동물 보호를 위한 이미지 분석 시스템</h3>
            <div className="login">
                <div className="login-img">
                    <img src={img} alt="login" />
                </div>
                <div className="login-box">
                    <p>관리자 로그인</p>
                    {error && <p className="error">{error}</p>}
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            placeholder="아이디"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">로그인</button>
                    </form>
                </div>
            </div>
            <h4>Team.쫑이까까후원재단</h4>
        </div>
    );
};

export default Login;
