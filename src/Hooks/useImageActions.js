import { useState } from 'react';

const useImageActions = (relatedImages, setRelatedImages, onImagesUpdate, onDelete, setDeletedImageIds) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showConfirmToast, setShowConfirmToast] = useState(false);

    const handleDelete = (imageId, e) => {
        if (e) {
            e.stopPropagation();
        }
        // 단일 이미지 삭제 시에도 deletedImageIds 업데이트
        setDeletedImageIds(prev => new Set([...prev, imageId]));
        
        const updatedImages = relatedImages.filter(img => img.imageId !== imageId);
        setRelatedImages(updatedImages);
        if (onImagesUpdate) {
            onImagesUpdate(updatedImages);
        }
    };

    const handleDownload = async (image, e) => {
        e.stopPropagation();
        try {
            const response = await fetch(image.FilePath);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = image.FileName || 'image.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
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

    const handleBulkImageDownload = (checkedIds) => {
        // 선택된 모든 이미지 다운로드
        checkedIds.forEach(id => {
            const image = relatedImages.find(img => img.imageId === id);
            if (image) {
                handleDownload(image, { stopPropagation: () => {} });
            }
        });
        setIsDropdownOpen(false);
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
        handleBulkDelete
    };
};

export default useImageActions;