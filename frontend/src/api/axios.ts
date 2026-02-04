import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  //baseURL: 'http://15.164.94.220:8080', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
