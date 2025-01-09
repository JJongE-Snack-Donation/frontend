import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Home.css';

const Home = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className="wrap">
            wfwe
            <h1 className='test'>Home Page</h1>
            <button className='LoginButton' onClick={handleLoginClick}>로그인하기</button>
        </div>
    );
}

export default Home;