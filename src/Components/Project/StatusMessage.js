import React from "react";
import checkReverse from "../../Assets/Imgs/etc/check_reverse.svg";
import xReverse from "../../Assets/Imgs/etc/x_reverse.svg";
import "../../Styles/Components.css"; // CSS 파일 연결

const StatusMessage = ({ isSuccess, message, showMessage }) => {
  if (!showMessage) return null; // 메시지가 보이지 않도록 처리

  return (
    <div className="status-message-container">
      <div className="status-message-content">
        {isSuccess ? (
          <img src={checkReverse} alt="success" />
        ) : (
          <img src={xReverse} alt="error" />
        )}
        <p className={`status-message ${isSuccess ? "success" : "error"}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default StatusMessage;
