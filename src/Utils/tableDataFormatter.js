export const getTableData = (imageData) => {
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
