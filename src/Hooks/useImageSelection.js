import { useState, useCallback, useEffect } from 'react';
import api from '../Api';
import useImageStore from './useImageStore';

export const useImageSelection = ({ initialImage, selectedPage }) => {
  const { relatedImages, setRelatedImages: setStoreRelatedImages } = useImageStore();
  const [mainImage, setMainImage] = useState(initialImage || {});
  const [selectedCards, setSelectedCards] = useState([]);
  const [checkedBoxes, setCheckedBoxes] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedImageInfo, setSelectedImageInfo] = useState(initialImage || {});

  const handleSelectAll = useCallback((e) => {
    const isChecked = e.target.checked;
    setIsAllSelected(isChecked);
    if (isChecked) {
      setCheckedBoxes(relatedImages.map(img => img.imageId));
    } else {
      setCheckedBoxes([]);
    }
  }, [relatedImages]);
  
  

  const setRelatedImages = useCallback((images) => {
    setStoreRelatedImages(images);
    // 로컬 상태도 업데이트
    setMainImage(images[0] || {});
    setSelectedCards([]);
    setCheckedBoxes([]);
    setIsAllSelected(false);
    setSelectedImageInfo(images[0] || {});
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
        } else if (selectedPage === 'completed') { 
            endpoint = `/images/${imageId}`;
        }

        const response = await api.get(endpoint, {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        // 페이지 타입에 따라 다른 응답 구조 처리
        if (selectedPage === 'completed') {
          setSelectedImageInfo(response.data); // 응답 데이터 설정
      } else {
          setSelectedImageInfo(response.data);
      }
  } catch (error) {
      console.error('Error fetching image detail:', error.response || error);
  }
};

useEffect(() => {
  setIsAllSelected(checkedBoxes.length === relatedImages.length);
}, [checkedBoxes, relatedImages]);

  

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
