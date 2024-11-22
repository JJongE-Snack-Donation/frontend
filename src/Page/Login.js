import React from 'react';
import LoginForm from '../Components/Auth/LoginForm';
import '../Styles/Login.css'

const Login = ({ login }) => {
    return (
        <div className="Login">
            <div className="Login-title">
                LOGIN
            </div>
            <LoginForm login={login} />
        </div>
    );
};

export default Login;