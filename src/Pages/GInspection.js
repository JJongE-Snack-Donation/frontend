import React, { useState, useEffect } from 'react';
import '../Styles/Home.css';
import useImagePagination from '../Hooks/useImagePagination';
import ImageGrid from '../Components/Pagination/ImageGrid';
import PaginationComponent from '../Components/Pagination/PaginationComponent';
import NameTag from '../Components/NameTag';
import Title from '../Components/Title';
import SearchBar from '../Components/Search/SearchBar';
import useSearch from '../Hooks/useSearch';

const GeneralInspection = () => {
    const { images, totalItems, currentPage, itemsPerPage, handlePageChange } = useImagePagination();
    const { searchResults, handleSearch } = useSearch();
    const [displayImages, setDisplayImages] = useState(images);

    useEffect(() => {
        setDisplayImages(searchResults);
    }, [searchResults]);

    return (
        <div className="wrap">

            {/* 상단 헤더 영역 */}
            <NameTag />
            <Title 
                title="일반 검수"
                desc="일반 이벤트 목록"
            />

            {/* 상단 필터 영역 */}
            <SearchBar onSearch={setDisplayImages} />

            {/* 이미지 그리드 */}
            <ImageGrid images={displayImages} />

            {/* 페이지네이션 */}
            <PaginationComponent
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                onChange={handlePageChange}
            />
        </div>
    );
};

export default GeneralInspection;