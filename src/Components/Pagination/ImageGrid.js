import React from 'react';
import '../../Styles/Pagination/ImageGrid.css';
import trashBinIcon from '../../Assets/Imgs/btn/trash_bin.svg'
import starIcon from '../../Assets/Imgs/etc/star.svg'

const ImageGrid = ({ images, onImageClick }) => {
  return (
    <div className="image-grid">
      {images.map((image) => (
        <div key={image.id} className="image-card" onClick={() => onImageClick(image)}>
          <div className="image-card__header">
            <input type='checkbox' className="image-card__checkbox"/>
            <p className="image-card__title">{image.FileName}</p>
            <button className='image-card__delete-btn'><img src={trashBinIcon} alt="Delete"/></button>
          </div>
          <div className="image-card__content">
            <img src={image.FilePath} alt="" className='image-card__img'/>
            <button className='image-card__favorite-btn'>
              <img src={starIcon} alt="Favorite"/>
            </button>
          </div>
          <div className="image-card__info">
            <p className="image-card__info-item">종명: {image.species || '물체 미감지'}</p>
            <p className="image-card__info-item">최대 개체수: {image.maxCount || '0'}</p>
            <p className="image-card__info-item">카메라 라벨: {image.UserLabel}</p>
            <p className="image-card__info-item">촬영 날짜: {image.DateTimeOriginal}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
