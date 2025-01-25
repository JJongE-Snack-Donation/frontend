import React, { useState, useEffect } from 'react';
import '../Styles/Home.css';
import useImagePagination from '../Hooks/useImagePagination';
import ImageGrid from '../Components/Pagination/ImageGrid';
import PaginationComponent from '../Components/Pagination/PaginationComponent';
import ImageModal from '../Components/Search/ImageModal';
import NameTag from '../Components/NameTag';
import Title from '../Components/Title';
import SearchBar from '../Components/Search/SearchBar';

const GeneralInspection = () => {
    const { currentPage, itemsPerPage, handlePageChange } = useImagePagination();
    const [filteredResults, setFilteredResults] = useState([]); // 필터링된 결과 저장
    const [displayImages, setDisplayImages] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);

    // 검색 결과 저장
    const handleSearchClick = (results) => {
        setFilteredResults(results); // 전체 검색 결과 저장
        setTotalItems(results.length);
        handlePageChange(1); // 첫 페이지로 리셋
    };

    // 페이지 변경시 해당 페이지의 이미지만 표시
    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setDisplayImages(filteredResults.slice(startIndex, endIndex));
    }, [currentPage, filteredResults, itemsPerPage]);

    const handleImageClick = (image) => {
        setSelectedImage(image);
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
            {selectedImage && (
                <ImageModal 
                    image={selectedImage}
                    onClose={() => setSelectedImage(null)}
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