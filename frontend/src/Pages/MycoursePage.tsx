import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import NavigationLayout from "../layouts/NavigationLayout";
import backicon from "../assets/icons/back-icon.svg";
import MyCourseTabs from "../components/mycourse/MyCourseTabs";
import MyCourseFilters from "../components/mycourse/MyCourseFilters";
import MyCourseContent, { type Course } from "../components/mycourse/MyCourseContent";
import { fetchMyCourses } from "../api/myCourse";

type TabType = "current" | "completed";

export default function MyCoursePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("current");
  const [sortBy, setSortBy] = useState<"recent" | "progress">("recent");
  const [filterBy, setFilterBy] = useState<"all" | "favorite">("all");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      const data = await fetchMyCourses();
      setCourses(data);
      setIsLoading(false);
    };

    loadCourses();
  }, []);


  const filteredCourses = useMemo(() => {
    if (activeTab === "current") {
      return courses.filter(c => c.status === "current");
    }
    return courses.filter(c => c.status === "completed");
  }, [activeTab, courses]);

  const isEmptyCurrentCourses = filteredCourses.length === 0;


  const groupedCourses = useMemo(() => {
    const groups: Record<string, Course[]> = {};
    filteredCourses.forEach(course => {
      const dateParts = course.startDate.split('.');
      const yearMonth = `${dateParts[0]}.${dateParts[1]}`;

      if (!groups[yearMonth]) {
        groups[yearMonth] = [];
      }
      groups[yearMonth].push(course);
    });

    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredCourses]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <NavigationLayout activeTab="course">
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
  onNavigateToCourse={(courseId) => navigate(`/course/${courseId}`)}
  onSelectCourse={(courseId) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  }}
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
