import React, { useState } from "react";
import '../Styles/Home.css';
import '../Styles/Project.css';
import NameTag from '../Components/NameTag';
import Title from '../Components/Title';
import Step from '../Components/Project/step';

const Project = () => {
    const [currentStep, setCurrentStep] = useState(1); // 상태 관리

    const handleNextStep = () => {
        setCurrentStep((prevStep) => Math.min(prevStep + 1, 4)); // 최대 단계 제한
    };

    return (
        <div className="wrap">
            <NameTag />
            <Title 
            title="프로젝트"
            desc="프로젝트 관리, 업로드 및 분석"
            />
            <Step currentStep={currentStep} />
            <button onClick={handleNextStep}>다음 단계</button>
            <h1>project</h1>
        </div>
    );
}

export default Project;