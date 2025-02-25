import { useState, useCallback } from 'react';
import axios from 'axios';

export const useImageSelection = ({ initialImage, selectedPage }) => {
  const [relatedImages, setRelatedImages] = useState(initialImage?.relatedImages || []);
  const [mainImage, setMainImage] = useState(initialImage || {});
  const [selectedCards, setSelectedCards] = useState([]);
  const [checkedBoxes, setCheckedBoxes] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedImageInfo, setSelectedImageInfo] = useState(initialImage || {});

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0MDIwNDk2MywianRpIjoiMTMxZTc4ZDUtOTlhZi00NDM2LWExMDItZTQ0ZGQ3NWYzM2YxIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImFkbWluIiwibmJmIjoxNzQwMjA0OTYzLCJjc3JmIjoiNzZjZWMyZDYtMDJlMC00MGY5LWE2YjktOTgxYzVhOTY0MzUwIiwiZXhwIjoxNzQwMjkxMzYzfQ.7RCYY69qvos2E5I7o3nhwtEl9GpuXA6ekZEqCS07tog";

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setIsAllSelected(isChecked);
    setCheckedBoxes(isChecked ? relatedImages.map(img => img.imageId) : []);
  };

  // 카드 클릭 시 선택된 카드의 아이디와 정보 재설정, 메인 이미지로 설정
  const handleCardClick = useCallback((clickedImage, e = null) => {
    if (e && e.stopPropagation) {
        e.stopPropagation();
    }
    setSelectedCards([clickedImage.imageId]);
    setMainImage(clickedImage);

    // 이미 상세 정보가 있다면 API 호출을 하지 않음
    if (!clickedImage.detailFetched) {
        fetchImageDetail(clickedImage.imageId, selectedPage);
    } else {
        setSelectedImageInfo(clickedImage);
    }
}, [selectedPage]);


  // 체크 박스 선택 시
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
  

  // 모달창에서 선택한 이미지의 상세 정보 조회
  const fetchImageDetail = async (imageId, selectedPage) => {
    try {
      const endpoint = selectedPage === 'normal'
        ? `http://localhost:5000/classified-images/${imageId}`
        : `http://localhost:5000/unclassified-images/${imageId}`;
  
      const response = await axios.get(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
  
      console.log('Fetched Image Detail:', response.data);
      setSelectedImageInfo(response.data);
    } catch (error) {
      console.error('Error fetching image detail:', error.response || error);
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
