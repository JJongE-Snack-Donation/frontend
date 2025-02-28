import React, { useState } from 'react';
import '../Styles/Home.css';
import ImageGrid from '../Components/Pagination/ImageGrid';
import PaginationComponent from '../Components/Pagination/PaginationComponent';
import ImageModal from '../Components/ImageModal/ImageModal';
import NameTag from '../Components/NameTag';
import Title from '../Components/Title';
import SearchBar from '../Components/Search/SearchBar';
import useSearch from '../Hooks/useSearch';
import useImageStore from '../Hooks/useImageStore';

const GeneralInspection = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const fetchGroupImages = useImageStore(state => state.fetchGroupImages);

    const selectedPage = 'normal'; 

    
    const {
        groupedImages,
        totalItems,
        currentPage,
        handleSearch,
        loading,
        error,
        options,
        searchParams,
        updateSearchParam
    } = useSearch(selectedPage);

    const handlePageChange = async (pageNumber) => {
        await handleSearch(pageNumber);
    };

    const handleSearchSubmit = async () => {
        await handleSearch(1);
    };

    const handleGroupClick = async (group) => {
        setSelectedGroup(group);
        await fetchGroupImages(group.evtnum);
        setIsModalOpen(true);
    };

    return (
        <div className="wrap">
            <NameTag />
            <Title title="일반 검수" desc="일반 이벤트 목록" />

            <SearchBar 
                onSearch={handleSearchSubmit}
                options={options}
                searchParams={searchParams}
                updateSearchParam={updateSearchParam}
                handleSearch={handleSearch}
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
};

export default GeneralInspection;
