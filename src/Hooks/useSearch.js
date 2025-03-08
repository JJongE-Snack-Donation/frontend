import { useEffect, useState, useMemo, useCallback } from 'react';
import useImageStore from './useImageStore';
import api from '../Api';

const useSearch = (selectedPage) => {
    const { groupedImages, setGroupedImages } = useImageStore();
    const fetchGroupImages = useImageStore(state => state.fetchGroupImages);
    const fetchExceptionGroupImages = useImageStore(state => state.fetchExceptionGroupImages);
    const fetchCompletedGroupImages = useImageStore(state => state.fetchCompletedGroupImages);
    
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [searchParams, setSearchParams] = useState({
        projectName: '',
        date: '',
        serialNumber: '',
        species: '',
    });
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [options, setOptions] = useState({
        projectOptions: [],
        speciesOptions: [],
        cameraSerialOptions: [],
        cameraLabelOptions: [],
    });

    // 일반 검수 리스트 조회
    const handleSearch = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const queryParams = {
                project_name: searchParams.projectName || undefined,
                date: searchParams.date || undefined,
                serial_number: searchParams.serialNumber || undefined,
                species: searchParams.species || undefined,
                page,
                per_page: 12,
                group_by: 'evtnum'
            };

            const response = await api.get('/search/inspection/normal/search', {
                params: queryParams,
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.data.status === 200) {
                setGroupedImages(response.data.groups || []);
                setTotalItems(response.data.total);
                setCurrentPage(page);
            } else {
                setError(`API 요청 실패: ${response.data.message}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || '데이터를 가져오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [searchParams, setGroupedImages]);

    // 예외 검수 리스트 조회
    const handleExceptionSearch = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const queryParams = {
                project_name: searchParams.projectName || undefined,
                date: searchParams.date || undefined,
                serial_number: searchParams.serialNumber || undefined,
                species: searchParams.species || undefined,
                page,
                per_page: 12,
                group_by: 'evtnum'
            };

            const response = await api.get('/search/inspection/exception/search', {
                params: queryParams,
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.data.status === 200) {
                setGroupedImages(response.data.groups || []);
                setTotalItems(response.data.total);
                setCurrentPage(page);
            } else {
                setError(`API 요청 실패: ${response.data.message}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || '예외 검수 데이터를 가져오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [searchParams, setGroupedImages]);

    // 🔹 검수 완료된 이미지 검색
    const handleCompletedSearch = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const queryParams = {
                project_name: searchParams.projectName || undefined,
                date: searchParams.date || undefined,
                serial_number: searchParams.serialNumber || undefined,
                species: searchParams.species || undefined,
                page,
                per_page: 12,
                group_by: 'evtnum'
            };

            const response = await api.get('/search/images/search', {
                params: queryParams,
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.data.status === 200) {
                setGroupedImages(response.data.groups || []);
                setTotalItems(response.data.total);
                setCurrentPage(page);
            } else {
                setError(`API 요청 실패: ${response.data.message}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || '검수 완료된 이미지 데이터를 가져오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [searchParams, setGroupedImages]);

    // 🔹 필터 옵션 불러오기
    const fetchOptions = useCallback(async () => {
        try {
          const endpoint = selectedPage === 'normal' 
            ? '/search/inspection/normal/search'
            : '/search/inspection/exception/search';
      
          const response = await api.get(endpoint, {
            params: { is_classified: selectedPage === 'normal' ? true : false },
            headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
          });
          
          // 이미지 데이터가 어디에 있는지 확인
          let images = [];
          if (response.data.images) {
            images = response.data.images;
          } else if (response.data.data?.images) {
            images = response.data.data.images;
          } else if (response.data.groups) {
            images = response.data.groups;
          }
          
          
          if (images && images.length > 0) {
            
            setOptions({
              projectOptions: [...new Set(images.map(item => item.project_name || item.projectName))]
                .filter(Boolean)
                .map(value => ({ value, label: value })),
              speciesOptions: [...new Set(images.map(item => item.species || item.BestClass))]
                .filter(Boolean)
                .map(value => ({ value, label: value })),
              cameraSerialOptions: [...new Set(images.map(item => item.serial_number || item.serialNumber))]
                .filter(Boolean)
                .map(value => ({ value, label: value })),
              cameraLabelOptions: [...new Set(images.map(item => item.camera_label))]
                .filter(Boolean)
                .map(value => ({ value, label: value }))
            });
          } else {
            console.error('이미지 데이터가 없습니다:', response.data);
          }
        } catch (error) {
          console.error('옵션 로드 실패:', error);
          setError('옵션을 불러오는 중 오류가 발생했습니다.');
        }
      }, [selectedPage]);
      
    


    useEffect(() => {
        fetchOptions();
        if (selectedPage === 'normal') {
          handleSearch(1);
        } else if (selectedPage === 'exception') {
          handleExceptionSearch(1);
        } else if (selectedPage === 'completed') {
        handleCompletedSearch(1);
    }
      }, [fetchOptions, handleSearch, handleExceptionSearch, selectedPage, setOptions]);
      
    


    const updateSearchParam = useCallback((key, value) => {
        setSearchParams(prev => ({ ...prev, [key]: value }));
    }, []);

    return {
        searchParams,
        updateSearchParam,
        groupedImages,
        totalItems,
        currentPage,
        handleSearch,
        handleExceptionSearch,
        handleCompletedSearch,
        loading,
        error,
        setSelectedGroup,
        options,
        fetchOptions,
        fetchGroupImages,
        fetchExceptionGroupImages,
        fetchCompletedGroupImages
    };
};

export default useSearch;
