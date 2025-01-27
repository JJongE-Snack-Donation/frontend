import { useState } from 'react';

export const useImageActions = (relatedImages, setRelatedImages, onImagesUpdate) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showConfirmToast, setShowConfirmToast] = useState(false);

    const handleDelete = (imageId, e) => {
        e.stopPropagation();
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

    return {
        isDropdownOpen,
        showConfirmToast,
        setIsDropdownOpen,
        setShowConfirmToast,
        handleDelete,
        handleDownload
    };
};