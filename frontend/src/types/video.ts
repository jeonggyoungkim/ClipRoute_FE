export interface CourseListResult {
  courseList: Course[];
  totalElements: number;
  sort: string;
  sliceInfo: {
    currentPage: number;
    size: number;
    hasNext: boolean;
  };
}

export interface Course {
  courseId: number;
  thumbnailUrl: string;
  channelName: string;
  videoTitle: string;
  travelDays: number;
  regionId: number;
  regionName: string;
  isRecommended: boolean;
}

export interface CourseQueryParams {
  regionId?: number | null;
  travelDays?: number | null;
  sort?: string;
  pageSize?: number;
  lastCourseId?: number;
  lastValue?: string;
}