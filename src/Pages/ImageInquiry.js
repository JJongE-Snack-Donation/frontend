import React, { useState } from 'react';
import NameTag from '../Components/NameTag';
import Title from '../Components/Title';
import SearchBar from '../Components/Search/SearchBar';

const ImageInquiry = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);

    return (
        <div className="wrap">
            <NameTag />
            <Title 
                title="이미지 조회"
                desc="검수 완료된 이미지 목록"
            />
        </div>
    );
}

export default ImageInquiry;