import React from 'react';

// 모달창에서 선택한 이미지 출력
const ImageViewer = ({ image }) => {
    if (!image || !(image.imageUrl || image.thumbnail)) {
        return (
            <div className="modal__main">
                <p>이미지를 선택하세요.</p>
            </div>
        );
    }

    return (
        <div className="modal__main">
            <img className="modal__main-image" src={image.imageUrl || image.thumbnail} alt="이미지" />
        </div>
    );
};

export default ImageViewer;
