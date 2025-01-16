import React from 'react';

const Step = () => {
    return (
        <div className="step-container">
        <div className="num active">1</div>
        <p>선택</p>
        <span>진행중</span>
        <hr class="hr-basic" />
        <div className="num">2</div>
        <p>업로드</p>
        <span>대기중</span>
        <hr class="hr-basic" />
        <div className="num">3</div>
        <p>분석</p>
        <span>대기중</span>
        <hr class="hr-basic" />
        <div className="num">4</div>
        <p>완료</p>
        <span>대기중</span>
    </div>
    );
}

export default Step;