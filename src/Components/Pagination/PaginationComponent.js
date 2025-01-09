import React from 'react';
import Pagination from 'react-js-pagination';
import '../../Styles/Pagination/Pagination.css';
import { ReactComponent as PrevArrow } from '../../Assets/Imgs/etc/pre_arrow.svg';
import { ReactComponent as NextArrow } from '../../Assets/Imgs/etc/next_arrow.svg';
import { ReactComponent as FirstPageArrow } from '../../Assets/Imgs/etc/first_page_arrow.svg';
import { ReactComponent as LastPageArrow } from '../../Assets/Imgs/etc/last_page_arrow.svg';

const PaginationComponent = ({ currentPage, itemsPerPage, totalItems, onChange }) => {
  
  const lastPage = Math.ceil(totalItems / itemsPerPage);

  const handleFirstPageArrowClick = () => {
    if (currentPage !== 1) {
      onChange(1);
    }
  }

  const handlePrevPageArrowClick = () => {
    if (currentPage > 1) {
      onChange(currentPage - 1);
    }
  };

  const handleNextPageArrowClick = () => {
    if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
      onChange(currentPage + 1);
    }
  };

  const handleLastPageArrowClick = () => {
    if (currentPage !== lastPage) {
      onChange(lastPage);
    }
  }

  return (
    <div className="pagination-wrapper">
      <button onClick={handleFirstPageArrowClick} disabled={currentPage === 1} className="arrow-button">
        <FirstPageArrow className="arrow_icon" />
      </button>
      <button onClick={handlePrevPageArrowClick} disabled={currentPage === 1} className="arrow-button">
        <PrevArrow className="arrow_icon" />
      </button>
      <Pagination
        activePage={currentPage}
        itemsCountPerPage={itemsPerPage}
        totalItemsCount={totalItems}
        pageRangeDisplayed={5} //페이지 표시 
        onChange={onChange}
        itemClass="page-item" //페이지네이션의 각 아이템을 감싸는 컨테이너에 적용되는 클래스
        linkClass="page-link" //페이지네이션의 각 클릭 가능한 요소에 적용되는 클래스
        
        //라이브러리에 기본 제공되는 화살표 제거
        // prevPageText={null}
        // nextPageText={null}
        // firstPageText={null}  
        // lastPageText={null}   
      />
      <button onClick={handleNextPageArrowClick} disabled={currentPage === Math.ceil(totalItems / itemsPerPage)} className="arrow-button">
        <NextArrow className="arrow_icon" />
      </button>
      <button onClick={handleLastPageArrowClick} disabled={currentPage === lastPage} className="arrow-button">
        <LastPageArrow className="arrow_icon" />
      </button>

    </div>
  );
};

export default PaginationComponent;

