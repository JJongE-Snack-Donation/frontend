import React, { useState } from "react";
import "../../Styles/Pagination/FilePagenation.css";

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = [];
  const maxVisiblePages = 5; // 한 번에 보여줄 최대 페이지 수

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pageNumbers.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pageNumbers.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
  }

  return (
    <div className="pagination">
      {/* 이전 페이지 */}
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

      {/* 다음 페이지 */}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        »
      </button>
    </div>
  );
};

export default Pagination;
