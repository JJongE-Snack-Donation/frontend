import { useState } from 'react';

export const useImageSelection = (initialImage) => {
    const [selectedCards, setSelectedCards] = useState([]);
    const [checkedBoxes, setCheckedBoxes] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [relatedImages, setRelatedImages] = useState(initialImage.relatedImages || []);
    const [mainImage, setMainImage] = useState(initialImage);
    const [selectedImageInfo, setSelectedImageInfo] = useState(initialImage);

    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        setIsAllSelected(isChecked);
        setCheckedBoxes(isChecked ? initialImage.relatedImages?.map(img => img.imageId) || [] : []);
    };

    const handleCardClick = (clickedImage, e) => {
        e.stopPropagation();
        setSelectedCards([clickedImage.imageId]);
        setSelectedImageInfo(clickedImage);
        setMainImage(clickedImage);
    };

    const handleCheckboxChange = (imageId, e) => {
        e.stopPropagation();
        setCheckedBoxes(prev => {
            if (prev.includes(imageId)) {
                return prev.filter(id => id !== imageId);
            }
            return [...prev, imageId];
        });
    };

    return {
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
    };
};
