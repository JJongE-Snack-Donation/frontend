import React, { useState, useEffect } from 'react';
import '../../Styles/ImageModal.css';
import { useImageSelection } from '../../Hooks/useImageSelection';
import useSearch from '../../Hooks/useSearch';
import useImageActions from '../../Hooks/useImageActions';
import useImageStore from '../../Hooks/useImageStore';
import ImageViewer from './ImageViewer';
import ImageCard from './ImageCard';
import ImageInfo from './ImageInfo';
import ConfirmToast from './ExceptionConfirmToast';
import InspectionCompleteToast from './InspectionCompleteToast';
import checkIcon from '../../Assets/Imgs/etc/check_message.svg';

const ImageModal = ({ groupData, onClose }) => {
    const [showExceptionCompletionMessage, setShowExceptionCompletionMessage] = useState(false);
    const [showInspectionCompletionMessage, setShowInspectionCompletionMessage] = useState(false);
    const [showInspectionCompleteToast, setShowInspectionCompleteToast] = useState(false);
    const { fetchGroupImages } = useSearch();
    const { relatedImages, updateClassification } = useImageStore();
    const [groupImages, setGroupImages] = useState([]);


    const {
        selectedCards,
        checkedBoxes,
        isAllSelected,
        mainImage,
        selectedImageInfo,
        setCheckedBoxes, 
        setIsAllSelected,
        handleSelectAll,
        handleCardClick,
        handleCheckboxChange,
        setRelatedImages
    } = useImageSelection({ relatedImages: groupImages });

    const {
        isDropdownOpen,
        showConfirmToast,
        setIsDropdownOpen,
        setShowConfirmToast,
        handleDelete,
        handleDownload,
        handleBulkImageDownload,
        handleExceptionInspection,
        handleInspectionComplete,
        handleBulkImageDelete
    } = useImageActions();

    const handleConfirmInspection = () => {
        handleExceptionInspection(checkedBoxes);
        setCheckedBoxes([]);
        setIsAllSelected(false);
        setShowExceptionCompletionMessage(true);
        setTimeout(() => setShowExceptionCompletionMessage(false), 4000);
    };

    const handleConfirmInspectionComplete = async () => {
        try {
            await handleInspectionComplete(groupData.projectName, groupData.species);
            setShowInspectionCompleteToast(false);
            setShowInspectionCompletionMessage(true);
            setTimeout(() => setShowInspectionCompletionMessage(false), 4000);
        } catch (error) {
            console.error("검수 확정 중 오류 발생:", error);
            alert("검수 확정 중 오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        const loadGroupImages = async () => {
          if (groupData && groupData.evtnum) {
            const images = await fetchGroupImages(groupData.evtnum);
    
            setGroupImages(images);
    
            if (images.length > 0) {
              setRelatedImages(images);
              handleCardClick(images[0]); // 첫 번째 이미지를 기본 선택
            }
          }
        };    
    
        loadGroupImages();
      }, [groupData, fetchGroupImages]);
    
    


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
                                                <button onClick={() => handleBulkImageDownload(checkedBoxes)}>이미지 다운로드</button>
                                                <button onClick={() => handleBulkImageDelete(checkedBoxes)}
                                                    disabled={checkedBoxes.length === 0}
                                                    style={{ color: '#ff4d4f' }}
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
                        {groupImages.length > 0 ? (
                            groupImages.map((img, index) => (
                                    <ImageCard
                                        key={img.imageId}
                                        image={img}
                                        index={index}
                                        isSelected={selectedCards.includes(img.imageId)}
                                        isChecked={checkedBoxes.includes(img.imageId)}
                                        onCardClick={(e) => handleCardClick(img, e)}
                                        onCheckboxChange={(e) => handleCheckboxChange(img.imageId, e)}
                                        onDownload={() => handleDownload(img.imageId)}
                                        onDelete={(e) => handleDelete(img.imageId, e)}
                                    />
                                ))
                            ) : (
                                <div className="no-images-message">관련된 이미지가 없습니다.</div>
                            )}
                        </div>
                    </div>
                    <ImageInfo imageData={selectedImageInfo} />
                </div>

                <div className="modal__footer">
                    <button
                        className="modal__confirm-btn"
                        onClick={() => setShowInspectionCompleteToast(true)}
                    >
                        검수 확정
                    </button>
                    <button
                        className="modal__close-btn"
                        onClick={onClose}
                    >
                        닫기
                    </button>
                </div>
                {showConfirmToast && (
                    <ConfirmToast
                        onConfirm={handleConfirmInspection}
                        onCancel={() => setShowConfirmToast(false)}
                    />
                )}
                {showInspectionCompleteToast && (
                    <InspectionCompleteToast
                        onClose={() => setShowInspectionCompleteToast(false)}
                        onConfirm={handleConfirmInspectionComplete}
            
                    />
                )}
                {/* 예외 검수 설정 완료 메시지 */}
                {showExceptionCompletionMessage && (
                    <div className="modal-completion-message">
                        <img src={checkIcon} alt="확인 아이콘" className="completion-message__icon" />
                        예외 검수 설정 완료
                    </div>
                )}

                {/* 검수 확정 완료 메시지 */}
                {showInspectionCompletionMessage && (
                    <div className="modal-completion-message">
                        <img src={checkIcon} alt="확인 아이콘" className="completion-message__icon" />
                        검수 확정 완료
                    </div>
                )}

            </div>
            
        </div>
    );
};

export default ImageModal;
