import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const useSearch = () => {
    const [projectName, setProjectName] = useState('all');
    const [date, setDate] = useState('all');
    const [cameraSerial, setCameraSerial] = useState('all');
    const [cameraLabel, setCameraLabel] = useState('all');
    const [species, setSpecies] = useState('all');
    const [searchResults, setSearchResults] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [options, setOptions] = useState({
        projectOptions: [],
        speciesOptions: [],
        cameraSerialOptions: [],
        cameraLabelOptions: []
    });

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTczODk4MzEwOSwianRpIjoiNmEyOWE1NWMtNGNmNC00NTYxLTlkZTItZGEwYWRmYTA2MTM0IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImFkbWluIiwibmJmIjoxNzM4OTgzMTA5LCJjc3JmIjoiNmUyM2M1NzktN2I1NS00YTU3LTg1MjMtOTZkMmZhMGVkMGRjIiwiZXhwIjoxNzM5MDY5NTA5fQ.1lXYpsy5xo_qm2_1n7-O10XM--4RdH6Y6kIO-hr-OYc";

    // 프로젝트별 그룹화
    const groupByProject = (images = []) => {
        const groups = {};
        images.forEach(img => {
            const project = img.project_name;
            if (!groups[project]) {
                groups[project] = { 
                    ...img, 
                    relatedImages: images.filter(i => i.project_name === project)
                };
            }
        });
        return Object.values(groups);
    };

    const handleSearch = async (page = 1) => {
        setLoading(true);
        try {
            const queryParams = {
                ...(projectName !== 'all' && { project_name: projectName }),
                ...(date !== 'all' && { date: new Date(date).toISOString() }), // 날짜를 ISO 형식으로 변환
                ...(cameraSerial !== 'all' && { serial_number: cameraSerial }),
                ...(species !== 'all' && { species }),
                page,
                per_page: 100
            };

            const response = await axios.get('http://localhost:5000/search/inspection/normal/search', {
                params: queryParams,
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const mappedImages = response.data?.data?.images.map(img => ({
                imageId: img.id,
                filename: img.filename,
                thumbnail: img.thumbnail,
                species: img.species,
                count: img.count || 0, // 'count' 필드 추가
                serial_number: img.serial_number,
                date: img.date,
                project_name: img.project_name,
                is_classified: img.is_classified
            })) || [];

            // 프로젝트 그룹화
            const grouped = groupByProject(mappedImages); 
            setSearchResults(grouped);
            setTotalItems(response.data.data.total_count || 0);

            return grouped;

        } catch (err) {
            console.error('서버 응답:', err.response?.data);
            setError(err.response?.data?.message || '데이터를 가져오는 중 오류가 발생했습니다.');
            return [];
        } finally {
            setLoading(false);
        }
    };

    // 옵션 로드
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/search/inspection/normal/search', {
                    params: { is_classified: false },
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.data.data?.images) {
                    const images = response.data.data.images;
                    setOptions({
                        projectOptions: [...new Set(images.map(item => item.project_name))]
                            .map(value => ({ value, label: value })),
                        speciesOptions: [...new Set(images.map(item => item.species))]
                            .map(value => ({ value, label: value })),
                        cameraSerialOptions: [...new Set(images.map(item => item.serial_number))]
                            .map(value => ({ value, label: value })),
                        cameraLabelOptions: [...new Set(images.map(item => item.camera_label))]
                            .map(value => ({ value, label: value }))
                    });
                }
            } catch (error) {

                console.error('Failed to fetch options:', error);
            }
        };
        fetchOptions();
    }, []);

    const getUniqueOptions = useMemo(() => options, [options]);

    return {
        projectName, setProjectName,
        date, setDate,
        cameraSerial, setCameraSerial,
        cameraLabel, setCameraLabel,
        species, setSpecies,
        searchResults,
        totalItems,
        handleSearch,
        loading,
        error,
        ...getUniqueOptions
    };
};

export default useSearch;
