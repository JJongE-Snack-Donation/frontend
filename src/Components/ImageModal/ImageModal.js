import React from 'react';
import '../../Styles/ImageModal.css';
import { useState } from 'react';
import { useImageSelection } from '../../Hooks/useImageSelection';
import { useImageActions } from '../../Hooks/useImageActions';
import ImageViewer from './ImageViewer';
import ImageCard from './ImageCard';
import ImageInfo from './ImageInfo';
import ConfirmToast from './ConfirmToast';
import checkIcon from '../../Assets/Imgs/etc/check_message.svg'

const ImageModal = ({ image, onClose, onImagesUpdate }) => {
    const [showCompletionMessage, setShowCompletionMessage] = useState(false);

    const {
        selectedCards,
        checkedBoxes,
        isAllSelected,
        relatedImages,
        mainImage,
        selectedImageInfo,
        setRelatedImages,
        setCheckedBoxes, 
        setIsAllSelected,
        handleSelectAll,
        handleCardClick,
        handleCheckboxChange
    } = useImageSelection(image);

    const {
        isDropdownOpen,
        showConfirmToast,
        setIsDropdownOpen,
        setShowConfirmToast,
        handleDelete,
        handleDownload
    } = useImageActions(relatedImages, setRelatedImages, onImagesUpdate);

    const handleConfirmInspection = () => {
        if (onImagesUpdate) {
            const updatedImages = relatedImages.map(img => ({
                ...img,
                isException: checkedBoxes.includes(img.imageId) ? true : img.isException
            }));
            onImagesUpdate(updatedImages, checkedBoxes);
            setRelatedImages(updatedImages); // 추가된 부분
        }
        setShowConfirmToast(false);
        setCheckedBoxes([]);
        setIsAllSelected(false);

        // 완료 메시지 표시
        setShowCompletionMessage(true);
        
        // 3초 후 메시지 숨기기
        setTimeout(() => {
            setShowCompletionMessage(false);
        }, 3000);
    };
    
    
    
    


    return (
        <div className="modal" onClick={onClose}>
            <div className="modal__container" onClick={e => e.stopPropagation()}>
                <div className="modal__content">
                    <div className="modal__left-section">
                        <ImageViewer image={mainImage} />
                        <div className="modal__option-bar">
                            <input 
                                type="checkbox"
                                className="modal__select-all-checkbox"
                                checked={isAllSelected}
                                onChange={handleSelectAll}
                            />
                            <label>전체 선택</label>
                            <div className="modal__option-bar-right">
                                <button 
                                    className="modal__inspection-btn"
                                    disabled={checkedBoxes.length === 0}
                                    onClick={() => setShowConfirmToast(true)}
                                >
                                    예외 검수
                                </button>

                                {checkedBoxes.length > 1 && (
                                    <div className="modal__bulk-action">
                                        <button 
                                            className="modal__bulk-action-btn"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        >
                                            일괄 작업 ▼
                                        </button>
                                        {isDropdownOpen && (
                                            <div className="modal__bulk-action-dropdown">
                                                <button onClick={() => setShowConfirmToast(true)}>일괄 예외 검수</button>
                                                <button onClick={() => checkedBoxes.forEach(id => handleDownload(id))}>일괄 다운로드</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal__all">
                            {relatedImages?.map((image, index) => (
                                <ImageCard
                                    key={index}
                                    image={image}
                                    index={index}
                                    isSelected={selectedCards.includes(image.imageId)}
                                    isChecked={checkedBoxes.includes(image.imageId)}
                                    onCardClick={handleCardClick}
                                    onCheckboxChange={handleCheckboxChange}
                                    onDownload={handleDownload}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </div>
                    <ImageInfo imageData={selectedImageInfo} />
                </div>
            </div>
            {showConfirmToast && (
                <ConfirmToast
                    onConfirm={handleConfirmInspection}
                    onCancel={() => setShowConfirmToast(false)}
                />
            )}
            {showCompletionMessage && (
                <div className="modal-completion-message">
                    <img src={checkIcon} alt="CheckMassage" />
                    예외 검수 설정 완료
                </div>
            )}
        </div>
    );
};

export default ImageModal;
