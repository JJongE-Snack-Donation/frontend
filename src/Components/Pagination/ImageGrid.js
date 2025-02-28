import React from 'react';
import '../../Styles/Pagination/ImageGrid.css';

const ImageGrid = ({ groups, onGroupClick }) => {
  const handleImageError = (e) => {
    console.error(`Image load failed: ${e.target.src}`);
    e.target.src = '/fallback-image.jpg';
    e.target.style.opacity = '0.5';
  };

  const getImageUrl = (path) => {
    if (!path) {
      console.warn('Image path is empty');
      return '/fallback-image.jpg';
    }
    const url = `http://localhost:5000/images/${path.replace(/^\.?\/?(mnt\/)?/, '')}`;
    return url;
  };

  return (
    <div className="image-grid">
      {groups.map((group) => (
        <div key={group.evtnum} className="image-card" onClick={() => onGroupClick(group)}>
          <div className="image-card__header">
            <input type='checkbox' className="image-card__checkbox"/>
            <p className="image-card__title">Event: {group.evtnum}</p>
          </div>
          <div className="image-card__content">
            <img
              src={getImageUrl(group.ThumnailPath)}
              onError={handleImageError}
              alt="" 
              className='image-card__img'/>
          </div>
          <div className="image-card__info">
            <p className="image-card__info-item">이미지 수: {group.imageCount}</p>
            <p className="image-card__info-item">프로젝트: {group.projectName}</p>
            <p className="image-card__info-item">카메라 시리얼: {group.serialNumber}</p>
            <p className="image-card__info-item">촬영 날짜: {new Date(group.DateTimeOriginal.$date).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
