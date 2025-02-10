
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import useImageStore from './useImageStore'; 

const useSearch = () => {
    const { relatedImages, setRelatedImages } = useImageStore();
    const [selectedImage, setSelectedImage] = useState(null);
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
        cameraLabelOptions: [],
    });

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTczOTE2OTUxNiwianRpIjoiMTc2YThkMzUtMGQ1My00MTdkLThlM2ItYjlkMDFkOGZhYTZmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImFkbWluIiwibmJmIjoxNzM5MTY5NTE2LCJjc3JmIjoiOWNkYTY1MzYtYjBjZC00MjhiLWExZTEtNzVhNGE4MzA0NmU4IiwiZXhwIjoxNzM5MjU1OTE2fQ.rWkkf8myjmzmZ6rY2MPLwBqBNGJKdZjUQh-uTRz3fJo";

    // 프로젝트와 종 기준으로 그룹화
    const groupBySpecies = (images = []) => {
        const groups = {};
        images.forEach(img => {
            const key = `${img.project_name}_${img.species}`;
            if (!groups[key]) {
                groups[key] = { 
                    project_name: img.project_name,
                    species: img.species,
                    relatedImages: []
                };
            }
            groups[key].relatedImages.push(img);
        });
        return Object.values(groups);
    };
    

    const handleSearch = async (page = 1) => {
        setLoading(true);
        try {
            const queryParams = {
                ...(projectName !== 'all' && { project_name: projectName }),
                //...(date !== 'all' && { date: new Date(date).toISOString() }), // 날짜를 ISO 형식으로 변환
                ...(cameraSerial !== 'all' && { serial_number: cameraSerial }),
                ...(cameraLabel !== 'all' && { camera_label: cameraLabel }),
                ...(species !== 'all' && { species }),
                page,
                per_page: 100
            };

            console.log("Search Query Params:", queryParams);

            const response = await axios.get('http://localhost:5000/search/inspection/normal/search', {
                params: queryParams,
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log("API Response:", response.data);

            const newImages = response.data?.data?.images.map((img) => ({
                imageId: img.id,
                filename: img.filename,
                thumbnail: img.thumbnail,
                species: img.species,
                count: img.count || 0,
                serial_number: img.serial_number,
                date: img.date,
                project_name: img.project_name,
                is_classified: img.is_classified,
                exception_status: img.exception_status
            }));

            console.log("Mapped Images:", newImages);

            // 기존 데이터와 병합
            setRelatedImages(newImages);
            

        // 그룹화된 데이터 생성
        const groupedImages = groupBySpecies(newImages);

        console.log("Grouped Images:", groupedImages);

        setSearchResults(groupedImages.map((group) => group.relatedImages[0]));
        setTotalItems(response.data.data.total_count || 0);

        } catch (err) {
        
            setError(err.response?.data?.message || '데이터를 가져오는 중 오류가 발생했습니다.');
            return [];
        } finally {
            setLoading(false);
        }
    };


    // 현재 선택된 이미지와 동일한 그룹의 이미지만 필터링
    const filteredImages = useMemo(() => {
        if (!selectedImage || !relatedImages.length) return [];
        const filtered = relatedImages.filter(
            (img) =>
                img.project_name === selectedImage.project_name &&
                img.species === selectedImage.species
        );
        console.log("Filtered Images:", filtered);
        return filtered;

    }, [selectedImage, relatedImages]);


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

                console.error('옵션 로드 실패:', error);
            }
        };
        fetchOptions();
    }, []);

    const getUniqueOptions = useMemo(() => options, [options]);

    return {
        projectName, setProjectName,
        date, setDate,
        cameraSerial, setCameraSerial,
        cameraSerial, setCameraSerial,
        species, setSpecies,
        searchResults,
        totalItems,
        handleSearch,
        loading,
        error,
        filteredImages,
        ...getUniqueOptions
    };
};

export default useSearch;