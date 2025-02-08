import React from 'react';

const ImageViewer = ({ image }) => (
    <div className="modal__main">
        <img className="modal__main-image" src={image.thumbnail} alt="" />
    </div>
);

export default ImageViewer;