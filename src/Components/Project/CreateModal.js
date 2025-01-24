import React, { useState } from "react";
import DatePicker from 'react-datepicker';
import "../../Styles/Modal.css"; // 스타일 파일 연결
import "../../Styles/DatePicker.css"; // 스타일 파일 연결
import 'react-datepicker/dist/react-datepicker.css';
import x from "../../Assets/Imgs/btn/project/x.svg";
import asterisk from "../../Assets/Imgs/etc/asterisk.svg";

const Modal = ({ isOpen, onClose, account, email, onAdd, checkDuplicate }) => {
  const [project, setProject] = useState({
    name: "",
    address: "",
    status: "",
    startDate: "",
    endDate: "",
    createdDate: "",
    user: account,
    email: email,
    afffiliation: "",
  });

  const [isNameValid, setIsNameValid] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(null);

  const handleNameChange = (e) => {
    const name = e.target.value;
    setProject({ ...project, name: name });
    setIsNameValid(name.trim().length > 0); // 이름이 입력되면 버튼 활성화
    setIsDuplicate(null); // 중복 여부 초기화
  };

  const handleCheckDuplicate = async () => {
    if (!isNameValid) return;
    try {
      console.log("Checking duplicate:", project.name);
      setIsDuplicate(isDuplicate);
    } catch (error) {
      console.error("Error checking duplicate:", error);
    }
  };

  const handleAdd = () => {
    if (isDuplicate === false) {
      onAdd(project);
      onClose();
    }
  };

  if (!isOpen) return null; // 모달이 열리지 않았을 경우 null 반환

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="row-container modal-header">
          <h2>프로젝트 추가</h2>
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
            onChange={handleNameChange}
          />
          <button
            className={`check-button ${isNameValid ? "active" : ""}`}
            onClick={handleCheckDuplicate}
            disabled={!isNameValid}
          >
            중복확인
          </button>
        </div>
        {isDuplicate !== null && (
          <p className={`duplicate-message ${isDuplicate ? "error" : "success"}`}>
            {isDuplicate ? "중복된 프로젝트 이름입니다." : "사용 가능한 이름입니다."}
          </p>
        )}
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
            const [start, end] = dates; // 날짜 배열에서 시작 날짜와 끝 날짜 추출
            setProject({
              ...project,
              startDate: start,
              endDate: end,
            });
          }}
          isClearable={false} // 선택 취소 버튼 비활성화
          dateFormat="yyyy-MM-dd" // 날짜 형식
          placeholderText="날짜를 선택하세요"
          monthsShown={2} // 두 달 표시
          shouldCloseOnSelect={false} // 선택 후 캘린더 닫히지 않음
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
              onChange={(e) => setProject({ ...project, address: e.target.value })}
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
            onChange={(e) => setProject({ ...project, afffiliation: e.target.value })}
          />
        </div>
        <div className="row-container">
          <button
            className="add-button"
            onClick={handleAdd}
            disabled={isDuplicate !== false}
          >
            프로젝트 추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
