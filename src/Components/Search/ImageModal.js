import { useState } from 'react';
import '../../Styles/ImageModal.css';
import starIcon from '../../Assets/Imgs/etc/star.svg'
import trashbinIcon from '../../Assets/Imgs/btn/trash_bin.svg'
import downloadIcon from '../../Assets/Imgs/btn/download.svg'

const ImageModal = ({ image, onClose }) => {
    
    const [selectedCards, setSelectedCards] = useState([]); // 카드 선택용
    const [checkedBoxes, setCheckedBoxes] = useState([]); // 체크박스용
    const [selectedImageInfo, setSelectedImageInfo] = useState(image); // 선택된 이미지 정보 상태 저장용

    // 이미지 카드 클릭 처리
    const handleCardClick = (clickedImage, e) => {
        e.stopPropagation();
        console.log('Clicked Image:', clickedImage); // 클릭된 이미지 데이터 확인
        setSelectedCards([clickedImage.imageId]); // 배열에 하나의 ID만 저장
        setSelectedImageInfo(clickedImage); // 선택된 이미지 정보 업데이트
    };

    // 체크박스 클릭 처리
    const handleCheckboxChange = (imageId, e) => {
        e.stopPropagation(); // 이벤트 버블링 방지
        setCheckedBoxes(prev => {
            if (prev.includes(imageId)) {
                return prev.filter(id => id !== imageId);
            } else {
                return [...prev, imageId];
            }
        });
    };

    // 예외 검수 처리
    const handleInspection = () => {
        
    }

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

    const tableData = getTableData(selectedImageInfo);

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal__container" onClick={e => e.stopPropagation()}>
                <div className="modal__content">
                    <div className="modal__left-section">
                        <div className="modal__main">
                            <img className="modal__main-image" src={image.FilePath} alt="" />
                        </div>
                        <div className="modal__option-bar">
                            <button className="modal__select_all-btn">전체 선택</button>
                            <button 
                                className="modal__inspection-btn"
                                disabled={checkedBoxes.length === 0}
                                onClick={handleInspection}
                            >
                                예외 검수
                            </button>
                        </div>
                        <div className="modal__all">
                            {image.relatedImages?.map((image, index) => (
                                <div 
                                    key={index} 
                                    className={`modal__all_image-item ${selectedCards.includes(image.imageId) ? 'selected' : ''}`}
                                    onClick={(e) => handleCardClick(image, e)}
                                >
                                    <div className="modal__all_image-header">
                                        <input 
                                            type="checkbox" 
                                            className="modal__all_image-checkbox"
                                            checked={checkedBoxes.includes(image.imageId)}
                                            onChange={(e) => handleCheckboxChange(image.imageId, e)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <span className="modal__all_image-number">{index + 1} - {image.species}</span>
                                        <button 
                                            className="modal__all_image-download"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <img src={downloadIcon} alt="Download" />
                                        </button>
                                        <button 
                                            className="modal__all_image-delete"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <img src={trashbinIcon} alt="Delete" />
                                        </button>
                                    </div>
                                    <div className="modal__all_image-content">
                                        <img src={image.FilePath} alt="" />
                                        <button 
                                            className="modal__favorite-btn"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <img src={starIcon} alt="Favorite" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="modal__info">
                        {Object.entries(tableData).map(([title, rows]) => (
                            <div key={title} className="modal__info-section">
                                <h3 className="modal__info-section__title">{title}</h3>
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