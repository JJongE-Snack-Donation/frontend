import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import StatusMessage from "./StatusMessage";
import api from "../../Api";
import "../../Styles/Modal.css";
import "../../Styles/DatePicker.css";
import "react-datepicker/dist/react-datepicker.css";
import x from "../../Assets/Imgs/btn/project/x.svg";
import asterisk from "../../Assets/Imgs/etc/asterisk.svg";

const EditModal = ({ isOpen, onClose, projectData, onUpdate }) => {
  const [project, setProject] = useState({
    project_name: "",
    address: "",
    start_date: null,
    end_date: null,
    manager_organization: "",
    user: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
    memo: "",
  });

  const [isNameValid, setIsNameValid] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(null);

  // 모달 열릴 때 프로젝트 데이터를 상태에 로드
  useEffect(() => {
    if (projectData) {
      setProject({
        _id: projectData._id,
        id: projectData.id,
        project_name: projectData.project_name || "",
        address: projectData.address || "",
        start_date: projectData.start_date ? new Date(projectData.start_date) : null,
        end_date: projectData.end_date ? new Date(projectData.end_date) : null,
        manager_organization: projectData.manager_organization || "",
        user: localStorage.getItem("username"),
        email: localStorage.getItem("email"),
        memo: projectData.memo || "",
      });
  
      // project_name 유효성 검사
      setIsNameValid(
        (projectData.project_name || "").trim().length > 0 &&
        projectData.project_name !== project.project_name
      );
    }
  }, [projectData]);
  
  const handleInputChange = (field, value) => {
    setProject((prev) => ({ ...prev, [field]: value }));

    // 이름 유효성 검사
    if (field === "project_name") {
      setIsNameValid(value.trim().length > 0 && value !== projectData.project_name);
    }
  };

  const formattedProject = {
    ...project,
    start_date: project.start_date instanceof Date && !isNaN(project.start_date)
      ? project.start_date.toISOString().split("T")[0]
      : null,
    end_date: project.end_date instanceof Date && !isNaN(project.end_date)
      ? project.end_date.toISOString().split("T")[0]
      : null,
  };  

  const handleUpdate = () => {
    if (isFormValid) {
      onUpdate(formattedProject); // 부모 컴포넌트로 수정된 데이터 전달
      onClose(); // 모달 닫기
    }
  };

  const handleCheckDuplicate = async () => {
    if (!isNameValid) return;
    if (project.project_name === projectData.project_name) return;
    try {
      const response = await api.get(`/project/check-name`,
        { 
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params: { name: project.project_name } 
        }
      );
      if (response.status === 200) {
        setIsDuplicate(false);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 2000);
      }
    } catch (err) {
      console.error("Error checking duplicate:", err);
    }
  };

  // 폼 유효성 검사
  useEffect(() => {
    setIsFormValid(
      project.project_name.trim() &&
      project.address.trim() &&
      project.start_date &&
      project.end_date
    );
  }, [project]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="row-container modal-header">
          <h2>프로젝트 수정</h2>
          <button className="close-button" onClick={onClose}>
            <img src={x} alt="close" />
          </button>
        </div>
        <div className="row-container">
          <img src={asterisk} alt="asterisk" className="asterisk" />
          <p>프로젝트 이름</p>
        </div>
        <div className="row-container input-container">
          <input
            type="text"
            placeholder="프로젝트 이름을 입력하세요"
            value={project.project_name}
            onChange={(e) => handleInputChange("project_name", e.target.value)}
          />
          <button
            className={`check-button ${isNameValid ? "active" : ""}`}
            onClick={handleCheckDuplicate}
            disabled={!isNameValid}
          >
            중복확인
          </button>
          <StatusMessage
          isSuccess={!isDuplicate} // 성공 여부
          message={
            isDuplicate
              ? "중복된 프로젝트 이름입니다."
              : "사용 가능한 프로젝트 이름입니다."
          }
          showMessage={showMessage}
        />
        </div>
        <div className="row-container">
          <img src={asterisk} alt="asterisk" className="asterisk" />
          <p>프로젝트 기간</p>
        </div>
        <div className="row-container input-container">
           <DatePicker
              selectsRange
              startDate={project.start_date}
              endDate={project.end_date}
              onChange={(dates) => {
                const [start, end] = dates;
                setProject({ ...project, start_date: start, end_date: end });
              }}
              isClearable={false}
              dateFormat="yyyy-MM-dd"
              placeholderText="날짜를 선택하세요"
              monthsShown={2}
              shouldCloseOnSelect={false}
              showPopperArrow={false}
            />
        </div>
        <div className="row-container">
          <img src={asterisk} alt="asterisk" className="asterisk" />
          <p>주소</p>
        </div>
        <div className="row-container input-container">
          <input
            type="text"
            placeholder="프로젝트 주소를 입력하세요"
            value={project.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
        </div>
        <div className="row-container">
          <p>소속</p>
        </div>
        <div className="row-container input-container">
          <input
            type="text"
            placeholder="소속을 입력하세요"
            value={project.manager_organization}
            onChange={(e) => handleInputChange("manager_organization", e.target.value)}
          />
        </div>
        <div className="row-container">
          <p>담당자 계정</p>
        </div>
        <div className="row-container input-container">
          <input type="text" value={project.user} disabled />
        </div>
        <div className="row-container">
          <p>이메일</p>
        </div>
        <div className="row-container input-container">
          <input type="text" value={project.email} disabled />
        </div>
        <div className="row-container">
          <p>메모</p>
        </div>
        <div className="row-container input-container">
          <input
            type="text"
            placeholder="메모를 입력하세요"
            value={project.memo}
            onChange={(e) => handleInputChange("memo", e.target.value)}
          />
        </div>
        <div className="row-container modal-footer">
          <button onClick={onClose}>취소</button>
          <button onClick={handleUpdate} className="active" disabled={!isFormValid}>
            수정
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;