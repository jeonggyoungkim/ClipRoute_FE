import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import Header from "../components/common/Header";
import NavigationLayout from "../layouts/NavigationLayout";
import backicon from "../assets/icons/back-icon.svg";
import MyCourseTabs from "../components/mycourse/MyCourseTabs";
import MyCourseFilters from "../components/mycourse/MyCourseFilters";
import MyCourseContent from "../components/mycourse/MyCourseContent";
import { fetchMyCourses } from "../api/myCourse";
import type { CourseItem } from "../types/mycourse";
import { useDeleteCourses } from "../hooks/useDeleteCourses";
import DeleteButton from "../components/common/DeleteButton";
import DeleteModal from "../components/common/DeleteModal";

type TabType = "current" | "completed";

export default function MyCoursePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { handleDelete, isDeleting } = useDeleteCourses();

  const [activeTab, setActiveTab] = useState<TabType>("current");
  const [sortBy, setSortBy] = useState<"recent" | "progress">("recent");
  const [filterBy, setFilterBy] = useState<"all" | "favorite">("all");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

  // React Query: 무한 스크롤 적용
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['myCourses', sortBy], // 정렬 기준이 바뀌면 다시 호출
    queryFn: ({ pageParam }) => fetchMyCourses(sortBy, pageParam as number | undefined, 5), // 5개씩 가져오기
    initialPageParam: undefined,
    getNextPageParam: (lastPage: any) => {
      // 다음 페이지가 있는지 확인 (백엔드 응답 의존)
      if (!lastPage?.sliceInfo?.hasNext) {
        return undefined;
      }

      // 마지막 코스의 ID 찾기 (커서)
      const list = lastPage.courseList;
      if (list && list.length > 0) {
        const lastItem = list[list.length - 1];
        // memberCourseId 또는 courseId 사용 (API 명세에 따라 lastMemberCourseId이므로 memberCourseId 사용 추정)
        const nextCursor = lastItem.memberCourseId;
        console.log(`👉 [커서 계산] Next Cursor: ${nextCursor}`);
        return nextCursor;
      }

      return undefined;
    },
    refetchOnMount: 'always',
    staleTime: 0,
  });

  // 모든 페이지의 데이터를 하나로 합침
  const courses = useMemo(() => {
    return data?.pages.flatMap((page: any) => page.courseList || []) || [];
  }, [data]);


  const filteredCourses = useMemo(() => {
    if (activeTab === "current") {
      // 여행 전 탭: BEFORE, ONGOING
      return courses.filter(c =>
        c.travelStatus === "BEFORE" ||
        c.travelStatus === "ONGOING"
      );
    }
    // 여행 후 탭: AFTER, COMPLETED
    return courses.filter(c =>
      c.travelStatus === "AFTER" ||
      c.travelStatus?.trim() === "AFTER" ||
      c.travelStatus === "COMPLETED"
    );
  }, [activeTab, courses]);

  const isEmptyCurrentCourses = filteredCourses.length === 0;

  const groupedCourses = useMemo(() => {
    const groups: Record<string, CourseItem[]> = {};
    filteredCourses.forEach(course => {
      // startDate가 유효한지 확인하고 안전하게 처리
      const yearMonth = (course.startDate && course.startDate.includes('.'))
        ? (() => {
          try {
            const dateParts = course.startDate.split('.');
            return `${dateParts[0]}.${dateParts[1]} `;
          } catch (e) {
            return '날짜 오류';
          }
        })()
        : '날짜 미정'; // null이거나 형식이 안 맞으면

      if (!groups[yearMonth]) {
        groups[yearMonth] = [];
      }
      groups[yearMonth].push(course);
    });

    return Object.entries(groups).sort((a, b) => {
      if (a[0] === '날짜 미정') return -1; // 날짜 미정은 맨 위로? 혹은 맨 아래로
      if (b[0] === '날짜 미정') return 1;
      return b[0].localeCompare(a[0]);
    });
  }, [filteredCourses]);

  // 무한 스크롤 (IntersectionObserver)
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 맨 위로 이동
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteCourses = async () => {
    const success = await handleDelete(selectedCourses);
    if (success) {
      // React Query 캐시 무효화하여 데이터 다시 가져오기
      queryClient.invalidateQueries({ queryKey: ['myCourses'] });
      setSelectedCourses([]);
      setIsEditMode(false);
      setIsModalOpen(false);
    }
  };


  if (isLoading) {
    return (
      <NavigationLayout activeTab="course">
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">코스 불러오는 중...</p>
        </div>
      </NavigationLayout>
    );
  }

  return (
    <NavigationLayout activeTab="course" hideNavigation={isEditMode}>
      <div className="min-h-screen bg-white flex flex-col pb-24 relative">

        <Header
          left={
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate(-1)}
                className="p-1 active:opacity-50 transition-opacity"
                aria-label="뒤로가기"
              >
                <img src={backicon} alt="back" className="w-4 h-4" />
              </button>
              <h1 className="text-m font-bold text-black tracking-tight">
                내 코스
              </h1>
            </div>
          }
          right={
            <button
              onClick={() => {
                setIsEditMode(!isEditMode);
                setSelectedCourses([]);
              }}
              className="text-sm font-bold text-black px-2 active:opacity-50">
              {isEditMode ? "완료" : "편집"}
            </button>
          }
        />

        <MyCourseTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {!isEmptyCurrentCourses && (
          <MyCourseFilters
            sortBy={sortBy}
            setSortBy={setSortBy}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
          />
        )}

        <MyCourseContent
          groupedCourses={groupedCourses}
          isEmptyCurrentCourses={isEmptyCurrentCourses}
          isEditMode={isEditMode}
          selectedCourses={selectedCourses}
          onNavigateToCourse={(courseId) => navigate(`/mycourse/${courseId}`)}
          onSelectCourse={(courseId) => {
            setSelectedCourses(prev =>
              prev.includes(courseId)
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
            );
          }}
        />

        {/* 무한 스크롤 감지 영역 (로딩 표시) */}
        <div ref={observerRef} className="h-10 flex justify-center items-center py-4 text-xs text-gray-300">
          {/* 하단 여백 및 감지용 투명 박스 */}
          {isFetchingNextPage && <span>로딩 중...</span>}
        </div>

        {isEditMode && (
          <DeleteButton
            count={selectedCourses.length}
            onClick={() => setIsModalOpen(true)}
            isLoading={isDeleting}
          />
        )}

        <DeleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDeleteCourses}
        />

        {!isEmptyCurrentCourses && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-24 right-5 bg-white border border-gray-200 rounded-full p-3 shadow-lg active:scale-95 transition-transform z-50"
            aria-label="맨 위로"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
        )}
      </div>
    </NavigationLayout>
  );
}