import React from 'react';
import '../Styles/Home.css';
import NameTag from '../Components/NameTag';
import Title from '../Components/Title';
import SearchBar from '../Components/Search/SearchBar';

const ExceptionInspection = () => {
    return (
        <div className="wrap">
            {/* 상단 헤더 영역 */}
            <NameTag />
            <Title 
                title="예외 검수"
                desc="예외 이벤트 목록"
            />

            {/* 상단 필터 영역 */}
            <SearchBar />
        </div>
    );
}

export default ExceptionInspection;