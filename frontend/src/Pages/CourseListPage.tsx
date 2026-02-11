import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import NavigationLayout from "../layouts/NavigationLayout";
import Header from "../components/common/Header";
import backicon from "../assets/icons/back-icon.svg";
import mappinicon from "../assets/icons/mappin-icon.svg";
import calendaricon from "../assets/icons/calendar-icon.svg";
import VideoCard from "../components/VideoCard";
import { fetchCourses } from "../api/courses";

const CourseListPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ✅ URL에서 필요한 값만 가져오기
  const startDateStr = searchParams.get("startDate");
  const endDateStr = searchParams.get("endDate");
  const regionIdParam = searchParams.get("regionId");
  const travelDaysParam = searchParams.get("travelDays");

  const regionId = regionIdParam ? Number(regionIdParam) : null;
  const travelDays = travelDaysParam !== null ? Number(travelDaysParam) : null;

  // ✅ 데이터 패칭
  const { data, isLoading, isError } = useQuery({
    queryKey: ["courseList", regionId, travelDays],
    queryFn: () =>
      fetchCourses({
        pageParam: 0,
        destination: regionId ? { regionId } : null,
        travelDays: travelDays,
        isFilterMode: true,
        isRep: true,
      }),
  });

  if (isLoading)
    return (
      <div className="p-10 text-center font-medium">
        로딩 중...
      </div>
    );

  if (isError)
    return (
      <div className="p-10 text-center text-red-500 font-medium">
        에러가 발생했습니다.
      </div>
    );

  const courseList = data?.result?.courseList || [];

  // ✅ 지역 이름 — 서버 데이터 기준이 정답
  const displayRegionName =
    courseList.length > 0
      ? courseList[0].regionName
      : regionId
      ? `${regionId}번 지역`
      : "전체 지역";

  // ✅ 헤더용 일정 문구
  const headerDaysText =
    travelDays === 0
      ? "당일치기"
      : travelDays === null
      ? ""
      : `${travelDays}박 ${travelDays + 1}일`;

  const headerTitle = `${displayRegionName} ${headerDaysText} 여행 코스`.trim();

  // ✅ 날짜 포맷 함수
  function formatDate(dateStr: string | null) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(d.getDate()).padStart(2, "0")}`;
  }

  // ✅ 입력 카드용 날짜 문구
  const getFormattedDateRange = () => {
    if (travelDays === null) return "날짜 미지정 (전체 일정)";
    if (travelDays === 0) return "당일치기 여행";

    if (startDateStr && endDateStr) {
      const start = formatDate(startDateStr);
      const end = formatDate(endDateStr).slice(5);
      return `${start} - ${end} [${travelDays}박 ${
        travelDays + 1
      }일]`;
    }

    return `${travelDays}박 ${travelDays + 1}일`;
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <NavigationLayout activeTab="home">
      <div className="bg-white min-h-screen">
        <Header
          left={
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)}>
                <img src={backicon} alt="back" className="w-4 h-4" />
              </button>
              <h1 className="font-bold text-base">{headerTitle}</h1>
            </div>
          }
        />

        <main className="px-5 pt-6 pb-24">
          {/* 입력 정보 카드 */}
          <div className="border border-[#42BCEB] rounded-2xl py-1 px-[15px] bg-white mb-8">
            <div className="flex items-center gap-3 py-4 border-b border-gray-100">
              <img src={mappinicon} alt="location" className="w-6 h-6" />
              <span className="text-sm text-gray-900 font-medium">
                {displayRegionName}
              </span>
            </div>
            <div className="flex items-center gap-3 py-4">
              <img src={calendaricon} alt="calendar" className="w-6 h-6" />
              <span className="text-sm text-gray-900 font-medium">
                {getFormattedDateRange()}
              </span>
            </div>
          </div>

          {/* 추천 섹션 헤더 */}
          <div className="mb-4">
            <h2 className="font-bold text-lg mb-1">
              {displayRegionName} 여행 추천
            </h2>
            <p className="text-sm text-gray-400">
              조건에 맞는 여행 코스를 추천했어요!
            </p>
          </div>

          {/* 비디오 리스트 */}
          <div className="space-y-4">
            {courseList.length > 0 ? (
              courseList.map((course) => (
                <VideoCard
                  key={course.courseId}
                  course={course}
                  onClick={() =>
                    navigate(`/courses/${course.courseId}`)
                  }
                />
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">
                여행 코스가 없습니다.
              </div>
            )}
          </div>
        </main>

        {/* Top 버튼 */}
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-24 right-5 bg-white border border-[#42BCEB] rounded-full p-3 shadow-lg z-50 w-12 h-12 flex items-center justify-center"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 15L12 8L19 15"
              stroke="#42BCEB"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </NavigationLayout>
  );
};

export default CourseListPage;
