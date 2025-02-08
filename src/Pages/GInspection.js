import React, { useState, useEffect } from 'react';
import '../Styles/Home.css';
import ImageGrid from '../Components/Pagination/ImageGrid';
import PaginationComponent from '../Components/Pagination/PaginationComponent';
import ImageModal from '../Components/ImageModal/ImageModal';
import NameTag from '../Components/NameTag';
import Title from '../Components/Title';
import SearchBar from '../Components/Search/SearchBar';
import useSearch from '../Hooks/useSearch';

const GeneralInspection = () => {
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        searchResults,
        totalItems,
        handleSearch,
        loading,
        error
    } = useSearch();

    // 페이지 변경 핸들러
    const handlePageChange = async (pageNumber) => {
        setCurrentPage(pageNumber);
        await handleSearch(pageNumber); // API 호출로 데이터 가져오기
    };

    // 검색 핸들러 (항상 첫 번째 페이지부터 시작)
    const handleSearchSubmit = async () => {
        setCurrentPage(1);
        await handleSearch(1);
    };

    useEffect(() => {
        handleSearch(1); // 컴포넌트 마운트 시 첫 번째 페이지 데이터 로드
    }, []);

    return (
        <div className="wrap">
            <NameTag />
            <Title title="일반 검수" desc="일반 이벤트 목록" />

            {/* 검색 바 */}
            <SearchBar onSearch={handleSearchSubmit} />

            {/* 에러 메시지 */}
            {error && <div className="error-message">{error}</div>}

            {/* 로딩 상태 */}
            {loading ? (
                <div className="loading-indicator">로딩 중...</div>
            ) : (
                <>
                    {/* 이미지 그리드 */}
                    <ImageGrid 
                        images={searchResults} 
                        onImageClick={(image) => {
                            setSelectedImage(image);
                            setIsModalOpen(true);
                        }}
                    />

                    {/* 페이지네이션 */}
                    {!isModalOpen && (
                        <PaginationComponent
                            currentPage={currentPage}
                            itemsPerPage={12}
                            totalItems={totalItems}
                            onChange={handlePageChange}
                        />
                    )}
                </>
            )}

            {/* 이미지 모달 */}
            {isModalOpen && selectedImage && (
                <ImageModal
                    image={selectedImage}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default GeneralInspection;
