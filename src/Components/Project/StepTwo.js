import React, { useState, useEffect } from "react";
import { ReactComponent as Upload } from "../../Assets/Imgs/etc/upload.svg";
import { ReactComponent as CheckIcon } from "../../Assets/Imgs/etc/check.svg"; // 체크 아이콘 추가

const StepTwo = () => {
  const [currentPart, setCurrentPart] = useState("upload"); // 'upload', 'uploading', 'review'
  const [progress, setProgress] = useState(0); // 업로드 진행률
  const [uploadedFiles, setUploadedFiles] = useState([]); // 업로드된 파일 리스트
  const [uploadType, setUploadType] = useState("file"); // 'file' or 'folder'
  const [isUploadBoxFocused, setIsUploadBoxFocused] = useState(false); // 드래그 상태
  const [elapsedTime, setElapsedTime] = useState(0); // 경과 시간 (초)
  const [remainingTime, setRemainingTime] = useState(null); // 예상 완료 시간

  useEffect(() => {
    let interval;
    if (currentPart === "uploading") {
      setElapsedTime(0);
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1); // 1초씩 증가
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentPart]);

  const handleUploadTypeChange = (event) => {
    setUploadType(event.target.value);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    processFiles(files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    processFiles(files);
    setIsUploadBoxFocused(false);
  };

  const handleCancelUpload = () => {
    setCurrentPart("upload");
    setProgress(0);
    setUploadedFiles([]);
    setElapsedTime(0);
    setRemainingTime(null);
  };

  const processFiles = (files) => {
    if (!files || files.length === 0) return;

    setUploadedFiles(files.map((file) => file.name));
    setProgress(0);
    setCurrentPart("uploading");

    // 진행률 증가 (테스트 코드)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setCurrentPart("review"), 500);
          return 100;
        }
        const newProgress = prev + 10;
        const remaining = ((100 - newProgress) / 10) * 3;
        setRemainingTime(remaining);
        return newProgress;
      });
    }, 3000);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const UploadProcess = () => {
    return (
      <>
        <div className={`step-two-container ${currentPart === "review" ? "review-container" : ""}`}>
          <CircularProgress value={progress} isCompleted={currentPart === "review"} />
            <h2>
              {currentPart === "upload"
                ? "분석할 이미지 파일을 업로드 하세요"
                : currentPart === "uploading"
                ? "파일을 안전하게 업로드하고 있습니다..."
                : `${uploadedFiles.length}개의 이미지가 업로드 되었습니다.`}
            </h2>

            {currentPart === "uploading" && (
              <span>
                경과 시간: {formatTime(elapsedTime)}
                {remainingTime !== null && `, 완료까지 약 ${formatTime(remainingTime)}`}
              </span>
            )}

            {currentPart !== "uploading" && (
              <div className="upload-type-container">
                <label>
                  <input
                    type="radio"
                    name="uploadType"
                    value="file"
                    checked={uploadType === "file"}
                    onChange={handleUploadTypeChange}
                  />
                  파일
                </label>
                <label>
                  <input
                    type="radio"
                    name="uploadType"
                    value="folder"
                    checked={uploadType === "folder"}
                    onChange={handleUploadTypeChange}
                  />
                  폴더
                </label>
              </div>
            )}
            {currentPart === "uploading" && <button onClick={handleCancelUpload}>업로드 취소</button>}
            <div
              className={`upload-box ${isUploadBoxFocused ? "focused" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsUploadBoxFocused(true);
              }}
              onDragLeave={() => setIsUploadBoxFocused(false)}
              onDrop={handleDrop}
            >
              <label>
                <input
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  webkitdirectory={uploadType === "folder" ? "true" : undefined}
                />
                <Upload />
                <p>업로드 할 파일/폴더를 이 영역에 끌어 놓거나 클릭합니다</p>
              </label>
            </div>


            <h5>한 번에 최대 10,000장 이하로 업로드할 것을 권장합니다. 업로드 중에는 페이지 이동이 가능하지만, 새로 고침은 피해주세요</h5>
        </div>
        {currentPart === "review" && 
          <div className="review-container">
            <div>
              <table>
                <thead>
                  <tr>
                    <th>파일 이름</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedFiles.map((file, index) => (
                    <tr key={index}>
                      <td>{file}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>}
      </>
    );
  };

  return <div className="step-two-wrap">{UploadProcess()}</div>;
};

/** ✅ **업로드 완료 시 색상 변경 & 체크 표시 추가** **/
const CircularProgress = ({ value, isCompleted }) => {
  const radius = 40;
  const stroke = 4;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      {/* 배경 원 */}
      <circle
        stroke="#e6e6e6"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      {/* 진행률 원 (완료 시 색 변경) */}
      <circle
        stroke={isCompleted ? "#4B8F2A" : "#0F52A7"} // 완료 시 초록색 (#2ECC71)
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
      {/* 업로드 완료 시 체크 아이콘 */}
      {isCompleted ? (
        <g transform={`translate(${radius - 8}, ${radius - 8})`}>
          <CheckIcon width="16px" height="16px" />
        </g>
      ) : (
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="14"
          fill="#000"
        >
          {value}%
        </text>
      )}
    </svg>
  );
};

export default StepTwo;
