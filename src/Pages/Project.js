import React, { useState } from "react";
import "../Styles/Home.css";
import "../Styles/Project.css";
import NameTag from "../Components/NameTag";
import Title from "../Components/Title";
import Step from "../Components/Project/StepProcess";

// 단계별 컴포넌트 가져오기
import StepOne from "../Components/Project/StepOne";
import StepTwo from "../Components/Project/StepTwo";
import StepThree from "../Components/Project/StepThree";
import StepFour from "../Components/Project/StepFour";

const Project = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const renderContent = () => {
        switch (currentStep) {
            case 1:
                return <StepOne nextStep={() => setCurrentStep(2)} />; // 다음 단계 함수 전달
            case 2:
                return <StepTwo nextStep={() => setCurrentStep(3)} />;
            case 3:
                return <StepThree nextStep={() => setCurrentStep(4)} />;
            case 4:
                return <StepFour nextStep={() => setCurrentStep(1)} />; // 다시 1단계로 돌아감
            default:
                return null;
        }
    };

    return (
        <div className="wrap">
            <NameTag />
            <Title title="프로젝트" desc="프로젝트 관리, 업로드 및 분석" />
            <Step currentStep={currentStep} />
            {renderContent()} {/* 단계별로 분리된 컴포넌트 렌더링 */}
        </div>
    );
};

export default Project;
