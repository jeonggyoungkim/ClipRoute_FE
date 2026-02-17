import type { CourseListResult } from '../types/video';
import type { ApiResponse } from "../types/common";
import type { ScrapResult } from '../types/course';
import api from '../api/axios';
import axios from 'axios';

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

  const requestParams: Record<string, any> = {
    page: params.pageParam,
    pageSize: 10,
    sort: 'random',
  };

  if (params.isFilterMode) {
    if (params.destination) requestParams.regionId = params.destination.regionId;
    if (params.travelDays) requestParams.travelDays = params.travelDays;
  }

  try {
    const response = await api.get('/api/v1/courses', { params: requestParams });
    console.log('API 응답 성공', response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // 서버가 응답을 줬으나 2xx가 아닌 경우 (400, 401, 500 등)
        const { status, data } = error.response;
        const serverMessage = data?.message || '상세 메시지 없음';

        console.error('❌ [백엔드 에러 응답]', {
          상태코드: status,
          에러메시지: serverMessage,
          전체데이터: data
        });

        throw new Error(`[Server Error ${status}] ${serverMessage}`);
      } else if (error.request) {
        // 요청은 보냈으나 응답이 전혀 없는 경우 (CORS, 서버 꺼짐 등)
        console.error('❌ [응답 없음/CORS 에러]', error.request);
        throw new Error('서버로부터 응답이 없습니다. CORS 설정을 확인하세요.');
      }
    }

    // 설정 오류 등 기타 에러
    console.error('❌ [알 수 없는 에러]', error);
    throw new Error('네트워크 또는 시스템 오류가 발생했습니다.');
  }
};

// --- 코스 상세 조회 (일반용) ---
export const fetchCourseDetail = async (courseId: string) => {
  console.log('🚀 [fetchCourseDetail] 호출됨', courseId);

  try {
    const response = await api.get(`/api/v1/courses/${courseId}`);
    console.log('✅ [상세 조회 성공]', response.data);
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
      throw new Error('서버로부터 응답이 없습니다.');
    } else {
      console.error('❌ 알 수 없는 에러:', error);
      throw new Error('상세 조회 중 오류 발생');
    }
  }
};

// 코스 스크랩
export const scrapCourse = async (courseId: number): Promise<ScrapResult> => {
  try {
    const { data } = await api.post(`/api/v1/courses/${courseId}/scrap`);
    return data.result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || '스크랩 실패';
      const status = error.response?.status;

      if (status === 401) throw new Error('로그인이 필요합니다.');
      throw new Error(message);
    }
    throw error;
  }
};
