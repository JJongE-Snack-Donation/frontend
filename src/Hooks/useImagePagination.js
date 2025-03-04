import { useState, useEffect } from 'react';
import { testImages } from '../Data/testImages';
import axios from 'axios';
import useSearch from './useSearch';

const useImagePagination = (itemsPerPage = 12) => {
  const [images, setImages] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const { testImageData } = useSearch();
  const [totalItems, setTotalItems] = useState(testImageData.length);


  //페이지네이션 기능 테스트 코드
  useEffect(() => {
    // 페이지에 해당하는 이미지들만 가져오기
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentImages = testImageData.slice(startIndex, endIndex);
    setImages(currentImages);
    setTotalItems(testImageData.length);
  }, [currentPage, itemsPerPage, testImageData]); 

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  //페이지네이션 기능 테스트 코드

  return { images, totalItems, currentPage, itemsPerPage, handlePageChange };
};

export default useImagePagination;