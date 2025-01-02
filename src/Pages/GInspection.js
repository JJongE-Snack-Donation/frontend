import React from 'react';
import '../Styles/Home.css';
import useImagePagination from '../Hooks/useImagePagination';
import ImageGrid from '../Components/Pagination/ImageGrid';
import PaginationComponent from '../Components/Pagination/PaginationComponent';

const GeneralInspection = () => {
    const { images, totalItems, currentPage, itemsPerPage, handlePageChange } = useImagePagination();

    return (
        <div className="wrap">
            {/* 상단 필터 영역 */}
            

            {/* 이미지 그리드 */}
            <ImageGrid images={images} />

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