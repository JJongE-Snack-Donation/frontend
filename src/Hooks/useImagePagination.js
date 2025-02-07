import { useState, useEffect } from 'react';
import { testImages } from '../Data/testImages';
import axios from 'axios';
import useSearch from './useSearch';

const useImagePagination = (itemsPerPage = 12) => {
  const [images, setImages] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const { testImageData } = useSearch();
  const [totalItems, setTotalItems] = useState(testImageData.length);

  //백엔드 연결 시 수정 
/* 
    useEffect(() => {
      fetchImages(currentPage);
    }, [currentPage]);

    const fetchImages = async (page) => {
      try {
        const response = await axios.get('/api/images', {
          params: {
            page: page,
            per_page: itemsPerPage,
            projectName: projectName || 'all',
            date: date || 'all',
            cameraSerial: cameraSerial || 'all',
            cameraLabel: cameraLabel || 'all',
            species: species || 'all'
          }
        });
        
        if (response.data.images) {
          setImages(response.data.images);
          setTotalItems(response.data.total);
        }
      } catch (error) {
        console.error('이미지 불러오기 실패:', error);
        // 에러 발생 시 빈 배열로 초기화
        setImages([]);
        setTotalItems(0);
      }
    };

    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
      fetchImages(pageNumber);
    };

*/

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