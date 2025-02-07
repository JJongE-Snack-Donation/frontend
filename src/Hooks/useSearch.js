
import { useState, useMemo } from 'react';
//import axios from 'axios';
import testImages from '../Data/testImages';


const useSearch = () => {
    const [projectName, setProjectName] = useState('all');
    const [date, setDate] = useState('all');
    const [cameraSerial, setCameraSerial] = useState('all');
    const [cameraLabel, setCameraLabel] = useState('all');
    const [species, setSpecies] = useState('all');
    const [searchResults, setSearchResults] = useState(testImages);
    const [testImageData, setTestImageData] = useState(testImages);
    const [deletedImageIds, setDeletedImageIds] = useState(new Set());



    // 예외 검수 상태 업데이트 함수
    const updateExceptionStatus = (checkedIds) => {
        setTestImageData(prev => 
            prev.map(img => 
                checkedIds.includes(img.imageId) 
                    ? { ...img, isException: true }
                    : img
            )
        );
    };


    // useSearch.js
const handleSearch = () => {
    console.log("=== Search Start ===");
    console.log("Current filters:", { projectName, cameraSerial, cameraLabel, species });
    console.log("Current deletedImageIds:", Array.from(deletedImageIds));

    // 먼저 필터 조건 적용
    let filteredImages = testImages.filter(image => {
        const matchesFilters = (
            (projectName === 'all' || image.projectName === projectName) &&
            (cameraSerial === 'all' || image.SerialNumber === cameraSerial) &&
            (cameraLabel === 'all' || image.UserLabel === cameraLabel) &&
            (species === 'all' || image.species === species)
        );
        return matchesFilters && !deletedImageIds.has(image.imageId);
    });

    console.log("Images after filter conditions:", filteredImages);

    // 프로젝트별로 그룹화
    const groupedByProject = {};
    
    filteredImages.forEach(image => {
        const projectName = image.projectName;
        if (!groupedByProject[projectName]) {
            // 같은 프로젝트의 이미지들 찾기
            const projectImages = filteredImages.filter(img => 
                img.projectName === projectName
            );
            
            if (projectImages.length > 0) {
                const mainImage = { ...projectImages[0] };
                mainImage.relatedImages = projectImages;
                groupedByProject[projectName] = mainImage;
                console.log(`Set main image for ${projectName}:`, mainImage.imageId);
            }
        }
    });

    console.log("Final grouped results:", groupedByProject);
    
    const results = Object.values(groupedByProject);
    setSearchResults(results);
    return results;
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
        deletedImageIds,    
        setDeletedImageIds,         
        ...getUniqueOptions
    };
}; 

export default useSearch;
