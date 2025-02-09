import { useState } from 'react';

const useImageActions = (relatedImages, setRelatedImages, onImagesUpdate, onDelete, setDeletedImageIds) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showConfirmToast, setShowConfirmToast] = useState(false);

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTczOTA4MjkzOCwianRpIjoiMzlmZDQ4ZDktMmVjYi00ZmJkLThkOWMtODJlYTdlYzUyMjI4IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImFkbWluIiwibmJmIjoxNzM5MDgyOTM4LCJjc3JmIjoiNzZhMGRmYTEtOGM2Mi00OGM3LThiNWItY2FlMmI5YzFjMzIzIiwiZXhwIjoxNzM5MTY5MzM4fQ.rQWdBTQ7XYZZnc3nn5U-QbtIUkqaRAKNGE_BlaOUhvA";

    // 예외 상태 processed로 처리
    const handleExceptionInspection = async (checkedIds) => {
        for (const imageId of checkedIds) {
            try {
                const response = await fetch(`http://localhost:5000/exception/${imageId}/status`, {
                    method: 'PUT',
                    headers: {
                        'accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status: "processed",
                        comment: "Processed via exception inspection"
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                console.log(result.message);
            } catch (error) {
                console.error("Error updating image status:", error);
            }
        }

        const updatedImages = relatedImages.map(img => ({
            ...img,
            exception_status: checkedIds.includes(img.imageId) ? "processed" : img.exception_status
        }));

        setRelatedImages(updatedImages);
        
        if (onImagesUpdate) {
            onImagesUpdate(updatedImages, checkedIds);
        }

        setShowConfirmToast(false);
    };


    // 단일 이미지 삭제
    const handleDelete = async (imageId, e) => {
        if (e) {
            e.stopPropagation();
        }
    
        try {
            // DELETE 요청 보내기
            const response = await fetch(`http://localhost:5000/unclassified-images/${imageId}`, {
                method: 'DELETE',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to delete image:', errorData.message);
                alert(`이미지 삭제 실패: ${errorData.message}`);
                return;
            }
    
            // 성공적으로 삭제된 경우 상태 업데이트
            const updatedImages = relatedImages.filter(img => img.imageId !== imageId);
            setRelatedImages(updatedImages);
    
            if (onImagesUpdate) {
                onImagesUpdate(updatedImages);
            }
    
            alert('이미지가 성공적으로 삭제되었습니다.');
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('이미지 삭제 중 오류가 발생했습니다.');
        }
    };




    // 단일 다운로드
    const handleDownload = async (image, e) => {
        e.stopPropagation();
        try {
            const response = await fetch(`http://localhost:5000/download/image/${image.imageId}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = image.filename || `image_${image.imageId}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            alert(`다운로드 실패: ${error.message}`);
        }
    };
    

    // 드롭다운 액션 함수
    const handleBulkEdit = (checkedIds) => {
        // 수정 로직
        setIsDropdownOpen(false);
    };

    const handleBulkInfoDownload = (checkedIds) => {
        // 정보 다운로드 로직
        setIsDropdownOpen(false);
    };

    // 다중 이미지 다운로드
    const handleBulkImageDownload = async (checkedIds) => { 
        try {
            const response = await fetch(`http://localhost:5000/download/images`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ image_ids: checkedIds })
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'images.zip'; // ZIP 파일 이름
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Bulk download failed:', error);
            alert(`다운로드 실패: ${error.message}`);
        }
    };

    const handleBulkDelete = (checkedIds) => {
        setDeletedImageIds(prev => new Set([...prev, ...checkedIds]));
        
        const updatedImages = relatedImages.filter(img => !checkedIds.includes(img.imageId));
        setRelatedImages(updatedImages);
        
        if (onImagesUpdate) {
            onImagesUpdate(updatedImages, checkedIds);
        }
        setIsDropdownOpen(false);
    };
    

    return {
        isDropdownOpen,
        showConfirmToast,
        setIsDropdownOpen,
        setShowConfirmToast,
        handleDelete,
        handleDownload,
        handleBulkEdit,
        handleBulkInfoDownload,
        handleBulkImageDownload,
        handleBulkDelete,
        handleExceptionInspection
    };
};

export default useImageActions;