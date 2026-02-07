import axios from 'axios';


const USE_MOCK = true; // Mock 사용: true, 실제 API: false

const api = axios.create({
  baseURL: USE_MOCK ? '' : 'http://localhost:8080',
  // baseURL: 'http://15.164.94.220:8080', // 배포 서버
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
export { USE_MOCK };