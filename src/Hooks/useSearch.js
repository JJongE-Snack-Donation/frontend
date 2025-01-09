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



    const handleSearch = () => {
        const filteredResults = testImages.filter(image => {
            const conditions = [];
            
            if (projectName !== '' && projectName !== 'all') {
                conditions.push(image.projectName === projectName);
            }
            if (cameraSerial !== 'all') {
                conditions.push(image.SerialNumber === cameraSerial);
            }
            if (cameraLabel !== 'all') {
                conditions.push(image.UserLabel === cameraLabel);
            }
            if (species !== '' && species !== 'all') {
                conditions.push(image.species === species);
            }
            
            return conditions.length === 0 || conditions.every(condition => condition);
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
        searchResults, handleSearch,
        ...getUniqueOptions // 옵션들을 반환값에 포함
    };
}; 

export default useSearch;