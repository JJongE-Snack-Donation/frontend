import { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import useImageStore from './useImageStore';

const useSearch = () => {
    const { groupedImages, setGroupedImages } = useImageStore();
    const fetchGroupImages = useImageStore(state => state.fetchGroupImages);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [searchParams, setSearchParams] = useState({
        projectName: '',
        date: '',
        serialNumber: '',
        species: ''
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

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTczOTc2MTA1MCwianRpIjoiMWZiNTg2MzktZjcyMi00Y2I3LWI3MzAtZGQ0OTRkOTE2M2NmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImFkbWluIiwibmJmIjoxNzM5NzYxMDUwLCJjc3JmIjoiZTNkNGU1MjYtOWIyOS00ZWQ0LWFkMmQtMGM0ZWRmNzczYTliIiwiZXhwIjoxNzM5ODQ3NDUwfQ.upcExpHp2m_XzX4cbQqn82h1Yjh2aVfGeOL2sRBm9N4";

    const handleSearch = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const queryParams = {
                project_name: searchParams.projectName || undefined,
                date: searchParams.date || undefined,
                serial_number: searchParams.serialNumber || undefined,
                species: searchParams.species || undefined,
                page,
                per_page: 100,
                group_by: 'evtnum'
            };

            const response = await axios.get('http://localhost:5000/search/inspection/normal/search', {
                params: queryParams,
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.status === 200) {
                if (response.data.groups) {
                    setGroupedImages(response.data.groups);
                    setTotalItems(response.data.total);
                    setCurrentPage(page);
                } else if (response.data.images) {
                    const grouped = response.data.images.map(img => ({
                        evtnum: img.event_number,
                        serialNumber: img.serial_number,
                        imageCount: 1,
                        ThumnailPath: img.thumbnail,
                        projectName: img.project_name,
                        DateTimeOriginal: img.date
                    }));
                    setGroupedImages(grouped);
                    setTotalItems(response.data.total);
                    setCurrentPage(page);
                } else {
                    setError('서버 응답 형식이 예상과 다릅니다.');
                }
            } else {
                setError(`API 요청 실패: ${response.data.message}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || '데이터를 가져오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [searchParams, setGroupedImages]);

    const filteredGroups = useMemo(() => {
        if (!selectedGroup || !groupedImages.length) return groupedImages;
        return groupedImages.filter(
            (group) =>
                group.projectName === selectedGroup.projectName &&
                group.serialNumber === selectedGroup.serialNumber
        );
    }, [selectedGroup, groupedImages]);

    const fetchOptions = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/search/inspection/normal/search', {
                params: { is_classified: true },
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
            setError('옵션을 불러오는 중 오류가 발생했습니다.');
        }
    }, []);

    useEffect(() => {
        fetchOptions();
        handleSearch(1);
    }, [fetchOptions, handleSearch]);

    const updateSearchParam = useCallback((key, value) => {
        setSearchParams(prev => ({ ...prev, [key]: value }));
    }, []);

    return {
        searchParams,
        updateSearchParam,
        groupedImages,
        filteredGroups,
        totalItems,
        currentPage,
        handleSearch,
        loading,
        error,
        setSelectedGroup,
        options,
        fetchOptions,
        fetchGroupImages
    };
};

export default useSearch;
