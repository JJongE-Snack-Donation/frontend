import React from 'react';
import '../Styles/Home.css';
import Sidebar from "../Components/Sidebar";
import MainContent from "../Components/MainContent";

const Home = () => {
    return (
        <div className="wrap">
            <Sidebar />
            <MainContent />
        </div>
    );
}

export default Home;