import React from 'react';
import '../../Styles/SearchBar.css'
import Bookmark from '../Bookmark';
import Legend from './Legend';
import FilterItem from './FilterItem';

const SearchBar = ({ 
    onSearch, 
    projectName, setProjectName,
    date, setDate,
    serialNumber, setSerialNumber,
    species, setSpecies,
    options = {},
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
            handleSearch();
        }
        if (typeof onSearch === 'function') {
            onSearch();
        }
    };
    

    return (
        <div className="search-filter">
                <FilterItem
                    label="프로젝트 이름"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    options={[{ value: "all", label: "ALL" }, ...projectOptions]}
                />

                <FilterItem
                    label="날짜"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    options={[{ value: "all", label: "ALL" }]}
                />

                <FilterItem
                    label="카메라 시리얼"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    options={[{ value: "all", label: "ALL" }, ...cameraSerialOptions]}
                />

                <FilterItem
                    label="종명"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    options={[{ value: "all", label: "ALL" }, ...speciesOptions]}
                />
                <button className="search-button" onClick={handleSearchClick}>검색</button>
                <Legend />
        </div>
    );
};

export default SearchBar;
