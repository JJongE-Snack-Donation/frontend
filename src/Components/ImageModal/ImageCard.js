import React from 'react';
import downloadIcon from '../../Assets/Imgs/btn/download.svg';
import trashbinIcon from '../../Assets/Imgs/btn/trash_bin.svg';
import starIcon from '../../Assets/Imgs/etc/star.svg';
import '../../Styles/ImageModal.css'

const ImageCard = ({ 
    image, 
    index, 
    isSelected, 
    isChecked, 
    onCardClick, 
    onCheckboxChange, 
    onDownload, 
    onDelete 
}) => (
    
    <div 
        className={`modal__all_image-item ${isSelected ? 'selected' : ''}`}
        onClick={(e) => onCardClick(image, e)}
    >
        <div className="modal__all_image-header">
            <input 
                type="checkbox" 
                className="modal__all_image-checkbox"
                checked={isChecked}
                onChange={(e) => {
                    e.stopPropagation();
                    onCheckboxChange(image.imageId, e); // image.imageId 전달
                  }}
            />
            <span className="modal__all_image-number">{index + 1} - {image.fileName}</span>
            <button 
                className="modal__all_image-download"
                onClick={(e) => {
                    e.stopPropagation();
                    onDownload(image, e)
                }}
            >
                <img src={downloadIcon} alt="Download" />
            </button>
            <button 
                className="modal__all_image-delete"
                onClick={(e) => onDelete(image.imageId, e)}
            >
                <img src={trashbinIcon} alt="Delete" />
            </button>
        </div>
        <div className="modal__all_image-content">
            <img  src={image.imageUrl} alt="" />
            {image.exception_status === "processed" && (
                <div className="exception-overlay">예외</div>
            )}
        </div>

    </div>
);


export default ImageCard;