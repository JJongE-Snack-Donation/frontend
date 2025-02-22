import { useState } from 'react';
import useImageStore from './useImageStore';

const useImageActions = () => {
    const { relatedImages, setRelatedImages, deleteImage, updateExceptionStatus} = useImageStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showConfirmToast, setShowConfirmToast] = useState(false);
    const [checkedImages, setCheckedImages] = useState([]);
    const { deleteMultipleImages } = useImageStore();
    const [checkedBoxes, setCheckedBoxes] = useState([]);

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0MDA2MTY3NSwianRpIjoiYWU5NmM5MGMtNmRmZC00MDNhLThiMzAtNjU3NWIxM2ViMzU2IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImFkbWluIiwibmJmIjoxNzQwMDYxNjc1LCJjc3JmIjoiNDBkMWZkODItNGVlMS00ODQxLTlhYTctMjFmMDRjNjIzY2FjIiwiZXhwIjoxNzQwMTQ4MDc1fQ.YoOThZi5ck2H1QRnot3w_bttIEH-vRGCbXObOwPhzCY";

    // 예외 상태 processed로 처리
    const handleExceptionInspection = async (checkedIds) => {
        for (const imageId of checkedIds) {
            try {
                const response = await fetch(`http://localhost:5000/exception/${imageId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status: "processed",  // 'exception_status'에서 'status'로 변경
                        comment: "Processed via exception inspection"
                    })
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                console.log("Update successful:", result);
            } catch (error) {
                console.error("Error updating image status:", error);
            }
        }
    
        updateExceptionStatus(checkedIds, "processed");
        setShowConfirmToast(false);
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
    const handleDelete = async (imageId) => {
        try {
          const response = await fetch(`http://localhost:5000/classified-images/${imageId}`, {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '이미지 삭제 실패');
          }
      
          // 서버 응답이 성공적이면 로컬 상태 업데이트
          deleteImage(imageId);
          alert('이미지가 성공적으로 삭제되었습니다.');
        } catch (error) {
          console.error('삭제 중 오류:', error);
          alert(`이미지 삭제 중 오류가 발생했습니다: ${error.message}`);
        }
      };
      
      




    // 단일 다운로드
    const handleDownload = async (imageId) => {
        try {
          const response = await fetch(`http://localhost:5000/download/image/${imageId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'image.jpg';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          } else {
            console.error('Download failed');
          }
        } catch (error) {
          console.error('Error downloading image:', error);
        }
      };
      
    

    // // 드롭다운 액션 함수
    // const handleBulkEdit = (checkedIds) => {
    //     // 수정 로직
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
          const response = await fetch(`http://localhost:5000/images/bulk-delete`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ image_ids: checkedIds })
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '이미지 삭제 실패');
          }
      
          const result = await response.json();
          
          // 상태 업데이트
          deleteMultipleImages(checkedIds);
          setCheckedBoxes([]);
          
          alert(result.message || '선택한 이미지들이 성공적으로 삭제되었습니다.');
        } catch (error) {
          console.error('Bulk delete failed:', error);
          alert(`이미지 삭제 중 오류가 발생했습니다: ${error.message}`);
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
        setCheckedImages,
        checkedBoxes,
        setCheckedBoxes
    };
};

export default useImageActions;