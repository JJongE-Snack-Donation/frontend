import React, { useState, useEffect } from 'react';
import '../Styles/Home.css';
import useImagePagination from '../Hooks/useImagePagination';
import ImageGrid from '../Components/Pagination/ImageGrid';
import PaginationComponent from '../Components/Pagination/PaginationComponent';
import ImageModal from '../Components/ImageModal/ImageModal';
import NameTag from '../Components/NameTag';
import Title from '../Components/Title';
import SearchBar from '../Components/Search/SearchBar';

const GeneralInspection = () => {
    const { currentPage, itemsPerPage, handlePageChange } = useImagePagination();
    const [filteredResults, setFilteredResults] = useState([]); // 필터링된 결과 저장
    const [displayImages, setDisplayImages] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deletedImageIds, setDeletedImageIds] = useState(new Set());


    const handleImagesUpdate = (updatedImages, deletedId) => {
        setDeletedImageIds(prev => new Set([...prev, deletedId]));
        setFilteredResults(prev => 
            prev.map(img => 
                img.imageId === selectedImage.imageId 
                    ? { ...img, relatedImages: updatedImages }
                    : img
            )
        );
    };
    

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedImage(null); // 모달 닫을 때 선택된 이미지도 초기화
    };

    // 검색 결과 저장
    const handleSearchClick = (results) => {
        // 삭제된 이미지를 제외한 결과만 표시
        const filteredResults = results.filter(img => 
            !deletedImageIds.has(img.imageId) && 
            (!img.relatedImages || img.relatedImages.every(related => !deletedImageIds.has(related.imageId)))
        );
        setFilteredResults(filteredResults);
        setTotalItems(filteredResults.length);
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