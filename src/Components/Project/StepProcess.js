import React from "react";

const Step = ({ currentStep, setCurrentStep }) => {
  const steps = [
    { id: 1, title: "선택" },
    { id: 2, title: "업로드" },
    { id: 3, title: "분석" },
    { id: 4, title: "완료" },
  ];

  return (
    <div className="step-container">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div
            className={`num ${
              index + 1 < currentStep
                ? "completed"
                : index + 1 === currentStep
                ? "active"
                : ""
            }`}
            onClick={() => {
              if (index + 1 < currentStep) {
                setCurrentStep(index + 1); // 이전 스탭으로 이동
              }
            }}
            style={{ cursor: index + 1 < currentStep ? "pointer" : "default" }} // 이전 스탭만 클릭 가능
          >
            {index + 1 < currentStep ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#006100"
                width="18px"
                height="18px"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z" />
              </svg>
            ) : (
              index + 1
            )}
          </div>
          <p>{step.title}</p>
          <span>
            {index + 1 === currentStep
              ? "진행중"
              : index + 1 < currentStep
              ? "완료"
              : "대기중"}
          </span>
          {index < steps.length - 1 && (
            <hr
              className={`hr-basic ${index + 1 < currentStep ? "hr-completed" : ""}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Step;
