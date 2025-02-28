import React from 'react';
import '../../Styles/SearchBar.css'
import Legend from './Legend';
import FilterItem from './FilterItem';
import DatePicker from "react-datepicker";
import "../../Styles/DatePicker.css";
import { ko } from "date-fns/locale";

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

    // 날짜 변경 핸들러
    const handleDateChange = (date) => {
        const formattedDate = date ? date.toISOString().split('T')[0] : '';
        updateSearchParam('date', formattedDate);
    };

    return (
        <div className="search-filter">
            <FilterItem
                label="프로젝트 이름"
                value={searchParams.projectName || ''}
                onChange={(e) => updateSearchParam('projectName', e.target.value)}
                options={[{ value: "", label: "ALL" }, ...projectOptions]}
            />

        <div className="filter-item">
                <div className="filter-label">날짜</div>
                <DatePicker
                    selected={searchParams.date ? new Date(searchParams.date) : null}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="날짜 선택"
                    locale={ko}
                    isClearable
                    showYearDropdown
                    yearDropdownItemNumber={15}
                    showMonthDropdown
                    popperPlacement="bottom-start"
                    popperModifiers={{
                        preventOverflow: {
                            enabled: true,
                            escapeWithReference: false,
                            boundariesElement: 'viewport'
                        }
                    }}
                />
            </div>

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
