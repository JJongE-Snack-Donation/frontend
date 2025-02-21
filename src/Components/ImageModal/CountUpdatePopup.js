import React, { useState } from 'react';
import '../../Styles/CountUpdatePopup.css';

const CountUpdatePopup = ({ isOpen, onClose, onSubmit }) => {
    const [bestClass, setBestClass] = useState('사람');
    const [count, setCount] = useState(1);

    if (!isOpen) return null;

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({ BestClass: bestClass, Count: count });
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
                            <option value="사람">사람</option>
                            <option value="동물">너구리</option>
                            <option value="동물">고라니</option>
                            <option value="동물">동물</option>
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
