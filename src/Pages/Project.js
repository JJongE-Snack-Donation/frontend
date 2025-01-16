import React from 'react';
import '../Styles/Home.css';
import '../Styles/Project.css';
import NameTag from '../Components/NameTag';
import Title from '../Components/Title';
import Step from '../Components/Project/step';

const Project = () => {
    return (
        <div className="wrap">
            <NameTag />
            <Title 
            title="프로젝트"
            desc="프로젝트 관리, 업로드 및 분석"
            />
            <Step/>
            <h1>project</h1>
        </div>
    );
}

export default Project;