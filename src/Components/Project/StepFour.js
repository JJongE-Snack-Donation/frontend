import React from "react";
import { ReactComponent as CheckIcon } from "../../Assets/Imgs/etc/check.svg";

const StepFour = ({nextStep, upload, analysisEndTime}) => {

    const handleNextStep = () => {
        nextStep();
    }

    const handleUpload = () => {
        upload();
    }

    const formattedTime = analysisEndTime
    ? new Date(analysisEndTime).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
    : "시간 정보 없음";

    return (
        <div className="step-two-container step-four-container">
            <CircularProgress value={100} isCompleted={true} />
            <h2>분석이 완료되었습니다.</h2>
            <span>{formattedTime}</span>
            <div className="row-btn">
                <button 
                className="move-btn"
                onClick={handleNextStep}
                >이벤트 검수 페이지로</button>
                <button onClick={handleUpload}>계속 업로드하기</button>
            </div>
        </div>
    );
};

const CircularProgress = ({ value, isCompleted }) => {
    const radius = 40;
    const stroke = 4;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const strokeDashoffset = circumference - (value / 100) * circumference;
  
    return (
      <svg height={radius * 2} width={radius * 2}>
        <circle stroke="#e6e6e6" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
        <circle
          stroke={isCompleted ? "#4B8F2A" : "#0F52A7"}
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={circumference + " " + circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius} ${radius})`}
        />
        {isCompleted ? (
          <g transform={`translate(${radius - 8}, ${radius - 8})`}>
            <CheckIcon width="16px" height="16px" />
          </g>
        ) : (
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fill="#000">
            {value}%
          </text>
        )}
      </svg>
    );
  };

export default StepFour;
