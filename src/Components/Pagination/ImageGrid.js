import React from 'react';
import '../../Styles/Pagination/ImageGrid.css';
//import { testImages } from '../../Data/testImages';

const ImageGrid = ({ images }) => {
  return (
    <div className="image-grid">
      {images.map((image) => (
        <div key={`${image.FileName}`} className="image-item">
          <img src={image.FilePath} alt={image.FileName} />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;