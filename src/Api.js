import axios from 'axios';

// .env 파일에서 설정한 BASE URL을 불러옵니다.
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

export default api;