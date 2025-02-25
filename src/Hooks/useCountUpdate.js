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
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    image_ids: imageIds,
                    updates,
                }),
            });

            if (!response.ok) {
                throw new Error('다중 이미지 수정 요청에 실패했습니다.');
            }

            const result = await response.json();
            return result;
        } catch (err) {
            console.error('API 호출 중 오류 발생:', err);
            setError(err.message);
            throw err; // 상위 컴포넌트에서 처리할 수 있도록 예외를 다시 던짐
        } finally {
            setLoading(false);
        }
    };

    return { updateNormalInspectionBulk, loading, error };
};

export default useCountUpdate;
