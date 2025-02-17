import { useState } from 'react';
import axios from 'axios';

export const useImageSelection = (initialImage) => {
  const [relatedImages, setRelatedImages] = useState(initialImage?.relatedImages || []);
  const [mainImage, setMainImage] = useState(initialImage || {});
  const [selectedCards, setSelectedCards] = useState([]);
  const [checkedBoxes, setCheckedBoxes] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedImageInfo, setSelectedImageInfo] = useState(initialImage || {});

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTczOTc2MTA1MCwianRpIjoiMWZiNTg2MzktZjcyMi00Y2I3LWI3MzAtZGQ0OTRkOTE2M2NmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImFkbWluIiwibmJmIjoxNzM5NzYxMDUwLCJjc3JmIjoiZTNkNGU1MjYtOWIyOS00ZWQ0LWFkMmQtMGM0ZWRmNzczYTliIiwiZXhwIjoxNzM5ODQ3NDUwfQ.upcExpHp2m_XzX4cbQqn82h1Yjh2aVfGeOL2sRBm9N4";

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setIsAllSelected(isChecked);
    setCheckedBoxes(isChecked ? relatedImages.map(img => img.imageId) : []);
  };

  const handleCardClick = (clickedImage, e = null) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    setSelectedCards([clickedImage.imageId]); // 선택된 카드 ID 업데이트
    setSelectedImageInfo(clickedImage); // 선택된 이미지 정보 업데이트
    setMainImage(clickedImage); // mainImage 업데이트

    fetchImageDetail(clickedImage.imageId);
  };

  const handleCheckboxChange = (imageId, e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    setCheckedBoxes(prev => {
      const newChecked = prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId];
      setIsAllSelected(newChecked.length === relatedImages.length);
      return newChecked;
    });
  };
  

  const fetchImageDetail = async (imageId) => {
    try {
      const response = await axios.get(`http://localhost:5000/classified-images/${imageId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('Fetched Image Detail:', response.data);
      setSelectedImageInfo(response.data); // 상세 정보 업데이트
    } catch (error) {
      console.error('Error fetching image detail:', error);
    }
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
    handleCheckboxChange,
  };
};
