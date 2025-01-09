// Login.js
import React from 'react';
import '../Styles/Login.css'
import img from '../Assets/Imgs/png/loginImg.png';

const Login = () => {
    return (
        <div className="wrap login-wrap">
            <h3>동물 보호를 위한 이미지 분석 시스템</h3>
            <div className="login">
                <div className="login-img">
                    <img src={img} alt="login" />
                </div>
                <div className="login-box">
                    <p>관리자 로그인</p>
                    <form>
                        <input type="text" placeholder="아이디" />
                        <input type="password" placeholder="비밀번호" />
                        <button>로그인</button>
                    </form>
                </div>
            </div>
            <h4>Team.쫑이까까후원재단</h4>
        </div>
    );
};

export default Login;
