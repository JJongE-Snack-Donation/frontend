import React from 'react';
import '../Styles/Components.css';
import arrow from '../Assets/images/etc/arrow_left.svg';

const Title = (props) => {
    return (
        <div className="title">
            <img src={arrow} alt="arrow" />
            <div className="text">
                <h4>{props.title}</h4>
                <p>{props.desc}</p>
            </div>
        </div>
    );
}

export default Title;