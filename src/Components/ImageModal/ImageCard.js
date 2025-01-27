import React from 'react';
import downloadIcon from '../../Assets/Imgs/btn/download.svg';
import trashbinIcon from '../../Assets/Imgs/btn/trash_bin.svg';
import starIcon from '../../Assets/Imgs/etc/star.svg';

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
                onChange={(e) => onCheckboxChange(image.imageId, e)}
                onClick={(e) => e.stopPropagation()}
            />
            <span className="modal__all_image-number">{index + 1} - {image.species}</span>
            <button 
                className="modal__all_image-download"
                onClick={(e) => onDownload(image, e)}
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
            <img src={image.FilePath} alt="" />
            <button 
                className="modal__favorite-btn"
                onClick={(e) => e.stopPropagation()}
            >
                <img src={starIcon} alt="Favorite" />
            </button>
        </div>
    </div>
);

export default ImageCard;