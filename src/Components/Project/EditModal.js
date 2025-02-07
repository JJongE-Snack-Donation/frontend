import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "../../Styles/Modal.css";
import "../../Styles/DatePicker.css";
import "react-datepicker/dist/react-datepicker.css";
import x from "../../Assets/Imgs/btn/project/x.svg";
import asterisk from "../../Assets/Imgs/etc/asterisk.svg";

const EditModal = ({ isOpen, onClose, projectData, onUpdate }) => {
  const [project, setProject] = useState({
    id: "",
    name: "",
    address: "",
    status: "",
    startDate: null,
    endDate: null,
    createdDate: "",
    user: "",
    email: "",
    afffiliation: "",
    memo: "",
  });

  const [isNameValid, setIsNameValid] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // 모달 열릴 때 프로젝트 데이터를 상태에 로드
  useEffect(() => {
    if (projectData) {
      setProject({ ...projectData });
      setIsNameValid(projectData.name.trim().length > 0);
    }
  }, [projectData]);

  const handleInputChange = (field, value) => {
    setProject((prev) => ({ ...prev, [field]: value }));

    // 이름 유효성 검사
    if (field === "name") {
      setIsNameValid(value.trim().length > 0);
    }
  };

  const handleUpdate = () => {
    if (isFormValid) {
      onUpdate(project); // 부모 컴포넌트로 수정된 데이터 전달
      onClose(); // 모달 닫기
    }
  };

  // 폼 유효성 검사
  useEffect(() => {
    setIsFormValid(
      project.name.trim() &&
      project.address.trim() &&
      project.startDate &&
      project.endDate
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
            value={project.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        </div>
        <div className="row-container">
          <img src={asterisk} alt="asterisk" className="asterisk" />
          <p>프로젝트 기간</p>
        </div>
        <div className="row-container input-container">
          <DatePicker
            selectsRange
            startDate={project.startDate}
            endDate={project.endDate}
            onChange={(dates) => {
              const [start, end] = dates;
              handleInputChange("startDate", start);
              handleInputChange("endDate", end);
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
            value={project.afffiliation}
            onChange={(e) => handleInputChange("afffiliation", e.target.value)}
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
