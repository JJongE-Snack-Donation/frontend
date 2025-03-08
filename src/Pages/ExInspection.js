import React, { useState } from 'react';
import '../Styles/Home.css';
import ImageModal from '../Components/ImageModal/ImageModal';
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
    const fetchExceptionGroupImages = useImageStore(state => state.fetchExceptionGroupImages);
    
    const selectedPage = 'exception'; 

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
    } = useSearch(selectedPage);

    const handlePageChange = async (pageNumber) => {
        await handleExceptionSearch(pageNumber);
    };
    
    const handleSearchSubmit = async () => {
        await handleExceptionSearch(1);
    };
    

    const handleGroupClick = async (group) => {
        setSelectedGroup(group);
        await fetchExceptionGroupImages(group.evtnum, group.projectId);
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
                            itemsPerPage={10}
                            totalItems={totalItems}
                            onChange={handlePageChange}
                        />
                    )}
                </>
            )}

            {isModalOpen && selectedGroup && (
            <ImageModal
                onClose={() => setIsModalOpen(false)}
                groupData={selectedGroup}
                selectedPage={selectedPage} 
            />
            )}


        </div>
    );
}

export default ExceptionInspection;