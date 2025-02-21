import React from 'react';
import '../../Styles/InspectionToast.css';

const InspectionCompleteToast = ({ onClose, onConfirm }) => (
    <div className="inspection-complete-toast" onClick={(e) => e.stopPropagation()}>
        <div className="inspection-complete-toast__content">
            <div className="inspection-complete-toast__header">
                <span>정말 검수 확정하시겠습니까?</span>
            </div>
            <p className="inspection-complete-toast__description">
                선택한 이미지가 검수 확정되며, 되돌릴 수 없습니다.
            </p>
            <div className="inspection-complete-toast__btn-group">
                <button
                    className="inspection-complete-toast__cancel-btn"
                    onClick={onClose}
                >
                    취소
                </button>
                <button
                    className="inspection-complete-toast__confirm-btn"
                    onClick={onConfirm}
                >
                    검수
                </button>
            </div>
        </div>
    </div>
);

export default InspectionCompleteToast;
