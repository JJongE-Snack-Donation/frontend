import { useState } from 'react';
import api from '../Api';

const useCountUpdate = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateNormalInspectionBulk = async (imageIds, updates) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/inspection/normal/bulk-update', {
                image_ids: imageIds,
                updates: updates
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            return response.data;
        } catch (err) {
            console.error('API 호출 중 오류 발생:', err.response?.data || err.message);
            setError(err.response?.data?.message || err.message || '다중 이미지 수정 요청에 실패했습니다.');
            throw err;
        } finally {
            setLoading(false);
        }
    };
    

    return { updateNormalInspectionBulk, loading, error };
};

export default useCountUpdate;
