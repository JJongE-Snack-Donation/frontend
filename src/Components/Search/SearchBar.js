import React from 'react';
import '../../Styles/SearchBar.css'
import Bookmark from '../Bookmark';
import Legend from './Legend';
import FilterItem from './FilterItem';
import useSearch from '../../Hooks/useSearch';

const SearchBar = ({ onSearch }) =>{
    // 상태 관리
    const {
        projectName, setProjectName,
        date, setDate,
        cameraSerial, setCameraSerial,
        cameraLabel, setCameraLabel,
        species, setSpecies,
        handleSearch,
        projectOptions,
        speciesOptions,
        cameraSerialOptions,
        cameraLabelOptions,
        deletedImageIds
    } = useSearch();

    // 검색 버튼 클릭 함수
    const handleSearchClick = () => {
        console.log("DeletedImageIds in SearchBar before search:", Array.from(deletedImageIds));
        const results = handleSearch();
        console.log("Search results:", results);
        onSearch(results);
    };

    return (
        <div className="search-filter">
            <div className="filter-container">
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
                    value={cameraSerial}
                    onChange={(e) => setCameraSerial(e.target.value)}
                    options={[{ value: "all", label: "ALL" }, ...cameraSerialOptions]}
                />

                <FilterItem
                    label="카메라 라벨"
                    value={cameraLabel}
                    onChange={(e) => setCameraLabel(e.target.value)}
                    options={[{ value: "all", label: "ALL" }, ...cameraLabelOptions]}
                />

                <FilterItem
                    label="종명"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    options={[{ value: "all", label: "ALL" }, ...speciesOptions]}
                />

                <div className='filter-item'>
                        <div className='filter-label'>즐겨찾기</div>
                        <Bookmark />
                </div>
                    <button className="search-button" onClick={handleSearchClick}>검색</button>
                <div>
                    <Legend />
                </div>
            </div>
        </div>
    );
};

export default SearchBar;