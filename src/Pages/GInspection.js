import React, { useState, useEffect } from 'react';
import '../Styles/Home.css';
import useImagePagination from '../Hooks/useImagePagination';
import ImageGrid from '../Components/Pagination/ImageGrid';
import PaginationComponent from '../Components/Pagination/PaginationComponent';
import ImageModal from '../Components/ImageModal/ImageModal';
import NameTag from '../Components/NameTag';
import Title from '../Components/Title';
import SearchBar from '../Components/Search/SearchBar';
import useSearch from '../Hooks/useSearch';


const GeneralInspection = () => {
    const { currentPage, itemsPerPage, handlePageChange } = useImagePagination();
    const [filteredResults, setFilteredResults] = useState([]); // 필터링된 결과 저장
    const [displayImages, setDisplayImages] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deletedImageIds, setDeletedImageIds] = useState(new Set());
    const { updateExceptionStatus, testImageData, setTestImageData, searchResults } = useSearch();



    const handleImagesUpdate = (updatedImages, checkedIds) => {
        updateExceptionStatus(checkedIds);  // useSearch의 함수만 사용
        
        // 필요한 경우 relatedImages 업데이트
        setFilteredResults(prev => 
            prev.map(img => ({
                ...img,
                relatedImages: updatedImages
            }))
        );
    };
    
    
    

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedImage(null); // 모달 닫을 때 선택된 이미지도 초기화
    };

    // 검색 결과 저장
    const handleSearchClick = (results) => {
        // 현재 상태(예외 처리 등)를 유지하면서 검색 결과 필터링
        const updatedResults = results.map(img => {
            // 기존 filteredResults에서 동일한 이미지 찾기
            const existingImg = filteredResults.find(f => f.imageId === img.imageId);
            return {
                ...img,
                isException: existingImg?.isException || false,
                relatedImages: img.relatedImages?.map(related => {
                    const existingRelated = existingImg?.relatedImages?.find(r => r.imageId === related.imageId);
                    return {
                        ...related,
                        isException: existingRelated?.isException || false
                    };
                })
            };
        });
    
        // 삭제된 이미지 필터링
        const filtered = updatedResults.filter(img => 
            !deletedImageIds.has(img.imageId) && 
            (!img.relatedImages || img.relatedImages.every(related => !deletedImageIds.has(related.imageId)))
        );
    
        setFilteredResults(filtered);
        setTotalItems(filtered.length);
        handlePageChange(1);
    };
    
    

    // 페이지 변경시 해당 페이지의 이미지만 표시
    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setDisplayImages(filteredResults.slice(startIndex, endIndex));
    }, [currentPage, filteredResults, itemsPerPage]);

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setIsModalOpen(true);
    };

    return (
        <div className="wrap">

            {/* 상단 헤더 영역 */}
            <NameTag />
            <Title 
                title="일반 검수"
                desc="일반 이벤트 목록"
            />

            {/* 상단 필터 영역 */}
            <SearchBar onSearch={handleSearchClick} />

            {/* 이미지 그리드 */}
            <ImageGrid images={displayImages} onImageClick={handleImageClick}/>
            {isModalOpen && selectedImage && (
                <ImageModal 
                    image={selectedImage}
                    onClose={handleClose}
                    onImagesUpdate={handleImagesUpdate}
                />
            )}


            {/* 페이지네이션 */}
            {!selectedImage && (
                <PaginationComponent
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItems}
                    onChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default GeneralInspection;