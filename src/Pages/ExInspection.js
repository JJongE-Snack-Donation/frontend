import React, { useState } from 'react';
import '../Styles/Home.css';
import ImageGrid from '../Components/Pagination/ImageGrid';
import NameTag from '../Components/NameTag';
import Title from '../Components/Title';
import SearchBar from '../Components/Search/SearchBar';
import useImageStore from '../Hooks/useImageStore';
import useSearch from '../Hooks/useSearch';
import PaginationComponent from '../Components/Pagination/PaginationComponent';

const ExceptionInspection = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const fetchGroupImages = useImageStore(state => state.fetchGroupImages);

    const {
        groupedImages,
        totalItems,
        currentPage,
        loading,
        error,
        options,
        searchParams,
        updateSearchParam,
        handleExceptionSearch
    } = useSearch('exception');

    const handlePageChange = async (pageNumber) => {
        await handleExceptionSearch(pageNumber);
    };
    
    const handleSearchSubmit = async () => {
        await handleExceptionSearch(1);
    };
    

    const handleGroupClick = async (group) => {
        setSelectedGroup(group);
        await fetchGroupImages(group.evtnum);
        setIsModalOpen(true);
    };

    return (
        <div className="wrap">
            {/* 상단 헤더 영역 */}
            <NameTag />
            <Title 
                title="예외 검수"
                desc="예외 이벤트 목록"
            />

            {/* 상단 필터 영역 */}
            <SearchBar 
                onSearch={handleSearchSubmit}
                options={options}
                searchParams={searchParams}
                updateSearchParam={updateSearchParam}
                handleExceptionSearch={handleExceptionSearch}
            />

            
        {error && <div className="error-message">{error}</div>}

        {loading ? (
                <div className="loading-indicator">로딩 중...</div>
            ) : (
                <>
                    <ImageGrid 
                        groups={groupedImages} 
                        onGroupClick={handleGroupClick}
                    />

                    {!isModalOpen && (
                        <PaginationComponent
                            currentPage={currentPage}
                            itemsPerPage={100}
                            totalItems={totalItems}
                            onChange={handlePageChange}
                        />
                    )}
                </>
            )}




        </div>
    );
}

export default ExceptionInspection;