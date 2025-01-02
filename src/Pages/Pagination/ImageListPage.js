import React from 'react';
import useImagePagination from './useImagePagination';
import ImageGrid from '../../Components/Pagination/ImageGrid';
import PaginationComponent from './PaginationComponent';

const ImageListPage = () => {
  const { images, totalItems, currentPage, itemsPerPage, handlePageChange } = useImagePagination();

  return (
    <div>
      <h1>이미지 목록</h1>
      <ImageGrid images={images} />
      <PaginationComponent
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default ImageListPage;
