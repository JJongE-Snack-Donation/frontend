import React from 'react';
import Pagination from 'react-js-pagination';
import '../../Styles/Pagination/Pagination.css';
import { ReactComponent as PrevArrow } from '../../Assets/Imgs/etc/pre_arrow.svg';
import { ReactComponent as NextArrow } from '../../Assets/Imgs/etc/next_arrow.svg';
import { ReactComponent as FirstPageArrow } from '../../Assets/Imgs/etc/first_page_arrow.svg';
import { ReactComponent as LastPageArrow } from '../../Assets/Imgs/etc/last_page_arrow.svg';

const PaginationComponent = ({ currentPage, itemsPerPage, totalItems, onChange }) => (
  <Pagination
    activePage={currentPage}
    itemsCountPerPage={itemsPerPage}
    totalItemsCount={totalItems}
    pageRangeDisplayed={5}
    firstPageText={<FirstPageArrow className="arrow_icon" />}
    prevPageText={<PrevArrow className="arrow_icon" />}
    nextPageText={<NextArrow className="arrow_icon" />}
    lastPageText={<LastPageArrow className="arrow_icon" />}
    onChange={onChange}
    itemClass="page-item"
    linkClass="page-link"
  />
);

export default PaginationComponent;