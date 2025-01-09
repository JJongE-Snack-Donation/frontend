import React from 'react';
import '../Styles/Components.css';
import user from "../Assets/Imgs/etc/user.svg";

const NameTag = () => {
    return (
        <div className="nametag">
            <img src={user} alt="user" />
            <p>국립생태원</p>
            <p>/</p>
            <p className="name">정솔주</p>
        </div>
    );
}

export default NameTag;