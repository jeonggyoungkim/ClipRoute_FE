
import api, { USE_MOCK } from "./axios";
import { MOCK_COURSES } from "../mock/mycoursedata";
import { MOCK_COURSE_DETAIL } from "../mock/courseDetail"; // 상세 조회 Mock 데이터
import type { CourseItem, FetchMyCoursesResponse, DeleteMyCoursesResponse, MyCourseDetail, MyCourseDetailResponse } from "../types/mycourse";
import axios from 'axios';

// --- 나의 코스 목록 조회 (GET) ---
// /api/v1/members/me/courses
export const fetchMyCourses = async (): Promise<CourseItem[]> => {
  console.log('🚀 [fetchMyCourses] 호출됨');

  if (USE_MOCK) {
    console.log('🟢 [fetchMyCourses] Mock Data 사용');
    return new Promise((resolve) => {
      setTimeout(() => {
        // MOCK_COURSES가 CourseItem[] 타입이라고 가정
        resolve(MOCK_COURSES as unknown as CourseItem[]);
      }, 500);
    });
  }

  try {
    // 제네릭으로 응답 타입 명시
    const responseData = await api.get<FetchMyCoursesResponse>('/api/v1/members/me/courses');
    const response = responseData.data;

    console.log('✅ [나의 코스 목록 조회 성공]', response);

    // result.courseList 반환
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

  if (USE_MOCK) {
    console.log('🟢 [deleteMyCourses] Mock 모드 동작');
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('✅ [Mock] 삭제 성공 처리');
        resolve({
          isSuccess: true,
          code: "MOCK_SUCCESS",
          message: `${courseIds.length}개의 코스가 삭제되었습니다.`
        });
      }, 500);
    });
  }

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

  if (USE_MOCK) {
    console.log('🟢 [fetchMyCourseDetail] Mock Data 사용');
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_COURSE_DETAIL as unknown as MyCourseDetail), 500);
    });
  }

  try {
    const responseData = await api.get<MyCourseDetailResponse>(`/api/v1/members/me/courses/${courseId}`);
    const response = responseData.data;

    console.log('✅ [나의 코스 상세 조회 성공]', response);

    if (response.isSuccess && response.result) {
      return response.result;
    }
    return null; // 실패 시 null 반환
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

  if (USE_MOCK) {
    console.warn('🚧 [updateMyCourseDetail] Mock 모드에서는 수정이 실제로 반영되지 않습니다.');
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        isSuccess: true,
        code: "MYCOURSE200_5",
        message: "My course detail edited successfully.",
        result: { ...data } as MyCourseDetail // 임시 반환
      }), 500);
    });
  }

  try {
    const responseData = await api.patch<MyCourseDetailResponse>(`/api/v1/members/me/courses/${courseId}`, data);
    const response = responseData.data;

    console.log('✅ [나의 코스 수정 성공]', response);
    return response; // 전체 응답 반환
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