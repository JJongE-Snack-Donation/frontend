import React from "react";
import "../../Styles/Pagination/FilePagenation.css";

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxVisiblePages = 5; // 한 번에 보여줄 최대 페이지 수

  if (totalPages <= 1) return null; // 페이지가 1개 이하이면 표시하지 않음

  const getPageNumbers = () => {
    let pageNumbers = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      // 전체 페이지 수가 maxVisiblePages 이하일 때, 모든 페이지 표시
      pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= halfVisible + 1) {
        // 첫 부분 (1~maxVisiblePages)
        pageNumbers = [...Array(maxVisiblePages - 1).keys()].map((i) => i + 1);
        if (!pageNumbers.includes(totalPages - 1)) pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - halfVisible) {
        // 마지막 부분 (totalPages-maxVisiblePages ~ totalPages)
        pageNumbers = [1, "..."];
        const start = totalPages - (maxVisiblePages - 2);
        pageNumbers.push(...Array.from({ length: maxVisiblePages - 2 }, (_, i) => start + i));
        if (!pageNumbers.includes(totalPages)) pageNumbers.push(totalPages);
      } else {
        // 중간 부분 (현재 페이지를 중심으로 표시)
        pageNumbers = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination">
      {/* 이전 페이지 버튼 */}
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        «
      </button>

      {pageNumbers.map((number, index) =>
        number === "..." ? (
          <span key={index} className="dots">...</span>
        ) : (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={number === currentPage ? "active" : ""}
          >
            {number}
          </button>
        )
      )}

      {/* 다음 페이지 버튼 */}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        »
      </button>
    </div>
  );
};

export default Pagination;