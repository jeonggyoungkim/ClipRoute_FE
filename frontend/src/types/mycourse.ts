import type { ApiResponse } from "../types/common";

export interface CourseItem {
    courseId: number;
    memberCourseId: number;
    courseTitle: string;
    regionName: string;
    regionImageUrl: string;
    thumbnailUrl: string;
    startDate: string | null
    endDate: string | null;
    travelDays: number;
    travelStatus: "BEFORE" | "ONGOING" | "COMPLETED" | "AFTER";
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

// 나의 코스 상세 조회 및 수정 타입 

// 나의 코스 각 장소의 상세 정보
export interface MyCoursePlace {
    visitOrder: number;
    coursePlaceId: number;
    placeId: number;
    placeName: string;
    placeCategory: string;
    address: string;
    lat: number;
    lng: number;
    timestamp: string | null;
    deletedAt: string | null;
}

// 나의 코스 일차별 일정 (여행 일차와 해당 일차에 방문할 장소 목록 그룹화)
export interface MyCourseItinerary {
    visitDay: number;
    places: MyCoursePlace[];
}

// 특정 코스의 제목, 여행 기간, 상태, 스크랩 여부 등 전체 상세 정보
export interface MyCourseDetail {
    courseId: number;
    videoTitle: string;
    videoUrl: string;
    thumbnailUrl: string;
    channelName: string;
    regionId: number;
    regionName: string;
    isScrapped: boolean;
    travelStatus: "BEFORE" | "ONGOING" | "COMPLETED" | "AFTER";
    courseTitle: string;
    startDate: string;
    endDate: string;
    itineraries: MyCourseItinerary[];
}

export type MyCourseDetailResponse = ApiResponse<MyCourseDetail>;