import React from 'react';
import '../../Styles/Pagination/ImageGrid.css';
import trash_bin from '../../Assets/Imgs/btn/trash_bin.svg'

const ImageGrid = ({ images, onImageClick }) => {
  return (
    <div className="image-grid">
      {images.map((image) => (
        <div key={image.id} className="image-card" onClick={() => onImageClick(image)}>
          <div className="image-header">
            <input type='checkbox'/>
            <p className="image-title">{image.FileName}</p>
            <button className='image-delete'><img src={trash_bin} alt="trash_bin"/></button>
          </div>
          <div className="image-wrapper">
            <img src={image.FilePath} alt="" />
          </div>
          <div className="image-info">
            <p>종명 {image.species || '물체 미감지'}</p>
            <p>최대 개체수 {image.maxCount || '0'}</p>
            <p>카메라 라벨 {image.UserLabel}</p>
            <p>촬영 날짜 {image.DateTimeOriginal}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
