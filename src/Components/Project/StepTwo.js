import React, { useState, useEffect } from "react";
import { ReactComponent as Upload } from "../../Assets/Imgs/etc/upload.svg";
import { ReactComponent as CheckIcon } from "../../Assets/Imgs/etc/check.svg"; 
import trash from "../../Assets/Imgs/btn/project/trash.svg";

const StepTwo = () => {
  const [currentPart, setCurrentPart] = useState("upload");
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadType, setUploadType] = useState("file");
  const [isUploadBoxFocused, setIsUploadBoxFocused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(null);
  const [failedUploads, setFailedUploads] = useState(0); // 실패한 업로드 수 추가

  useEffect(() => {
    let interval;
    if (currentPart === "uploading") {
      setElapsedTime(0);
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
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
    setSelectedFiles([]);
    setElapsedTime(0);
    setRemainingTime(null);
    setFailedUploads(0);
  };

  const processFiles = (files) => {
    if (!files || files.length === 0) return;

    setUploadedFiles(files.map((file) => file.name));
    setProgress(0);
    setCurrentPart("uploading");

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

   // ✅ 선택된 파일 관리
   const handleCheckboxChange = (fileName) => {
    setSelectedFiles((prevSelected) =>
      prevSelected.includes(fileName)
        ? prevSelected.filter((file) => file !== fileName) // 선택 해제
        : [...prevSelected, fileName] // 선택 추가
    );
  };

  // ✅ 선택된 파일 삭제
  const handleDeleteSelectedFiles = () => {
    setUploadedFiles((prevFiles) => prevFiles.filter((file) => !selectedFiles.includes(file)));
    setSelectedFiles([]); // 선택 목록 초기화
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

        {currentPart === "review" && (
          <div className="review-container">
            <table className="upload-summary">
              <thead>
                <tr>
                  <th>파일 총 개수</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{uploadedFiles.length}</td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <th>업로드 성공</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{uploadedFiles.length - failedUploads}</td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <th>업로드 실패</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{failedUploads}</td>
                </tr>
              </tbody>
            </table>
            <div className="row-header">
              <h2>업로드 성공</h2>
              <button onClick={handleDeleteSelectedFiles} disabled={selectedFiles.length === 0}>
                <img src={trash} alt="trash" />
              </button>
            </div>
            <table className="file-list">
            <thead>
                <tr>
                  <th>파일 이름</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFiles.map((file, index) => (
                  <tr key={index}>
                    <td>
                      <input
                          type="checkbox"
                          checked={selectedFiles.includes(file)}
                          onChange={() => handleCheckboxChange(file)}
                        />
                      {file}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  };

  return <div className="step-two-wrap">{UploadProcess()}</div>;
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

export default StepTwo;
