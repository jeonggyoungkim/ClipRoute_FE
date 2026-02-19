import type { CourseListResult } from '../types/video';
import type { ApiResponse } from "../types/common";

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
  const requestParams: Record<string, any> = {
    page: params.pageParam,
    pageSize: 10,
    sort: 'random',
    isRep: true, // 대표 코스만 조회
  };

  try {
    const response = await api.get('/api/v1/courses', { params: requestParams });
    console.log('API 응답 성공 (일반)', response.data);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
    throw error;
  }
};

interface FetchRecommendedCoursesParams {
  pageParam: number;
  regionId: number;
  travelDays: number;
}

export const fetchRecommendedCourses = async (
  params: FetchRecommendedCoursesParams
): Promise<ApiResponse<CourseListResult>> => {
  const requestParams = {
    page: params.pageParam,
    pageSize: 10,
    sort: 'random',
    regionId: params.regionId,
    travelDays: params.travelDays,
  };

  try {
    const response = await api.get('/api/v1/courses/recommendation', { params: requestParams });
    console.log('API 응답 성공 (추천)', response.data);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
    throw error;
  }
};

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const { status, data } = error.response;
      const serverMessage = data?.message || '상세 메시지 없음';
      console.error('❌ [백엔드 에러 응답]', { 상태코드: status, 에러메시지: serverMessage, 전체데이터: data });
      throw new Error(`[Server Error ${status}] ${serverMessage}`);
    } else if (error.request) {
      console.error('❌ [응답 없음/CORS 에러]', error.request);
      throw new Error('서버로부터 응답이 없습니다. CORS 설정을 확인하세요.');
    }
  }
  console.error('❌ [알 수 없는 에러]', error);
  throw new Error('네트워크 또는 시스템 오류가 발생했습니다.');
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

// 코스 스크랩 파라미터
interface ScrapCourseParams {
  startDate?: string | null;
  endDate?: string | null;
}

// 코스 스크랩
export const scrapCourse = async (courseId: number, params?: ScrapCourseParams) => {
  console.log(`🚀 [scrapCourse API 호출] CourseID: ${courseId}, Params:`, params);
  try {
    const { data } = await api.post(`/api/v1/courses/${courseId}/scrap`, params);
    console.log(`✅ [스크랩 성공] CourseID: ${courseId}`, data);
    return data.result;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || '스크랩 실패';
      const status = error.response?.status;

      if (status === 401) throw new Error('로그인이 필요합니다.');
      throw new Error(message);
    }
    throw error;
  }
};
