import { useState, useEffect } from 'react';
import axios from 'axios';

const useImagePagination = (itemsPerPage = 12) => {
  const [images, setImages] = useState([]); //현재 페이지의 이미지 목록을 저장 
  const [totalItems, setTotalItems] = useState(0); //전체 이미지 수 저장
  const [currentPage, setCurrentPage] = useState(1); //현재 페이지 번호 저장

  useEffect(() => {
    fetchImages(currentPage);
  }, [currentPage]);

  const fetchImages = async (page) => {
    try {
      const response = await axios.get('/api/images', {
        params: {
          page: page,
          per_page: itemsPerPage
        }
      });
      setImages(response.data.images);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error('이미지 불러오기 실패:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return { images, totalItems, currentPage, itemsPerPage, handlePageChange };
};

export default useImagePagination;