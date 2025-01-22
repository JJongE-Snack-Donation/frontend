import React from "react";
import "../../Styles/Modal.css"; // 스타일 파일 연결
import x from "../../Assets/Imgs/btn/project/x.svg";
import asterisk from "../../Assets/Imgs/etc/asterisk.svg";

const Modal = ({ isOpen, onClose, account, email }) => {
  if (!isOpen) return null; // 모달이 열리지 않았을 경우 null 반환

  return (
    <div className="modal-overlay">
        <div className="modal-content">
          <div className="row-container modal-header">
            <h2>
              프로젝트 추가
            </h2>
            <button className="close-button" onClick={onClose}>
              <img src={x} alt="close" />
            </button>
          </div>
          <div className="row-container">
            <img src={asterisk} alt="asterisk" className="asterisk"/>
            <p>프로젝트 이름</p>
          </div>
          <input type="text" placeholder="프로젝트 이름을 입력하세요." />
      </div>
    </div>
  );
};

export default Modal;
