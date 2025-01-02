// ImageGrid.js
import React from 'react';
import '../../Styles/Pagination/ImageGrid.css';

const ImageGrid = ({ images }) => {
  return (
    <div className="image-grid">
      {images.map((image) => (
        <div key={image._id} className="image-item">
          <img src={image.FilePath} alt={image.FileName} />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;