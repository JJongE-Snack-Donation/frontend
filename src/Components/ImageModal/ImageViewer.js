import React from 'react';

const ImageViewer = ({ image }) => {

    return (
        <div className="modal__main">
            <img className="modal__main-image" src={image.thumbnail} alt="이미지" />
        </div>
    );
};

export default ImageViewer;