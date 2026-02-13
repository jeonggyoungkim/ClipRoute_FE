import type { ApiResponse } from "../types/common";

export interface CourseItem {
    courseId: number;
    memberCourseId: number;
    courseTitle: string;
    regionName: string;
    regionImageUrl: string;
    thumbnailUrl: string;
    startDate: string;
    endDate: string;
    travelDays: number;
    travelStatus: "BEFORE" | "ONGOING" | "COMPLETED";
    placeCount: number;
    createdAt: string;
}

export interface MyCoursesResult {
    courseList: CourseItem[];
    sort: string;
    sliceInfo: {
        currentPage: number;
        size: number;
        hasNext: boolean;
    };
}

export type FetchMyCoursesResponse = ApiResponse<MyCoursesResult>;

export interface DeleteMyCoursesResponse {
    isSuccess: boolean;
    code: string;
    message: string;
}