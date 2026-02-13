import { MOCK_COURSES } from "../mock/mycoursedata";
import type { CourseItem, FetchMyCoursesResponse, DeleteMyCoursesResponse } from "../types/mycourse";
import api, { USE_MOCK } from "./axios";

export const fetchMyCourses = async (): Promise<CourseItem[]> => {
  if (USE_MOCK) {
    return Promise.resolve(MOCK_COURSES);
  }

  const response = await api.get<FetchMyCoursesResponse>("/api/v1/members/me/courses"); //최신 저장순 파라미터? 연결  테스트 후 도입?
  return response.data.result.courseList;
};

export const deleteMyCourses = async (courseIds: number[]): Promise<DeleteMyCoursesResponse> => {
  if (USE_MOCK) {
    return Promise.resolve({
      isSuccess: true,
      code: "COMMON200",
      message: `${courseIds.length}개의 코스가 삭제되었습니다.`,
    });
  }

  // 현재 코스 1개씩 삭제(백엔드와 상의)
  for (const courseId of courseIds) {
    await api.delete(`/api/v1/members/me/courses/${courseId}`);
  }
  return {
    isSuccess: true,
    code: "COMMON200",
    message: `${courseIds.length}개의 코스가 삭제되었습니다.`,
  };
};