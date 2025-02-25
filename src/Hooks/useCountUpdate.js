import { useState } from 'react';

const useCountUpdate = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0MDIwNDk2MywianRpIjoiMTMxZTc4ZDUtOTlhZi00NDM2LWExMDItZTQ0ZGQ3NWYzM2YxIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImFkbWluIiwibmJmIjoxNzQwMjA0OTYzLCJjc3JmIjoiNzZjZWMyZDYtMDJlMC00MGY5LWE2YjktOTgxYzVhOTY0MzUwIiwiZXhwIjoxNzQwMjkxMzYzfQ.7RCYY69qvos2E5I7o3nhwtEl9GpuXA6ekZEqCS07tog";

    const updateNormalInspectionBulk = async (imageIds, updates) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/inspection/normal/bulk-update', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
