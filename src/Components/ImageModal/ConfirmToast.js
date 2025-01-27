import React from 'react';

const ConfirmToast = ({ onConfirm, onCancel }) => (
    <div className="confirm-toast">
        <div className="confirm-toast__content">
            <span>이벤트를 예외 검수로 설정하시겠습니까?</span>
            <div className="confirm-toast__btn">
                <button 
                    className="confirm-toast__cancel-btn"
                    onClick={onCancel}
                >
                    취소
                </button>
                <button 
                    className="confirm-toast__confirm-btn"
                    onClick={onConfirm}
                >
                    설정
                </button>
            </div>
        </div>
    </div>
);

export default ConfirmToast;