import React, { useState, useEffect } from "react";
import { ReactComponent as CheckIcon } from "../../Assets/Imgs/etc/check.svg";
import api from "../../Api";
import Pagination from "../Pagination/FilePagenation"; // 페이지네이션 컴포넌트 가져오기

const StepThree = ({ nextStep, projectId, projectName, projectFile, setAnalysisEndTime }) => {
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 5; // 한 페이지당 보여줄 파일 수

  useEffect(() => {
    // 분석 시작 API 호출
    const startDetection = async () => {
      try {
        console.log("선택된 파일들:", projectFile.map((file) => file.image_id));

        const response = await api.post(
          "/detect",
          JSON.stringify({ image_ids: projectFile.map((file) => file.image_id) }),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 202) {
          console.log("분석 요청 결과:", response.data);
          checkProgress(); // 진행률 조회 시작
        } else {
          alert("분석 요청 중 문제가 발생했습니다. 다시 시도하세요.");
        }
      } catch (error) {
        console.error("분석 요청 실패:", error);
        alert("서버 오류로 인해 분석을 시작할 수 없습니다.");
      }
    };

    const checkProgress = () => {
      const interval = setInterval(async () => {
        try {
          const progressResponse = await api.get("/status/ai-progress", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (progressResponse.status === 200 && progressResponse.data.progress !== undefined) {
            const newProgress = Math.round(progressResponse.data.progress); // 소수점 제거
            setProgress(newProgress);

            if (newProgress >= 100) {
              clearInterval(interval);
              const endTime = new Date().toISOString(); // 완료된 시간 기록
              setAnalysisEndTime(endTime); // StepFour로 전달할 상태 업데이트
              nextStep(); // 100%가 되면 다음 단계로 이동
            }
          }
        } catch (error) {
          console.error("진행률 조회 실패:", error);
        }
      }, 1000); // 1초마다 진행 상태 확인

      return () => clearInterval(interval); // 컴포넌트 언마운트 시 클리어
    };

    startDetection(); // 컴포넌트가 마운트되면 AI 분석 시작
  }, [nextStep, projectFile]);

  // 페이지네이션 관련 로직
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = projectFile.slice(indexOfFirstFile, indexOfLastFile);

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
          {currentFiles.map((file, index) => (
            <tr key={index}>
              <td>{file.filename}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 적용 */}
      <Pagination
        totalItems={projectFile.length}
        itemsPerPage={filesPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
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
          {Math.round(value)}% {/* 소수점 제거 */}
        </text>
      )}
    </svg>
  );
};

export default StepThree;