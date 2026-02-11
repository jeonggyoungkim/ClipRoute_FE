import type { CourseListResult } from '../types/video';
import type { ApiResponse } from "../types/common";
import { generateMockCourses, createMockResponse } from '../mock/videoData';
import { MOCK_COURSE_DETAIL } from '../mock/courseDetail';
import api from '../api/axios';
import axios from 'axios';


const USE_MOCK_API = false;

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

// --- Mock 함수는 그대로 유지 ---
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

const fetchCoursesReal = async ({
  pageParam,
  destination,
  travelDays,
  isFilterMode,
}: FetchCoursesParams): Promise<ApiResponse<CourseListResult>> => {
  console.log('[fetchCoursesReal] API 호출 시작');

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
    console.log('🌐 API 응답 성공', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ API 응답 실패', error.response?.status || error.message);
    throw new Error('API 요청 실패');
  }
};

// 코스 상세 조회도 수정
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

    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;        // ✅ 상태코드
      const message =
        error.response.data?.message ?? '서버 오류'; // ✅ 서버 메시지

      console.error('❌ 상세 조회 실패:', { status, message });

      // 필요하면 커스텀 에러 던지기
      throw new Error(`Error ${status}: ${message}`);
    }

    // axios 에러가 아닐 때 (네트워크 끊김, JS 에러 등)
    console.error('❌ 알 수 없는 에러:', error);
    throw new Error('Network or unknown error');
  }

};