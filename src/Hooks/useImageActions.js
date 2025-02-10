import { useState } from 'react';
import useImageStore from './useImageStore';

const useImageActions = () => {
    const { relatedImages, setRelatedImages, deleteImage, updateExceptionStatus} = useImageStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showConfirmToast, setShowConfirmToast] = useState(false);
    const [checkedImages, setCheckedImages] = useState([]);

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTczOTE2OTUxNiwianRpIjoiMTc2YThkMzUtMGQ1My00MTdkLThlM2ItYjlkMDFkOGZhYTZmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImFkbWluIiwibmJmIjoxNzM5MTY5NTE2LCJjc3JmIjoiOWNkYTY1MzYtYjBjZC00MjhiLWExZTEtNzVhNGE4MzA0NmU4IiwiZXhwIjoxNzM5MjU1OTE2fQ.rWkkf8myjmzmZ6rY2MPLwBqBNGJKdZjUQh-uTRz3fJo";

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
            } catch (error) {
                console.error("Error updating image status:", error);
            }
        }

        updateExceptionStatus(checkedIds, "processed");
        setShowConfirmToast(false);

        //const updatedImages = relatedImages.map(img => ({
        //    ...img,
        //    exception_status: checkedIds.includes(img.imageId) ? "processed" : img.exception_status
        //}));
//
        //setRelatedImages(updatedImages);
        //
        //if (onImagesUpdate) {
        //    onImagesUpdate(updatedImages, checkedIds);
        //}
//
        //setShowConfirmToast(false);
    };


    // 검수 확정 핸들러 
    const handleInspectionComplete = async (projectName, species) => {
        try {
            const imageIds = relatedImages
                .filter(img => img.project_name === projectName && img.species === species)
                .map(img => img.imageId);
    
            const response = await fetch('http://localhost:5000/classification/batch', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    image_ids: imageIds,
                    classification: {
                        category: species,
                        confidence: 1.0 // 검수 확정이므로 최대 신뢰도로 설정
                    }
                })
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const result = await response.json();
    
            setRelatedImages((prevImages) =>
                prevImages.map((img) =>
                    imageIds.includes(img.imageId)
                        ? { ...img, is_classified: true }
                        : img
                )
            );
    
            alert(`${result.data.modified_count}개의 이미지가 검수 확정되었습니다.`);
        } catch (error) {
            console.error("Error during inspection completion:", error);
            alert("검수 확정 중 오류가 발생했습니다.");
        }
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
                
            
                alert(`이미지 삭제 실패: ${errorData.message}`);
                return;
            }
    
            // 성공적으로 삭제된 경우 Zustand 스토어 업데이트
            deleteImage(imageId);
            alert('이미지가 성공적으로 삭제되었습니다.');
        } catch (error) {
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
            alert(`다운로드 실패: ${error.message}`);
        }
    };
    

    // // 드롭다운 액션 함수
    // const handleBulkEdit = (checkedIds) => {
    //     // 수정 로직
    //     setIsDropdownOpen(false);
    // };

    // const handleBulkInfoDownload = (checkedIds) => {
    //     // 정보 다운로드 로직
    //     setIsDropdownOpen(false);
    // };

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

    // 다중 이미지 삭제 
    const handleBulkImageDelete = async (checkedIds) => {
    
        try {
            // DELETE 요청 보내기
            const response = await fetch(`http://localhost:5000/images/bulk-delete`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ image_ids: checkedIds })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                alert(`이미지 삭제 실패: ${errorData.message}`);
                return;
            }
    
            const result = await response.json();
            const updatedImages = relatedImages.filter(img => !checkedIds.includes(img.imageId));
            setRelatedImages(updatedImages);
            setCheckedImages([]);  // 이제 이 함수가 정의되어 있어야 합니다.
            alert(result.message || '선택한 이미지들이 성공적으로 삭제되었습니다.');

    
        } catch (error) {
            console.error('Bulk delete failed:', error);
            alert('이미지 삭제 중 오류가 발생했습니다.');
        }
    };
    

    return {
        relatedImages,
        isDropdownOpen,
        showConfirmToast,
        setIsDropdownOpen,
        setShowConfirmToast,
        handleDelete,
        handleDownload,
        handleBulkImageDownload,
        handleExceptionInspection,
        handleInspectionComplete,
        handleBulkImageDelete,
        checkedImages,
        setCheckedImages
    };
};

export default useImageActions;