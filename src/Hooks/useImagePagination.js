import { useState, useEffect } from 'react';
//import axios from 'axios';
import { testImages } from '../Data/testImages';

const useImagePagination = (itemsPerPage = 12) => {
  const [images, setImages] = useState([]); //현재 페이지의 이미지 목록을 저장 
  //const [totalItems, setTotalItems] = useState(0); //전체 이미지 수 저장(백엔드 연결 시 사용 코드)
  const [totalItems, setTotalItems] = useState(testImages.length);
  const [currentPage, setCurrentPage] = useState(1); //현재 페이지 번호 저장

  //백엔드 연결 시 수정 
/*  useEffect(() => {
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
*/

  //페이지네이션 기능 테스트 코드
  useEffect(() => {
    // 페이지에 해당하는 이미지들만 가져오기
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentImages = testImages.slice(startIndex, endIndex);
    setImages(currentImages);
  }, [currentPage, itemsPerPage, testImages]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  //페이지네이션 기능 테스트 코드

  return { images, totalItems, currentPage, itemsPerPage, handlePageChange };
};

export default useImagePagination;