import type { Course } from "../components/mycourse/MyCourseContent";

export const MOCK_COURSES: Course[] = [
  {
    id: 1,
    title: "부산 (1)",
    startDate: "2026.01.26",
    endDate: "01.28",
    locationCount: 4,
    region: "부산",
    duration: "2박 3일",
    thumbnailUrl: "https://images.unsplash.com/photo-1634547986064-072d6551069d?q=80&w=200&auto=format&fit=crop",
    status: "current"
  },
  {
    id: 2,
    title: "제목",
    startDate: "2026.12.20",
    endDate: "12.22",
    locationCount: 5,
    region: "지역명",
    duration: "여행 기간",
    thumbnailUrl: "",
    status: "completed"
  },
  {
    id: 3,
    title: "제목",
    startDate: "2026.12.15",
    endDate: "12.16",
    locationCount: 3,
    region: "지역명",
    duration: "여행 기간",
    thumbnailUrl: "",
    status: "completed"
  },
  {
    id: 4,
    title: "제목",
    startDate: "202.12.10",
    endDate: "12.12",
    locationCount: 3,
    region: "지역명",
    duration: "여행 기간",
    thumbnailUrl: "",
    status: "completed"
  }
];
