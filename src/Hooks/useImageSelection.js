
import { useState, useEffect } from 'react';

export const useImageSelection = (initialImage) => {
  const [relatedImages, setRelatedImages] = useState(initialImage?.relatedImages || []);
  const [mainImage, setMainImage] = useState(initialImage || {});
  const [selectedCards, setSelectedCards] = useState([]);
  const [checkedBoxes, setCheckedBoxes] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedImageInfo, setSelectedImageInfo] = useState(initialImage || {});

    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        setIsAllSelected(isChecked);
        setCheckedBoxes(isChecked 
            ? relatedImages.map(img => img.imageId) 
            : []
        );
    };

    useEffect(() => {
  }, [initialImage]);

    const handleCardClick = (clickedImage, e) => {
        e.stopPropagation();
        setSelectedCards([clickedImage.imageId]);
        setSelectedImageInfo(clickedImage);
        setMainImage(clickedImage);
    };

    const handleCheckboxChange = (imageId, e) => {
        e.stopPropagation();
        setCheckedBoxes(prev => {
          const newChecked = prev.includes(imageId)
            ? prev.filter(id => id !== imageId)
            : [...prev, imageId];
          setIsAllSelected(newChecked.length === relatedImages.length);
          return newChecked;
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