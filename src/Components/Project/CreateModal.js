import React, { useState } from "react";
import DatePicker from "react-datepicker";
import StatusMessage from "./StatusMessage"; // StatusMessage 가져오기
import "../../Styles/Modal.css";
import "../../Styles/DatePicker.css";
import "react-datepicker/dist/react-datepicker.css";
import x from "../../Assets/Imgs/btn/project/x.svg";
import asterisk from "../../Assets/Imgs/etc/asterisk.svg";

const Modal = ({ isOpen, onClose, account, email, onAdd }) => {
  const [project, setProject] = useState({
    id: "",
    name: "",
    address: "",
    status: "준비 중",
    startDate: null,
    endDate: null,
    createdDate: "",
    user: account,
    email: email,
    afffiliation: "",
    memo: "",
  });

  const [isNameValid, setIsNameValid] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(null);
  const [showMessage, setShowMessage] = useState(false);

  const handleNameChange = (e) => {
    const name = e.target.value;
    setProject({ ...project, name: name });
    setIsNameValid(name.trim().length > 0);
    setIsDuplicate(null);
  };

  //초기화
  const handleReset = () => {
    setProject({
      id: "",
      name: "",
      address: "",
      status: "준비 중",
      startDate: null,
      endDate: null,
      createdDate: "",
      user: account,
      email: email,
      afffiliation: "",
      memo: "",
    });
    setIsNameValid(false);
    setIsDuplicate(null);
    setShowMessage(false);
  };

  const handleCheckDuplicate = async () => {
    if (!isNameValid) return;
    try {
      console.log("Checking duplicate:", project.name);
      const isDuplicate = false; // 차후 중복 여부 확인 로직 추가
      setIsDuplicate(isDuplicate);
      setShowMessage(true);

      // 2초 후 메시지를 숨김
      setTimeout(() => setShowMessage(false), 2000);
    } catch (error) {
      console.error("Error checking duplicate:", error);
    }
  };

  const handleAdd = () => {
    if (isDuplicate === false) {
      const currentDate = new Date().toISOString(); // 현재 시간을 ISO 형식으로 생성
      onAdd({
        ...project,
        status: "준비 완료", // 상태 변경
        createdDate: currentDate, // 현재 시간 추가
      });
      handleReset();
      onClose();
    }
  };

  // 등록 버튼 활성화 조건
  const isFormValid =
    project.name.trim() &&
    project.address.trim() &&
    project.startDate &&
    project.endDate &&
    isDuplicate === false;

  if (!isOpen) return null;

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
        {/* 성공/실패 메시지 컴포넌트 */}
        <StatusMessage
          isSuccess={!isDuplicate} // 성공 여부
          message={
            isDuplicate
              ? "중복된 프로젝트 이름입니다."
              : "사용 가능한 프로젝트 이름입니다."
          }
          showMessage={showMessage}
        />
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
              setProject({ ...project, startDate: start, endDate: end });
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
            onChange={(e) => setProject({ ...project, memo: e.target.value })}
          />
        </div>
        <div className="row-container modal-footer">
          <button onClick={onClose}>취소</button>
          <button onClick={handleAdd} className="active" disabled={!isFormValid}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
