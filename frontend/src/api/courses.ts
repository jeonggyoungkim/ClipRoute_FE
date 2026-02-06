import type { ApiResponse, CourseListResult } from '../types/video';
import { generateMockCourses, createMockResponse } from '../mock/videoData';

//true  → 목업 데이터 사용 (현재)
//false → 실제 API 사용 (나중)

const USE_MOCK_API = true;

interface FetchCoursesParams {
  pageParam: number;
  destination: { regionId: number } | null;
  travelDays: number | null;
  isFilterMode: boolean;
}


export const fetchCourses = async (
  params: FetchCoursesParams
): Promise<ApiResponse<CourseListResult>> => {
  console.log('🚀 [fetchCourses] 호출됨', params);

  if (USE_MOCK_API) {
    console.log('🟢 [fetchCourses] MOCK 모드 진입');
    return fetchCoursesMock(params);
  }

  console.log('🔵 [fetchCourses] REAL API 모드 진입');
  return fetchCoursesReal(params);
};


const fetchCoursesMock = async ({
  pageParam,
  destination,
  travelDays,
  isFilterMode,
}: FetchCoursesParams): Promise<ApiResponse<CourseListResult>> => {
  console.log('🧪 [fetchCoursesMock] 시작');
  console.log('🧪 pageParam:', pageParam);
  console.log('🧪 destination:', destination);
  console.log('🧪 travelDays:', travelDays);
  console.log('🧪 isFilterMode:', isFilterMode);

  const pageSize = 10;
  await new Promise(res => setTimeout(res, 300));

  let courses = generateMockCourses(50);
  console.log('🧪 mock 전체 개수:', courses.length);

  if (isFilterMode) {
    if (destination) {
      courses = courses.filter(c => c.regionId === destination.regionId);
      console.log('🧪 region 필터 후 개수:', courses.length);
    }
    if (travelDays) {
      courses = courses.filter(c => c.travelDays === travelDays);
      console.log('🧪 travelDays 필터 후 개수:', courses.length);
    }
  }

  const start = pageParam * pageSize;
  const end = start + pageSize;
  const sliced = courses.slice(start, end);

  console.log('🧪 페이지 slice 범위:', start, end);
  console.log('🧪 현재 페이지 반환 개수:', sliced.length);
  console.log('🧪 hasNext:', end < courses.length);

  return createMockResponse(
    sliced,
    courses.length,
    pageParam,
    pageSize,
    end < courses.length
  );
};


const fetchCoursesReal = async ({
  pageParam,
  destination,
  travelDays,
  isFilterMode,
}: FetchCoursesParams): Promise<ApiResponse<CourseListResult>> => {
  console.log('🌐 [fetchCoursesReal] API 호출 시작');

  const pageSize = 10;

  const params: Record<string, any> = {
    page: pageParam,
    pageSize,
    sort: 'random',
  };

  if (isFilterMode) {
    if (destination) params.regionId = destination.regionId;
    if (travelDays) params.travelDays = travelDays;
  }

  const queryString = new URLSearchParams(params).toString();
  console.log('🌐 요청 쿼리:', queryString);

  const res = await fetch(`/api/v1/courses?${queryString}`);
  if (!res.ok) {
    console.error('❌ API 응답 실패', res.status);
    throw new Error('API 요청 실패');
  }

  const json = await res.json();
  console.log('🌐 API 응답 성공', json);

  return json;
};
