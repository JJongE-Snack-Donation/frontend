import React from 'react';
import '../../Styles/ImageModal.css';
import { useState } from 'react';
import { useImageSelection } from '../../Hooks/useImageSelection';
import useImageActions from '../../Hooks/useImageActions';
import ImageViewer from './ImageViewer';
import ImageCard from './ImageCard';
import ImageInfo from './ImageInfo';
import ConfirmToast from './ConfirmToast';
import checkIcon from '../../Assets/Imgs/etc/check_message.svg'

const ImageModal = ({ image, onClose, onImagesUpdate, onDelete }) => {
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
        handleDownload,
        handleBulkEdit,          
        handleBulkInfoDownload,  
        handleBulkImageDownload, 
        handleBulkDelete,
        handleExceptionInspection         
    } = useImageActions(relatedImages, setRelatedImages, onImagesUpdate, onDelete);


    const handleConfirmInspection = () => {
    handleExceptionInspection(checkedBoxes);
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
                                                <button >수정</button>
                                                <button >정보 다운로드</button>
                                                <button onClick={() => handleBulkImageDownload(checkedBoxes)}>이미지 다운로드</button>
                                                <button 
                                                    style={{ color: '#ff4d4f' }}
                                                    onClick={() => {
                                                        handleBulkDelete(checkedBoxes);
                                                        setShowConfirmToast(false);  // 토스트 메시지 닫기
                                                    }}
                                                >
                                                    이미지 삭제
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal__all">
                        {console.log("Rendered Related Images in Modal:", relatedImages)}
                            {relatedImages?.length > 0 ? (
                                relatedImages.map((img, index) => (
                                    <ImageCard
                                        key={img.imageId}
                                        image={img}
                                        index={index}
                                        onCardClick={() => {}}
                                        isSelected={false}
                                        isChecked={false}
                                        onCheckboxChange={() => {}}
                                        onDownload={() => {}}
                                        onDelete={() => {}}
                                    />
                                ))
                            ) : (
                                <div className="no-images-message">관련된 이미지가 없습니다.</div>
                            )}
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
