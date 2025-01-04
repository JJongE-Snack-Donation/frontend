import React from 'react';
import '../Styles/SearchBar.css'
import Bookmark from './Bookmark';
import Legend from './Legend';
const SearchBar = () => {
  return (
      <div className="search-filter">
          <div className="filter-container">
              <div className="filter-item">
                  <div className="filter-label">프로젝트 이름</div>
                  <select className="filter-select">
                      <option value="">테스트1</option>
                  </select>
              </div>

              <div className="filter-item">
                  <div className="filter-label">날짜</div>
                  <select className="filter-select">
                      <option value="all">ALL</option>
                  </select>
              </div>

              <div className="filter-item">
                  <div className="filter-label">카메라 시리얼</div>
                  <select className="filter-select">
                      <option value="all">ALL</option>
                  </select>
              </div>

              <div className="filter-item">
                  <div className="filter-label">카메라 라벨</div>
                  <select className="filter-select">
                      <option value="all">ALL</option>
                  </select>
              </div>

              <div className="filter-item">
                  <div className="filter-label">종명</div>
                  <select className="filter-select">
                      <option value="">ALL</option>
                      <option value="wildboar">멧돼지</option>
                      <option value="waterdeer">고라니</option>
                      <option value="raccoondog">너구리</option>
                  </select>
              </div>

              <div className='filter-item'>
                    <div className='filter-label'>즐겨찾기</div>
                    <Bookmark />
              </div>
              <button className="search-button">검색</button>
              <div>
                <Legend />
              </div>
          </div>
      </div>
  );
};

export default SearchBar;