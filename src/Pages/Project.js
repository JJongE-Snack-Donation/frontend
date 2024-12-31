import React from 'react';
import '../Styles/Home.css';
import NameTag from '../Components/NameTag';
import Title from '../Components/Title';

const Project = () => {
    return (
        <div className="wrap">
            <NameTag />
            <Title 
            title="프로젝트"
            desc="프로젝트 관리, 업로드 및 분석"
            />
            <h1>project</h1>
        </div>
    );
}

export default Project;