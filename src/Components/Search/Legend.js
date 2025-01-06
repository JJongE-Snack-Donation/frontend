import React from "react";
import '../../Styles/Legend.css'
const Legend = () => {
    return (
        <div className="legend-wrapper">
            <div className="legend-dots">
                <span className="dot-item">
                    <span className="dot wildboar"></span>멧돼지
                </span>
                <span className="dot-item">
                    <span className="dot deer"></span>고라니
                </span>
                <span className="dot-item">
                    <span className="dot goat"></span>너구리
                </span>
                <span className="dot-item">
                    <span className="dot human"></span>사람
                </span>
                <span className="dot-item">
                    <span className="dot etc"></span>기타
                </span>
            </div>
        </div>
    );
};

export default Legend;