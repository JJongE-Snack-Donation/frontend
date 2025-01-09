import React from 'react';
import '../Styles/Home.css';
import '../Styles/Project.css';
import NameTag from '../Components/NameTag';
import Title from '../Components/Title';

const Project = () => {
    return (
        <div className="wrap">
            <NameTag />
            <Title 
            title="프로젝트"
            desc="프로젝트 관리, 업로드 및 분석"
            />
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
            <h1>project</h1>
        </div>
    );
}

export default Project;