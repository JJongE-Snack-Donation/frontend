const formatDate = (dateObject) => {
  if (!dateObject || !dateObject.$date) return '-';
  const date = new Date(dateObject.$date);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

export const getTableData = (imageData, pageType = 'normal') => {
  // 데이터가 없는 경우 빈 객체 반환
  if (!imageData) return {};
  
  const speciesMapping = {
    'pig': '멧돼지',
    'raccoon': '너구리',
    'deer': '고라니'
  };

  // completed 페이지일 경우 다른 데이터 구조 사용
  if (pageType === 'completed') {
    const details = imageData.details || {};
    const fileName = details.originalFilePath ? details.originalFilePath.split('\\').pop() : '-';
    const fileExtension = fileName.includes('.') ? fileName.split('.').pop() : '.jpg';
    
    return {
      '파일': [
        { 
          type: 'double',
          left: { label: '파일명', value: fileName },
          right: { label: '파일 확장자', value: `.${fileExtension}` }
        }
      ],
      '이벤트': [
        { 
          type: 'single',
          label: '프로젝트 이름',
          value: details.location || 'No Data'
        },
        {
          type: 'double',
          left: { label: '등록 날짜', value: details.captureDate ? new Date(details.captureDate).toLocaleString('ko-KR') : '-' },
          right: { label: '촬영 날짜', value: details.classificationDate ? new Date(details.classificationDate).toLocaleString('ko-KR') : '-' }
        },
        {
          type: 'double',
          left: { label: '위도', value: details.latitude || 'No Data' },
          right: { label: '경도', value: details.longitude || 'No Data' }
        },
        {
          type: 'double',
          left: { label: 'AI 검수 여부', value: details.inspectionStatus !== null ? "True" : "False" },
          right: { label: '카메라 라벨', value: 'No Data' }
        }
      ],
      '분석 결과': [
        {
          type: 'double',
          left: { label: '종명', value: speciesMapping[imageData.classificationResult] || imageData.classificationResult || 'No Data'},
          right: { label: '개체수', value: details.count || 'No Data' }
        },
        {
          type: 'single',
          label: '정확도',
          value: details.accuracy ? `${details.accuracy}%` : 'No Data'
        }
      ]
    };
  } 
  // normal, exception 페이지일 경우 기존 데이터 구조 사용
  else {
    return {
      '파일': [
        { 
          type: 'double',
          left: { label: '파일명', value: imageData.FileName || '-' },
          right: { label: '파일 확장자', value: imageData.FileExtension || '.jpg' }
        }
      ],
      '이벤트': [
        { 
          type: 'single',
          label: '프로젝트 이름',
          value: imageData.ProjectInfo?.ProjectName || 'No Data'
        },
        {
          type: 'double',
          left: { label: '촬영 날짜', value: formatDate(imageData.DateTimeOriginal) },
          right: { label: '등록 날짜', value: formatDate(imageData.DateTimeOriginal) }
        },
        {
          type: 'double',
          left: { label: '위도', value: imageData.Latitude || 'No Data' },
          right: { label: '경도', value: imageData.Longitude || 'No Data' }
        },
        {
          type: 'double',
          left: { label: 'AI 검수 여부', value: imageData.is_classified === true ? "True" : "False" },
          right: { label: '카메라 라벨', value: imageData.SerialNumber || 'No Data' }
        }
      ],
      '분석 결과': [
        {
          type: 'double',
          left: { label: '종명', value: speciesMapping[imageData.BestClass] || imageData.BestClass || 'No Data'},
          right: { label: '개체수', value: imageData.Count || 'No Data' }
        },
        {
          type: 'single',
          label: '정확도',
          value: imageData.Accuracy ? `${imageData.Accuracy}%` : 'No Data'
        }
      ]
    };
  }
};
