import { useState, useMemo } from 'react';
import axios from 'axios';
import testImages from '../Data/testImages';


const useSearch = () => {
    const [projectName, setProjectName] = useState('all');
    const [date, setDate] = useState('all');
    const [cameraSerial, setCameraSerial] = useState('all');
    const [cameraLabel, setCameraLabel] = useState('all');
    const [species, setSpecies] = useState('all');
    const [searchResults, setSearchResults] = useState(testImages);
    const [testImageData, setTestImageData] = useState(testImages);

    // 백엔드 연결 시 수정 
    // const handleSearch = async () => {
    //     setIsLoading(true);
    //     setError(null);
    //     try {
    //         const response = await axios.get('YOUR_API_ENDPOINT', {
    //             params: {
    //                 projectName,
    //                 date,
    //                 cameraSerial,
    //                 cameraLabel,
    //                 species
    //             }
    //         });
    //         setSearchResults(response.data);
    //     } catch (err) {
    //         setError('검색 중 오류가 발생했습니다.');
    //         console.error('Search error:', err);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };


    // 예외 검수 상태 업데이트 함수
    const updateExceptionStatus = (checkedIds) => {
        const updatedData = prev => 
            prev.map(img => 
                checkedIds.includes(img.imageId) 
                    ? { ...img, isException: true }
                    : img
            );
        
        setTestImageData(updatedData);
        setSearchResults(prev => 
            prev.map(img => ({
                ...img,
                isException: checkedIds.includes(img.imageId) ? true : img.isException,
                relatedImages: img.relatedImages?.map(related => 
                    checkedIds.includes(related.imageId)
                        ? { ...related, isException: true }
                        : related
                )
            }))
        );
    };
    
    

    const handleSearch = () => {
        // 프로젝트별로 그룹화하고 첫 번째 이미지만 선택
        const groupedByProject = testImages.reduce((groups, image) => {
            if (!groups[image.projectName]) {
                // 첫 번째 이미지를 메인 이미지로 설정
                const mainImage = { ...image };
                mainImage.relatedImages = testImages.filter(img => 
                    img.projectName === image.projectName
                    // imageId 비교 조건 제거
                );
                groups[image.projectName] = mainImage;
            }
            return groups;
        }, {});
    
        // 필터링 조건 적용
    const filteredResults = Object.values(groupedByProject).filter(image => {
        if (projectName !== 'all' && image.projectName !== projectName) return false;
        if (cameraSerial !== 'all' && image.SerialNumber !== cameraSerial) return false;
        if (cameraLabel !== 'all' && image.UserLabel !== cameraLabel) return false;
        if (species !== 'all' && image.species !== species) return false;
        return true;
    });

    setSearchResults(filteredResults);
    return filteredResults;
};

    const getUniqueOptions = useMemo(() => {
        return {
            projectOptions: [...new Set(testImages.map(item => item.projectName))]
                .map(value => ({ value, label: value })),
            speciesOptions: [...new Set(testImages.map(item => item.species))]
                .map(value => ({ value, label: value })),
            cameraSerialOptions: [...new Set(testImages.map(item => item.SerialNumber))]
                .map(value => ({ value, label: value })),
            cameraLabelOptions: [...new Set(testImages.map(item => item.UserLabel))]
                .map(value => ({ value, label: value }))
        };
    }, []);

    return {
        projectName, setProjectName,
        date, setDate,
        cameraSerial, setCameraSerial,
        cameraLabel, setCameraLabel,
        species, setSpecies,
        searchResults, 
        handleSearch,
        updateExceptionStatus, 
        testImageData,         
        setTestImageData,      
        ...getUniqueOptions
    };
}; 

export default useSearch;