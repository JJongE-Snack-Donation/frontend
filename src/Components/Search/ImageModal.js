import { useState } from 'react';
import '../../Styles/ImageModal.css';
import starIcon from '../../Assets/Imgs/etc/star.svg'

const ImageModal = ({ image, onClose }) => {

    const getTableData = (imageData) => {
        return {
            파일: [
                { 
                    type: 'double',
                    left: { label: '파일명', value: imageData.FileName || '-' },
                    right: { label: '파일 확장자', value: imageData.FileExtension || '.JPG' }
                }
            ],
            이벤트: [
                { 
                    type: 'single',
                    label: '프로젝트 이름',
                    value: imageData.projectName || 'No Data'
                },
                {
                    type: 'double',
                    left: { label: '촬영 날짜', value: imageData.DateTimeOriginal || '-' },
                    right: { label: '등록 날짜', value: imageData.RegisterDate || '-' }
                },
                {
                    type: 'double',
                    left: { label: '위도', value: imageData.Latitude || 'No Data' },
                    right: { label: '경도', value: imageData.Longitude || 'No Data' }
                },
                {
                  type: 'double',
                  left: { label: '예외 검수 여부', value: imageData.IsDetected ? 'False' : 'True' },
                  right: { label: '카메라 라벨', value: imageData.SerialNumber || 'No Data' }
              }
            ],
            '분석 결과': [
              {
                type: 'double',
                left: { label: '종명', value: imageData.species || 'No Data'},
                  right: { label: '개체수', value: imageData.CameraName || 'No Data' }
              },
                {
                    type: 'single',
                    label: '정확도',
                    value: imageData.Accuracy ? `${imageData.Accuracy}%` : 'No Data'
                }
            ]
        };
    };

    const tableData = getTableData(image);

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal__container" onClick={e => e.stopPropagation()}>
                <div className="modal__content">
                    <div className="modal__left-section">
                        <div className="modal__main">
                            <img className="modal__main-image" src={image.FilePath} alt="" />
                        </div>
                        <div className="modal__all">
                            {image.relatedImages?.map((img, index) => (
                                <div key={index} className="modal__all_image-item">
                                    <img src={img.FilePath} alt="" />
                                    <div className="modal__all-image-actions">
                                        <button className="modal__download-btn">
                                            <img src="/download-icon.svg" alt="Download" />
                                        </button>
                                        <button className="modal__favorite-btn">
                                            <img src={starIcon} alt="Favorite" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="modal__info">
                        {Object.entries(tableData).map(([title, rows]) => (
                            <div key={title} className="info-section">
                                <h3 className="info-section__title">{title}</h3>
                                <table className="modal__info-table">
                                    <tbody>
                                        {rows.map((row, index) => (
                                            <tr key={index}>
                                                {row.type === 'double' ? (
                                                    <>
                                                        <th>{row.left.label}</th>
                                                        <td>{row.left.value}</td>
                                                        <th>{row.right.label}</th>
                                                        <td>{row.right.value}</td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <th>{row.label}</th>
                                                        <td colSpan="3">{row.value}</td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageModal;