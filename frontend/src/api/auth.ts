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

export interface LoginOptions {
  /** localStorage 사용 여부 (false면 sessionStorage) */
  keepLogin?: boolean;
}

/**
 * 로그인 API 호출 및 토큰 저장
 * @param body 로그인 요청 데이터
 * @param options 로그인 옵션 (keepLogin 등)
 * @returns 로그인 응답 데이터
 */
export const login = async (
  body: LoginRequest,
  options: LoginOptions = { keepLogin: true }
) => {
  const res = await api.post<LoginResponse>("/api/auth/login", body);

  const storage = options.keepLogin ? localStorage : sessionStorage;

  // 기존 토큰 제거 (충돌 방지)
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("nickname");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("nickname");

  // 방법 1: 응답 바디에서 토큰 추출 (우선순위)
  let accessToken = res.data?.data?.accessToken;
  let refreshToken = res.data?.data?.refreshToken;
  let nickname = res.data?.data?.nickname;

  // 방법 2: 응답 헤더에서 토큰 추출 (바디에 없을 경우)
  if (!accessToken) {
    const headerToken = res.headers["authorization"];
    if (headerToken?.startsWith("Bearer ")) {
      accessToken = headerToken.substring(7).trim();
    }
  }

  // 토큰 검증
  if (!accessToken) {
    throw new Error("로그인 응답에 토큰이 없습니다.");
  }

  // 토큰 저장
  storage.setItem("accessToken", accessToken);

  if (refreshToken) {
    storage.setItem("refreshToken", refreshToken);
  }

  if (nickname) {
    storage.setItem("nickname", nickname);
  }

  console.log('✅ [로그인 성공] 토큰 저장 완료', {
    storage: options.keepLogin ? 'localStorage' : 'sessionStorage',
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    nickname,
  });

  return res.data;
};

/**
 * 로그아웃 (토큰 삭제)
 */
export const logout = () => {
  // localStorage와 sessionStorage 모두 정리
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("nickname");

  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("nickname");

  console.log('✅ [로그아웃] 토큰 삭제 완료');
};

