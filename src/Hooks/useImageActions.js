import { useState } from 'react';
import useImageStore from './useImageStore';
import api from '../Api';

const useImageActions = () => {
    const { relatedImages, setRelatedImages, deleteImage, updateExceptionStatus} = useImageStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showConfirmToast, setShowConfirmToast] = useState(false);
    const [checkedImages, setCheckedImages] = useState([]);
    const { deleteMultipleImages } = useImageStore();
    const [checkedBoxes, setCheckedBoxes] = useState([]);

    // 예외 상태 processed로 처리
    const handleExceptionInspection = async (checkedIds) => {
      for (const imageId of checkedIds) {
          try {
              const response = await api.put(`/exception/${imageId}/status`, 
                  {
                      status: "processed",
                      comment: "Processed via exception inspection"
                  },
                  {
                      headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${localStorage.getItem("token")}`
                      }
                  }
              );
  
              console.log("Update successful:", response.data);
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
    
            const response = await api.post('/classification/batch', {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
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
    



    // 단일 이미지 삭제(일반 검수)
    const handleDelete = async (imageId) => {
      try {
        const response = await api.delete(`/classified-images/${imageId}`, {
          headers: {
            'Accept': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
    
        deleteImage(imageId);
        alert('이미지가 성공적으로 삭제되었습니다.');
      } catch (error) {
        console.error('삭제 중 오류:', error);
    
        if (error.response) {
          if (error.response.status === 404) {
            deleteImage(imageId);
            alert('이미지가 이미 삭제되었거나 존재하지 않습니다.');
          } else if (error.response.status === 410) {
            deleteImage(imageId);
            alert('이미지가 이미 영구적으로 삭제되었습니다.');
          } else {
            alert(`이미지 삭제 중 오류가 발생했습니다: ${error.response.data.message || '알 수 없는 오류'}`);
          }
        } else {
          alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
        }
      }
    
      // 삭제 후 리소스 존재 여부 확인
      try {
        await api.get(`/classified-images/${imageId}`);
      } catch (checkError) {
        if (checkError.response && checkError.response.status === 404) {
          deleteImage(imageId);
          alert('이미지가 성공적으로 삭제되었음을 확인했습니다.');
        }
      }
    };
    
      
    // 단일 이미지 삭제(예외 검수)
      const handleExceptionDelete = async (imageId) => {
        try {
          const response = await api.delete(`/unclassified-images/${imageId}`, {
            headers: {
              'Accept': 'application/json',
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '이미지 삭제 실패');
          }
      
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
        const response = await api.get(`/download/image/${imageId}`, {
          responseType: 'blob', 
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
    
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `image_${imageId}.jpg`; 
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Error downloading image:', error);
    
        if (error.response) {
          if (error.response.status === 401) {
            // 401 Unauthorized 에러 처리
            try {
              const newToken = await refreshToken();
              if (newToken) {
                localStorage.setItem("token", newToken);
                return handleDownload(imageId);
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              alert('인증이 만료되었습니다. 다시 로그인해주세요.');
              return;
            }
          } else {
            alert(`다운로드 실패: ${error.response.data.message || '알 수 없는 오류가 발생했습니다.'}`);
          }
        } else if (error.request) {
          alert('서버에서 응답이 없습니다. 네트워크 연결을 확인해주세요.');
        } else {
          alert(`요청 중 오류가 발생했습니다: ${error.message}`);
        }
      }
    };
    
    const refreshToken = async () => {
      // 토큰 갱신 로직 구현
      // 예: const response = await api.post('/refresh-token');
      // return response.data.newToken;
    };
    
      
    

    // 일반 검수 다중 이미지 정보 수정 
    const handleBulkEdit = async (checkedIds, updates) => {
      try {
          const response = await api.post('/inspection/normal/bulk-update', {
            image_ids: checkedIds,
            updates: updates
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

          if (response.status === 200) {
              const updatedImages = relatedImages.map(img => 
                  checkedIds.includes(img._id) ? { ...img, ...updates } : img
              );
              setRelatedImages(updatedImages);

              setShowConfirmToast(true);
              setTimeout(() => setShowConfirmToast(false), 3000);
          }
      } catch (error) {
          console.error('Bulk update failed:', error);
      }
      setIsDropdownOpen(false);
  };


    // 다중 이미지 다운로드
    const handleBulkImageDownload = async (checkedIds) => { 
      try {
          const response = await api.post('/download/images', 
              { image_ids: checkedIds },
              {
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem("token")}`
                  },
                  responseType: 'blob'
              }
          );
  
          const blob = new Blob([response.data], { type: response.headers['content-type'] });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'images.zip';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
      } catch (error) {
          console.error('Bulk download failed:', error);
          if (error.response && error.response.status === 401) {
              alert('Authentication failed. Please log in again.');
          } else {
              alert(`Download failed: ${error.message}`);
          }
      }
  };
  

    // 다중 이미지 삭제 
    const handleBulkImageDelete = async (checkedIds) => {
      try {
        const response = await api.post('/images/bulk-delete', 
          { image_ids: checkedIds },
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        
        deleteMultipleImages(checkedIds);
        setCheckedBoxes([]);
        
        alert(response.data.message || '선택한 이미지들이 성공적으로 삭제되었습니다.');
      } catch (error) {
        console.error('Bulk delete failed:', error);
        if (error.response && error.response.status === 401) {
          alert('인증에 실패했습니다. 다시 로그인해주세요.');
        } else {
          alert(`이미지 삭제 중 오류가 발생했습니다: ${error.response?.data?.message || error.message}`);
        }
      }
    };
    

    return {
        relatedImages,
        isDropdownOpen,
        showConfirmToast,
        setIsDropdownOpen,
        setShowConfirmToast,
        handleDelete,
        handleExceptionDelete,
        handleDownload,
        handleBulkImageDownload,
        handleExceptionInspection,
        handleInspectionComplete,
        handleBulkImageDelete,
        checkedImages,
        setCheckedImages,
        checkedBoxes,
        setCheckedBoxes,
        handleBulkEdit
    };
};

export default useImageActions;