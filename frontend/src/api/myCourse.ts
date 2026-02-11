import { MOCK_COURSES } from "../mock/mycoursedata";

export const fetchMyCourses = async () => {
  // 나중에 axios 교체
  return Promise.resolve(MOCK_COURSES);
};
