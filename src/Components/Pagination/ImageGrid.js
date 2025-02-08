import React from 'react';
import '../../Styles/Pagination/ImageGrid.css';
import trashBinIcon from '../../Assets/Imgs/btn/trash_bin.svg'
import starIcon from '../../Assets/Imgs/etc/star.svg'

const ImageGrid = ({ images, onImageClick }) => {
  const handleImageError = (e) => {
    e.target.src = '/fallback-image.jpg'; // 기본 이미지 설정
    e.target.style.opacity = '0.5';
  };

  return (
    <div className="image-grid">
      {images.map((image) => (
        <div key={image.id} className="image-card" onClick={() => onImageClick(image)}>
          <div className="image-card__header">
            <input type='checkbox' className="image-card__checkbox"/>
            <p className="image-card__title">{image.filename}</p>
            <button className='image-card__delete-btn'><img src={trashBinIcon} alt="Delete"/></button>
          </div>
          <div className="image-card__content">
            <img
              src={image.thumbnail} 
              onError={handleImageError}  // 에러 핸들러 추가
              alt="" 
              className='image-card__img'/>
            <button className='image-card__favorite-btn'>
              <img src={starIcon} alt="Favorite"/>
            </button>
          </div>
          <div className="image-card__info">
            <p className="image-card__info-item">종명: {image.species || '물체 미감지'}</p>
            <p className="image-card__info-item">최대 개체수: {image.count}</p>
            <p className="image-card__info-item">카메라 시리얼: {image.serial_number}</p>
            <p className="image-card__info-item">촬영 날짜: {new Date(image.date).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
