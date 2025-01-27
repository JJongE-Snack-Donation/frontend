import React, { useState } from "react";
import { ReactComponent as Upload } from "../../Assets/Imgs/etc/upload.svg";

const StepTwo = () => {
  const [currentPart, setCurrentPart] = useState("upload"); // 'upload', 'uploading', 'review'
  const [progress, setProgress] = useState(0); // 업로드 진행률
  const [uploadedFiles, setUploadedFiles] = useState([]); // 업로드된 파일 리스트
  const [uploadType, setUploadType] = useState("file"); // 'file' or 'folder'

  const handleUploadTypeChange = (event) => {
    setUploadType(event.target.value); // 파일 형식 변경
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (!files || files.length === 0) return;

    setUploadedFiles(files.map((file) => file.name));
    setProgress(0); // 진행률 초기화
    setCurrentPart("uploading");

    // 테스트용 진행률 증가 로직
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval); // 100%에 도달하면 진행률 증가 중단
          setTimeout(() => setCurrentPart("review"), 500); // 검수 단계로 이동
          return 100;
        }
        return prev + 10; // 10%씩 증가
      });
    }, 500); // 0.5초마다 진행률 업데이트
  };

  const renderUploadSection = () => {
    return (
      <>
        <CircularProgress value={progress} />
        <h2>분석할 이미지 파일을 업로드 하세요</h2>
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
        <div>
          <label>
            <input
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={handleFileChange}
              webkitdirectory={uploadType === "folder" ? "true" : undefined} // 폴더 업로드 설정
            />
            <div className="upload-box">
              <Upload/>
              <p>
                업로드 할 파일/폴더를 이 영역에
                끌어 놓거나 클릭합니다
              </p>
            </div>
          </label>
        </div>
      </>
    );
  };

  const renderUploadingSection = () => {
    return (
      <div>
        <h2>파일을 안전하게 업로드하고 있습니다...</h2>
        <div className="progress-container">
          <CircularProgress value={progress} />
        </div>
        <button onClick={() => setCurrentPart("upload")}>업로드 취소</button>
      </div>
    );
  };

  const renderReviewSection = () => {
    return (
      <div>
        <h2>{uploadedFiles.length}개의 파일이 업로드되었습니다</h2>
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
        <button onClick={() => setCurrentPart("upload")}>다시 업로드하기</button>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentPart) {
      case "upload":
        return renderUploadSection();
      case "uploading":
        return renderUploadingSection();
      case "review":
        return renderReviewSection();
      default:
        return null;
    }
  };

  return <div className="step-two-container">{renderContent()}</div>;
};

const CircularProgress = ({ value }) => {
  const radius = 40; // 원의 반지름
  const stroke = 4; // 선 두께
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke="#e6e6e6"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#0F52A7"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        strokeDasharray={circumference + " " + circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${radius} ${radius})`} // 위쪽부터 시작
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="14"
      >
        {value}%
      </text>
    </svg>
  );
};

export default StepTwo;
