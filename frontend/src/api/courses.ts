import type { CourseListResult } from '../types/video';
import type { ApiResponse } from "../types/common";
import { generateMockCourses, createMockResponse } from '../mock/videoData';
import { MOCK_COURSE_DETAIL } from '../mock/courseDetail';
import api from '../api/axios';
import axios from 'axios';

const USE_MOCK_API = true;

interface FetchCoursesParams {
  pageParam: number;
  destination: { regionId: number } | null;
  travelDays: number | null;
  isFilterMode: boolean;
  isRep: boolean;
}

export const fetchCourses = async (
  params: FetchCoursesParams
): Promise<ApiResponse<CourseListResult>> => {
  params.isRep = true;
  console.log('🚀 [fetchCourses] 호출됨', params);

  if (USE_MOCK_API) {
    console.log('🟢 [fetchCourses] MOCK 모드 진입');
    return fetchCoursesMock(params);
  }

  console.log('🔵 [fetchCourses] REAL API 모드 진입');
  return fetchCoursesReal(params);
};

// --- Mock 함수 ---
const fetchCoursesMock = async ({
  pageParam,
  destination,
  travelDays,
  isFilterMode,
}: FetchCoursesParams): Promise<ApiResponse<CourseListResult>> => {
  const pageSize = 10;
  await new Promise(res => setTimeout(res, 300));

  let courses = generateMockCourses(50);
  if (isFilterMode) {
    if (destination) courses = courses.filter(c => c.regionId === destination.regionId);
    if (travelDays) courses = courses.filter(c => c.travelDays === travelDays);
  }

  const start = pageParam * pageSize;
  const end = start + pageSize;
  const sliced = courses.slice(start, end);

  return createMockResponse(sliced, courses.length, pageParam, pageSize, end < courses.length);
};

// --- 실제 API 호출 함수 (에러 응답 상세 확인 버전) ---
const fetchCoursesReal = async ({
  pageParam,
  destination,
  travelDays,
  isFilterMode,
}: FetchCoursesParams): Promise<ApiResponse<CourseListResult>> => {
  console.log('🔍 [fetchCoursesReal] API 호출 시작');

  const params: Record<string, any> = {
    page: pageParam,
    pageSize: 10,
    sort: 'random',
  };

  if (isFilterMode) {
    if (destination) params.regionId = destination.regionId;
    if (travelDays) params.travelDays = travelDays;
  }

  try {
    const response = await api.get('/api/v1/courses', { params });
    console.log('✅ [API 응답 성공]', response.data);
    return response.data;
  } catch (error: unknown) {
    // ✅ axios 에러인지 상세 확인
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // 1. 서버가 응답을 줬으나 2xx가 아닌 경우 (400, 401, 500 등)
        const { status, data } = error.response;
        const serverMessage = data?.message || '상세 메시지 없음';

        console.error('❌ [백엔드 에러 응답]', {
          상태코드: status,
          에러메시지: serverMessage,
          전체데이터: data
        });

        throw new Error(`[Server Error ${status}] ${serverMessage}`);
      } else if (error.request) {
        // 2. 요청은 보냈으나 응답이 전혀 없는 경우 (CORS, 서버 꺼짐, ngrok 만료 등)
        console.error('❌ [응답 없음/CORS 에러]', error.request);
        throw new Error('서버로부터 응답이 없습니다. CORS 설정이나 ngrok 주소를 확인하세요.');
      }
    }

    // 3. 설정 오류 등 기타 에러
    console.error('❌ [알 수 없는 에러]', error);
    throw new Error('네트워크 또는 시스템 오류가 발생했습니다.');
  }
};

// --- 코스 상세 조회 (일반용) ---
export const fetchCourseDetail = async (courseId: string) => {
  console.log('🚀 [fetchCourseDetail] 호출됨', courseId);

  if (USE_MOCK_API) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_COURSE_DETAIL), 500);
    });
  }

  console.log('🔵 [fetchCourseDetail] REAL API 모드');
  try {
    const response = await api.get(`/api/v1/courses/${courseId}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message ?? '서버 오류';
        console.error('❌ 상세 조회 실패:', { status, message });
        throw new Error(`Error ${status}: ${message}`);
      }
      console.error('❌ 응답 없음 (네트워크/CORS):', error.request);
    } else {
      console.error('❌ 알 수 없는 에러:', error);
    }
    throw new Error('상세 조회 중 오류 발생');
  }
};

