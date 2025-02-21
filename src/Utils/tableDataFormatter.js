export const getTableData = (imageData) => {
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
          left: { label: '촬영 날짜', value: imageData.DateTimeOriginal || '-' },
          right: { label: '등록 날짜', value: imageData.DateTimeOriginal || '-' }
        },
        {
          type: 'double',
          left: { label: '위도', value: imageData.Latitude || 'No Data' },
          right: { label: '경도', value: imageData.Longitude || 'No Data' }
        },
        {
          type: 'double',
          left: { label: 'AI 검수 여부', value: imageData.exception_status === "pending" ? "True" : "False" },
          right: { label: '카메라 라벨', value: imageData.SerialNumber || 'No Data' }
        }
      ],
      '분석 결과': [
        {
          type: 'double',
          left: { label: '종명', value: imageData.BestClass || 'No Data'},
          right: { label: '개체수', value: imageData.Count || 'No Data' }
        },
        {
          type: 'single',
          label: '정확도',
          value: imageData.Accuracy ? `${imageData.Accuracy}%` : 'No Data'
        }
      ]
    };
  };
  