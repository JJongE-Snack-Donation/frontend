import { useState, useEffect } from 'react';

const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
        setIsLoggedIn(true);
        }
    }, []);

    const login = (token) => {
        sessionStorage.setItem('token', token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return { isLoggedIn, login, logout };
};

export default useAuth;