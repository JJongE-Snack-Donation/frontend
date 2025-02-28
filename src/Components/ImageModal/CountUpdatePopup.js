import React, { useState } from 'react';
import '../../Styles/CountUpdatePopup.css';
import useImageActions from '../../Hooks/useImageActions';

const classMapping = {
    '너구리': 'raccoon',
    '멧돼지': 'pig',
    '고라니': 'deer'
  };

const CountUpdatePopup = ({ isOpen, onClose, checkedIds, onSubmit }) => {
    const [bestClass, setBestClass] = useState('너구리');
    const [count, setCount] = useState(1);
    const { handleBulkEdit } = useImageActions();

    if (!isOpen) return null;

    const handleSubmit = (event) => {
        event.preventDefault();
        const updates = { BestClass: classMapping[bestClass], Count: count };
        onSubmit(checkedIds, updates);
        onClose();
    };
    

    return (
        <div className="count-update-popup__overlay" onClick={onClose}>
            <div className="count-update-popup" onClick={(e) => e.stopPropagation()}>
                <h3 className="count-update-popup__title">선택된 파일의 정보를 수정합니다</h3>
                <form className="count-update-popup__form" onSubmit={handleSubmit}>
                    <div className="count-update-popup__row">
                        <label htmlFor="category" className="count-update-popup__label">
                            종류:
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={bestClass}
                            onChange={(e) => setBestClass(e.target.value)}
                            className="count-update-popup__select"
                        >
                            <option value="고라니">고라니</option>
                            <option value="멧돼지">멧돼지</option>
                            <option value="너구리">너구리</option>
                        </select>
                    </div>

                    <div className="count-update-popup__row">
                        <label htmlFor="count" className="count-update-popup__label">
                            개체수:
                        </label>
                        <input
                            type="number"
                            id="count"
                            name="count"
                            min="1"
                            value={count}
                            onChange={(e) => setCount(Number(e.target.value))}
                            className="count-update-popup__input"
                        />
                    </div>

                    <div className="count-update-popup__buttons">
                        <button
                            type="button"
                            onClick={onClose}
                            className="count-update-popup__button count-update-popup__button--cancel"
                        >
                            닫기
                        </button>
                        <button
                            type="submit"
                            className="count-update-popup__button count-update-popup__button--submit"
                        >
                            수정
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CountUpdatePopup;
