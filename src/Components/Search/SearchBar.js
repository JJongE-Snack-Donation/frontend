import React from 'react';
import '../../Styles/SearchBar.css'
import Legend from './Legend';
import FilterItem from './FilterItem';

const SearchBar = ({ 
    onSearch, 
    options = {},
    searchParams = {},
    updateSearchParam,
    handleSearch
}) => {
    const {
        projectOptions = [],
        speciesOptions = [],
        cameraSerialOptions = [],
        cameraLabelOptions = []
    } = options;

    // 검색 버튼 클릭 함수
    const handleSearchClick = () => {
        if (typeof handleSearch === 'function') {
            handleSearch(1);
        }
        if (typeof onSearch === 'function') {
            onSearch();
        }
    };

    return (
        <div className="search-filter">
            <FilterItem
                label="프로젝트 이름"
                value={searchParams.projectName || ''}
                onChange={(e) => updateSearchParam('projectName', e.target.value)}
                options={[{ value: "", label: "ALL" }, ...projectOptions]}
            />

            <FilterItem
                label="날짜"
                value={searchParams.date || ''}
                onChange={(e) => updateSearchParam('date', e.target.value)}
                options={[{ value: "", label: "ALL" }]}
            />

            <FilterItem
                label="카메라 시리얼"
                value={searchParams.serialNumber || ''}
                onChange={(e) => updateSearchParam('serialNumber', e.target.value)}
                options={[{ value: "", label: "ALL" }, ...cameraSerialOptions]}
            />

            <FilterItem
                label="종명"
                value={searchParams.species || ''}
                onChange={(e) => updateSearchParam('species', e.target.value)}
                options={[{ value: "", label: "ALL" }, ...speciesOptions]}
            />
            <button className="search-button" onClick={handleSearchClick}>검색</button>
            <Legend />
        </div>
    );
};
export default SearchBar;
