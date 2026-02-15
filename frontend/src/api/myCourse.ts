import api from "./axios";
import type { CourseItem, FetchMyCoursesResponse, DeleteMyCoursesResponse, MyCourseDetail, MyCourseDetailResponse } from "../types/mycourse";
import axios from 'axios';

// --- 나의 코스 목록 조회 (GET) ---
// /api/v1/members/me/courses
export const fetchMyCourses = async (): Promise<CourseItem[]> => {
  console.log('🚀 [fetchMyCourses] 호출됨');

  try {
    const responseData = await api.get<FetchMyCoursesResponse>('/api/v1/members/me/courses');
    const response = responseData.data;

    console.log('✅ [나의 코스 목록 조회 성공]', response);

    if (response.isSuccess && response.result) {
      return response.result.courseList;
    }

    return [];
  } catch (error: unknown) {
    console.error('❌ 나의 코스 목록 조회 실패:', error);
    return [];
  }
};

// --- 나의 코스 삭제 (DELETE) ---
// /api/v1/members/me/courses/{courseId} 반복 호출
export const deleteMyCourses = async (courseIds: number[]): Promise<DeleteMyCoursesResponse> => {
  console.log('🚀 [deleteMyCourses] 호출됨', courseIds);

  try {
    // 현재 코스 1개씩 삭제(백엔드와 상의)
    for (const courseId of courseIds) {
      await api.delete(`/api/v1/members/me/courses/${courseId}`);
    }

    return {
      isSuccess: true,
      code: "COMMON200",
      message: `${courseIds.length}개의 코스가 삭제되었습니다.`,
    };
  } catch (error: unknown) {
    console.error('❌ 나의 코스 삭제 실패:', error);
    return {
      isSuccess: false,
      code: "FAIL",
      message: "코스 삭제 중 오류가 발생했습니다."
    };
  }
};

// --- 나의 코스 상세 조회 (GET) ---
// /api/v1/members/me/courses/{courseId}
export const fetchMyCourseDetail = async (courseId: string): Promise<MyCourseDetail | null> => {
  console.log('🚀 [fetchMyCourseDetail] 호출됨', courseId);

  try {
    const responseData = await api.get<MyCourseDetailResponse>(`/api/v1/members/me/courses/${courseId}`);
    const response = responseData.data;

    console.log('✅ [나의 코스 상세 조회 성공]', response);

    if (response.isSuccess && response.result) {
      return response.result;
    }
    return null;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message ?? '상세 조회 실패';
      console.error('❌ 상세 조회 실패:', { status, message });
    } else {
      console.error('❌ 알 수 없는 에러:', error);
    }
    return null;
  }
};

// --- 나의 코스 수정/저장 (PATCH) ---
// /api/v1/members/me/courses/{courseId}
export const updateMyCourseDetail = async (courseId: string, data: any): Promise<MyCourseDetailResponse> => {
  console.log('🚀 [updateMyCourseDetail] 호출됨', { courseId, data });

  try {
    const responseData = await api.patch<MyCourseDetailResponse>(`/api/v1/members/me/courses/${courseId}`, data);
    const response = responseData.data;

    console.log('✅ [나의 코스 수정 성공]', response);
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message ?? '수정 실패';
      console.error('❌ 수정 요청 실패:', { status, message, detail: error.response?.data });
      throw new Error(`Error ${status}: ${message}`);
    } else {
      console.error('❌ 알 수 없는 에러:', error);
      throw new Error('수정 요청 중 오류 발생');
    }
  }
};