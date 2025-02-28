import { useState, useCallback } from 'react';
import api from '../Api';
import useImageStore from './useImageStore';

export const useImageSelection = ({ initialImage, selectedPage }) => {
  const { relatedImages, setRelatedImages: setStoreRelatedImages } = useImageStore();
  const [mainImage, setMainImage] = useState(initialImage || {});
  const [selectedCards, setSelectedCards] = useState([]);
  const [checkedBoxes, setCheckedBoxes] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedImageInfo, setSelectedImageInfo] = useState(initialImage || {});

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setIsAllSelected(isChecked);
    setCheckedBoxes(isChecked ? relatedImages.map(img => img.imageId) : []);
  };

  const setRelatedImages = useCallback((images) => {
    setStoreRelatedImages(images);
  }, [setStoreRelatedImages]);

  // 카드 클릭 시 선택된 카드의 아이디와 정보 재설정, 메인 이미지로 설정
  const handleCardClick = useCallback((clickedImage, e = null) => {
    if (e && e.stopPropagation) {
        e.stopPropagation();
    }

    setSelectedCards([clickedImage.imageId]);
    setMainImage(clickedImage);
    setSelectedImageInfo(clickedImage); // ✅ 먼저 선택한 이미지 정보 업데이트

    // ✅ 검수 완료된 이미지(completed)에서는 항상 `fetchImageDetail` 실행
    if (selectedPage === 'completed' || !clickedImage.detailFetched) {
        fetchImageDetail(clickedImage.imageId, selectedPage);
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
        let endpoint;
        if (selectedPage === 'normal') {
            endpoint = `/classified-images/${imageId}`;
        } else if (selectedPage === 'exception') {
            endpoint = `/unclassified-images/${imageId}`;
        } else if (selectedPage === 'completed') {  // ✅ 검수 완료된 이미지 조회
            endpoint = `/images/${imageId}`;
        }

        const response = await api.get(endpoint, {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        console.log('Fetched Image Detail:', response.data);

        // ✅ 검수 완료된 이미지는 response.data.data에서 가져옴
        //const imageData = selectedPage === 'completed' ? response.data.data : response.data;
        //setSelectedImageInfo(imageData);
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
    setCheckedBoxes,
    setRelatedImages,
    setIsAllSelected,
    handleSelectAll,
    handleCardClick,
    handleCheckboxChange,
  };
};
