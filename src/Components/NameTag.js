import React, { useEffect, useState } from 'react';
import '../Styles/Components.css';
import user from "../Assets/Imgs/etc/user.svg";

const NameTag = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        // 로컬 스토리지에서 username 가져오기
        const storedAdmin = localStorage.getItem('username');
        setUsername(storedAdmin);
    }, []);

    return (
        <div className="nametag">
            <img src={user} alt="user" />
            <p>국립생태원</p>
            <p>/</p>
            <p className="name">{username}</p> {/* 가져온 username을 표시 */}
        </div>
    );
}

export default NameTag;
