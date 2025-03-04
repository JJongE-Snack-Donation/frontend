import React, { useState } from 'react';
import '../Styles/Home.css';
import ImageModal from '../Components/ImageModal/ImageModal';
import ImageGrid from '../Components/Pagination/ImageGrid';
import PaginationComponent from '../Components/Pagination/PaginationComponent';
import NameTag from '../Components/NameTag';
import Title from '../Components/Title';
import SearchBar from '../Components/Search/SearchBar';
import useSearch from '../Hooks/useSearch';
import useImageStore from '../Hooks/useImageStore';

const ImageInquiry = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const fetchCompletedGroupImages = useImageStore(state => state.fetchCompletedGroupImages);

    const selectedPage = 'completed'; // 검수 완료된 이미지 조회

    const {
        groupedImages,
        totalItems,
        currentPage,
        handleCompletedSearch,
        loading,
        error,
        options,
        searchParams,
        updateSearchParam
    } = useSearch(selectedPage);

    const handlePageChange = async (pageNumber) => {
        await handleCompletedSearch(pageNumber);
    };

    const handleSearchSubmit = async () => {
        await handleCompletedSearch(1);
    };

    const handleGroupClick = async (group) => {
        setSelectedGroup(group);
        await fetchCompletedGroupImages(group.evtnum);
        setIsModalOpen(true);
    };

    return (
        <div className="wrap">
            <NameTag />
            <Title 
                title="이미지 조회"
                desc="검수 완료된 이미지 목록"
            />

            {/* 검색 바 */}
            <SearchBar 
                onSearch={handleSearchSubmit}
                options={options}
                searchParams={searchParams}
                updateSearchParam={updateSearchParam}
                handleSearch={handleCompletedSearch}
            />

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading-indicator">로딩 중...</div>
            ) : (
                <>
                    {/* 이미지 목록 */}
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

            {/* 이미지 모달 */}
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

export default ImageInquiry;
