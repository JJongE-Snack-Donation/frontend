import React from 'react';
import '../../Styles/ImageModal.css';
import { useState, useEffect } from 'react';
import { useImageSelection } from '../../Hooks/useImageSelection';
import useImageActions from '../../Hooks/useImageActions';
import ImageViewer from './ImageViewer';
import ImageCard from './ImageCard';
import ImageInfo from './ImageInfo';
import ConfirmToast from './ExceptionConfirmToast';
import checkIcon from '../../Assets/Imgs/etc/check_message.svg'
import useImageStore from '../../Hooks/useImageStore';
import InspectionCompleteToast from './InspectionCompleteToast';


const ImageModal = ({ image, onClose, onImagesUpdate, onDelete }) => {
    const [showCompletionMessage, setShowCompletionMessage] = useState(false);
    const [showInspectionCompleteToast, setShowInspectionCompleteToast] = useState(false);
    const { relatedImages, updateClassification } = useImageStore();

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
        handleCheckboxChange
    } = useImageSelection(image);

    const {
        isDropdownOpen,
        showConfirmToast,
        setIsDropdownOpen,
        setShowConfirmToast,
        handleDelete,
        handleDownload,
        handleBulkImageDownload,
        handleExceptionInspection,
        handleInspectionComplete 
    } = useImageActions();

    // 예외 검수 설정 핸들러
    const handleConfirmInspection = () => {
        handleExceptionInspection(checkedBoxes);
        setCheckedBoxes([]);
        setIsAllSelected(false);
        setShowCompletionMessage(true);
        setTimeout(() => {
            setShowCompletionMessage(false);
        }, 3000);
    };


    // 검수 확정 핸들러
    const handleConfirmInspectionComplete = async () => {
        try {
            await handleInspectionComplete(image.project_name, image.species);
            setShowInspectionCompleteToast(false);
            setShowCompletionMessage(true);
            setTimeout(() => {
                setShowCompletionMessage(false);
            }, 3000);
        } catch (error) {
            console.error("검수 확정 중 오류 발생:", error);
            alert("검수 확정 중 오류가 발생했습니다.");
        }
    };


    useEffect(() => {
    }, [relatedImages]);

    
    


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
                                                    // onClick={() => {
                                                    //     handleBulkDelete(checkedBoxes);
                                                    //     setShowConfirmToast(false);  // 토스트 메시지 닫기
                                                    // }}
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
                            {relatedImages?.length > 0 ? (
                                relatedImages.map((img, index) => (
                                    <ImageCard
                                        key={img.imageId}
                                        image={img}
                                        index={index}
                                        isSelected={selectedCards.includes(img.imageId)}
                                        isChecked={checkedBoxes.includes(img.imageId)}
                                        onCardClick={handleCardClick}
                                        onCheckboxChange={handleCheckboxChange} // 핸들러 전달
                                        onDownload={handleDownload}
                                        onDelete={handleDelete}
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
            </div>
            
        </div>
    );
};

export default ImageModal;
