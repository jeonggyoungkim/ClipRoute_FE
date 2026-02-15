import api from './axios';

export interface SignUpRequest {
  email: string;
  password: string;
  nickname: string;
  gender: 'FEMALE' | 'MALE' | 'OTHER';
  ageRange:
  | 'AGE_10S'
  | 'AGE_20S'
  | 'AGE_30S'
  | 'AGE_40S'
  | 'AGE_50S'
  | 'AGE_60S_OVER'
  | 'UNKNOWN';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const signup = (data: SignUpRequest) => {
  return api.post('/api/auth/signup', data);
};

export interface LoginResponse {
  status?: number;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    nickname?: string;
  };
}

/**
 * 로그인 API 호출
 * @param body 로그인 요청 데이터
 * @returns 로그인 응답 데이터
 */
export const login = async (body: LoginRequest) => {
  const res = await api.post<LoginResponse>("/api/auth/login", body);
  return res.data;
};

/**
 * 로그아웃
 */
export const logout = () => {
  // 필요시 로그아웃 로직 추가
};

