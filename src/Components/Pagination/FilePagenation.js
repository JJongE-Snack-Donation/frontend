import React from "react";
import "../../Styles/Pagination/FilePagenation.css";
import { ReactComponent as PrevArrow } from '../../Assets/Imgs/etc/pre_arrow.svg';
import { ReactComponent as NextArrow } from '../../Assets/Imgs/etc/next_arrow.svg';
import { ReactComponent as FirstPageArrow } from '../../Assets/Imgs/etc/first_page_arrow.svg';
import { ReactComponent as LastPageArrow } from '../../Assets/Imgs/etc/last_page_arrow.svg';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxVisiblePages = 5; // 한 번에 보여줄 최대 페이지 수

  if (totalPages <= 1) return null; // 페이지가 1개 이하이면 표시하지 않음

  const getPageNumbers = () => {
    let pageNumbers = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination">
      {/* 첫 페이지 이동 */}
      <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
        <FirstPageArrow />
      </button>

      {/* 이전 페이지 이동 */}
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <PrevArrow />
      </button>

      {/* 페이지 숫자 버튼 */}
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={number === currentPage ? "active" : ""}
        >
          {number}
        </button>
      ))}

      {/* 다음 페이지 이동 */}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <NextArrow />
      </button>

      {/* 마지막 페이지 이동 */}
      <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
        <LastPageArrow />
      </button>
    </div>
  );
};

export default Pagination;
