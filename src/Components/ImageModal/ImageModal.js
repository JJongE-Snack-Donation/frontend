import React from 'react';
import '../../Styles/ImageModal.css';
import { useImageSelection } from '../../Hooks/useImageSelection';
import { useImageActions } from '../../Hooks/useImageActions';
import ImageViewer from './ImageViewer';
import ImageCard from './ImageCard';
import ImageInfo from './ImageInfo';
import ConfirmToast from './ConfirmToast';

const ImageModal = ({ image, onClose, onImagesUpdate }) => {
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
        console.log(`${checkedBoxes.length}개 이벤트 예외 검수 처리`);
        checkedBoxes.forEach(imageId => {
            // 예외 검수 처리 로직
        });
        setShowConfirmToast(false);
        setCheckedBoxes([]);
        setIsAllSelected(false);
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
                            {/* Action buttons */}
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
        </div>
    );
};

export default ImageModal;
