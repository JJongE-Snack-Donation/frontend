// Login.js
import React from 'react';
import LoginForm from '../Components/LoginForm';
import '../Styles/Login.css'
import {ReactComponent as Logo } from '../Assets/Imgs/etc/logo.svg';

const Login = ({ login }) => {
    return (
        <div className="Login">
            <div className="Login-wrapper">
                <div className="Login-left">
                    <div className="Login-image-container">
                    <Logo className='Logo-icon' />
                        <span className='Logo-text'>쫑태통로</span>
                    </div>
                </div>
                <div className="Login-right">
                    <div className="Login-header">
                        <span className="login-text">관리자 로그인</span>
                    </div>
                    <LoginForm login={login} />
                </div>
            </div>
        </div>
    );
};

export default Login;
