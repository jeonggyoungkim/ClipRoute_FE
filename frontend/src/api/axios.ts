import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// 환경 변수 디버깅
console.log('🔧 [Axios Config]', {
  BASE_URL,
  USE_MOCK,
  ENV_MODE: import.meta.env.MODE,
  ENV_DEV: import.meta.env.DEV,
  ENV_PROD: import.meta.env.PROD,
});

const api = axios.create({
  baseURL: USE_MOCK ? '' : BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420',
  },
});

// Request Interceptor: 요청 로깅
api.interceptors.request.use(
  (config) => {
    console.log('📤 [API Request]', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      params: config.params,
    });
    return config;
  },
  (error) => {
    console.error('❌ [Request Error]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: 응답 로깅
api.interceptors.response.use(
  (response) => {
    console.log('✅ [API Response]', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    if (error.response) {
      // 서버가 응답했지만 에러 상태코드
      console.error('❌ [Response Error]', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        data: error.response.data,
      });
    } else if (error.request) {
      // 요청은 보냈지만 응답 없음
      console.error('❌ [No Response]', {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        fullURL: `${error.config?.baseURL}${error.config?.url}`,
        message: '서버로부터 응답이 없습니다. 가능한 원인: CORS, 서버 다운, 네트워크 문제',
        errorMessage: error.message,
      });
    } else {
      // 요청 설정 중 에러
      console.error('❌ [Request Setup Error]', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
export { USE_MOCK };