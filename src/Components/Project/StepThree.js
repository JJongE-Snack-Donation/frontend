import React, { useState, useEffect } from "react";
import { ReactComponent as CheckIcon } from "../../Assets/Imgs/etc/check.svg";

const StepThree = ({ nextStep }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          nextStep(); // 100%가 되면 다음 단계로 이동
          return 100;
        }
        return prev + 10; // 10%씩 증가 (속도는 필요에 따라 변경)
      });
    }, 500); // 500ms마다 진행도 증가

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 클리어
  }, [nextStep]);

  return (
    <div className="step-two-container step-three-container">
      <CircularProgress value={progress} isCompleted={progress >= 100} />
      <h2>분석이 진행 중입니다...</h2>
      <table className="file-list">
        <thead>
          <tr>
            <th>파일명</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>image1.jpg</td>
          </tr>
          <tr>
            <td>image2.jpg</td>
          </tr>
          <tr>
            <td>image3.jpg</td>
          </tr>
        </tbody>
      </table>
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

export default StepThree;
