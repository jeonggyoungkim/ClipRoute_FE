import type { Course, CourseListResult, ApiResponse } from '../types/video';

export const generateMockCourses = (count: number): Course[] => {
  
  const regions = [
    { id: 1, name: '부산' },
    { id: 2, name: '강릉' },
    { id: 3, name: '제주' },
  ];
  
  const channels = ['채널명1', '채널명2', '채널명3', '채널명4', '채널명5'];

  const videotitles = ['여행 가자!', '게으른 p들을 위한 코스'];
  
  return Array.from({ length: count }, (_, i) => {
    const region = regions[i % regions.length];
    const days = Math.floor(Math.random() * 3) + 1;

    return {
      courseId: i + 1,
      thumbnailUrl: i % 3 === 0 ? '' : `https://picsum.photos/320/180?random=${i}`,
      channelName: channels[i % channels.length],
      videoTitle: videotitles[i % videotitles.length],
      travelDays: days,
      regionId: region.id,
      regionName: region.name,
      isRecommended: Math.random() > 0.7,
    };
  });
};

export const createMockResponse = (
  courses: Course[],
  totalElements: number,
  currentPage: number,
  pageSize: number,
  hasNext: boolean
): ApiResponse<CourseListResult> => {
  return {
    isSuccess: true,
    code: "200",
    message: "성공",
    result: {
      courseList: courses,
      totalElements,
      sort: "random",
      sliceInfo: {
        currentPage,
        size: pageSize,
        hasNext,
      },
    },
  };
};
