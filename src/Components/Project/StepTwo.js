import React, { useState, useEffect } from "react";
import api from "../../Api";
import { ReactComponent as Upload } from "../../Assets/Imgs/etc/upload.svg";
import { ReactComponent as CheckIcon } from "../../Assets/Imgs/etc/check.svg";
import trash from "../../Assets/Imgs/btn/project/trash.svg";

const StepTwo = ({nextStep,projectId,projectName,setSelectProjectFile}) => {
  const [currentPart, setCurrentPart] = useState("upload");
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadType, setUploadType] = useState("file");
  const [isUploadBoxFocused, setIsUploadBoxFocused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(null);
  const [failedUploads, setFailedUploads] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [filesPerPage] = useState(8); // 한 페이지당 보여줄 파일 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = uploadedFiles.slice(indexOfFirstFile, indexOfLastFile);

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

  const processFiles = async (files) => {
    if (!files || files.length === 0) return;
  
    setUploadedFiles(files.map((file) => file.name));
    setProgress(0);
    setCurrentPart("uploading");
    setIsUploading(true);
  
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
  
    const projectInfo = JSON.stringify({
      project_id: projectId,  
      project_name: projectName  
    });
  
    formData.append("project_info", projectInfo);
    console.log("프로젝트 정보:", formData.get("project_info"));
  
    try {
      // **1. 파일 업로드 요청 (0% → 50%)**
      const response = await api.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        onUploadProgress: (event) => {
          const percentCompleted = Math.round((event.loaded * 50) / event.total);
          setProgress(percentCompleted);
        },
      });
  
      if (response.status === 200) {
        console.log("업로드 성공:", response.data);
        const uploadedData = response.data.data.uploaded_files || [];
  
        setUploadedFiles(uploadedData.map((file) => ({ filename: file.filename, image_id: file.image_id })));
        setProgress(50); // **업로드 완료 시 50% 고정**
        
        // **2. 파싱 시작**
        await startParsing(uploadedData.map((file) => file.image_id));
      }
  
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      setFailedUploads((prev) => prev + 1);
      setCurrentPart("upload");
    } finally {
      setIsUploading(false);
    }
  };
  
  const startParsing = async (imageIds) => {
    if (!imageIds || imageIds.length === 0) return;
  
    try {
      console.log("파싱 시작:", imageIds);
  
      const response = await api.post("/files/parse-exif", 
        JSON.stringify({ image_ids: imageIds, timeout: 30 }), 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        
      console.log("파싱 요청 결과:", response.data);
      
      if (response.status === 200) {
        console.log("파싱 요청 성공, 진행률 증가 시작...");
        
        // **3. 진행률 50% → 100%까지 점진적 증가**
        let progressInterval = setInterval(() => {
          setProgress((prevProgress) => {
            if (prevProgress >= 100) {
              clearInterval(progressInterval);
              setCurrentPart("review");  // **파싱 완료 후 review로 이동**
              return 100;
            }
            return prevProgress + 5;  // 5%씩 증가
          });
        }, 500); // 0.5초마다 진행률 증가
      }
  
    } catch (error) {
      console.error("파싱 요청 실패:", error);
      alert("파싱 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };  

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleCheckboxChange = (fileId) => {
    setSelectedFiles((prevSelected) =>
      prevSelected.includes(fileId)
        ? prevSelected.filter((id) => id !== fileId)
        : [...prevSelected, fileId]
    );
  };

  const handleDeleteSelectedFiles = async () => {
    if (selectedFiles.length === 0) return;

    try {
        // API 요청을 위한 payload 생성
        const response = await api.delete("/files/bulk-delete", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            data: {
                image_ids: selectedFiles,  // 삭제할 image_id 리스트
            },
        });

        // 상태 코드로 성공 판별
        if (response.status === 200) {
            console.log("파일 삭제 결과:", response.data);
            const failedIds = response.data.data.failed_ids || [];
            const successfulDeletes = selectedFiles.filter((id) => !failedIds.includes(id));

            // 성공적으로 삭제된 파일들을 UI에서 제거
            setUploadedFiles((prevFiles) => prevFiles.filter((file) => !successfulDeletes.includes(file.image_id)));
            setSelectedFiles([]); // 선택 상태 초기화

            // 결과 피드백
            if (failedIds.length > 0) {
                alert(`${failedIds.length}개의 파일 삭제에 실패했습니다.`);
            } else {
                alert("모든 선택된 파일이 성공적으로 삭제되었습니다.");
            }
        } else {
            // 상태 코드가 200이 아니면 실패로 간주
            alert("파일 삭제 중 문제가 발생했습니다. 다시 시도하세요.");
        }
    } catch (error) {
        console.error("파일 삭제 실패:", error);
        alert("서버에 연결할 수 없습니다. 다시 시도하세요.");
    }
};

   // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedFiles(currentFiles.map((file) => file.image_id)); // image_id만 저장
    } else {
      setSelectedFiles([]);
    }
  };  

  const handleStartAnalysis = async () => {
    nextStep();
    setSelectProjectFile(uploadedFiles);
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
              <button className="delete-btn" onClick={handleDeleteSelectedFiles} disabled={selectedFiles.length === 0}>
                <img src={trash} alt="trash" />
              </button>
            </div>
            <div className="file-list-container">
              <table className="file-list">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={uploadedFiles.length > 0 && selectedFiles.length === uploadedFiles.length}
                      />
                      파일 이름
                    </th>
                  </tr>
                </thead>
                <tbody>
                {currentFiles.map((file, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.image_id)}
                    onChange={() => handleCheckboxChange(file.image_id)}
                  />
                  {file.filename}
                </td>
              </tr>
            ))}
                </tbody>
              </table>
            </div>
             {/* 페이지네이션 */}
            <div className="pagination">
            {Array.from({ length: Math.ceil(uploadedFiles.length / filesPerPage) }, (_, i) => (
              <button
                key={i}
                className={i + 1 === currentPage ? "active" : ""}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            </div>
            <div className="start-btn-container">
              <button 
              className="start-btn"
              onClick={handleStartAnalysis}
              >분석 시작</button>
            </div>
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
