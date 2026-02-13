import type { CourseItem } from "../../types/mycourse";

interface CourseCardProps extends CourseItem {
  onClick: () => void;
  isEditMode?: boolean;
  isSelected?: boolean;
}

export default function CourseCard({
  courseTitle,
  startDate,
  endDate,
  placeCount,
  regionName,
  travelDays,
  thumbnailUrl,
  onClick,
  isEditMode = false,
  isSelected = false,
}: CourseCardProps) {
  const formatDuration = (days: number) => {
    return `${days - 1}박 ${days}일`;
  };

  return (
    <div
      className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all ${isSelected ? "border-[#42BCEB] bg-blue-50" : "border-[#E8E8E8]"
        }`}
      onClick={onClick}
    >
      {/* 카드 헤더 */}
      <div className="flex items-start justify-between mb-3">
        {/* 체크박스 (편집 모드일 때만) */}
        {isEditMode && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="w-5 h-5 mr-2 cursor-pointer"
          />
        )}

        <div className="flex gap-3 flex-1">
          {/* 썸네일 */}
          <div className="w-[56px] h-[56px] rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={courseTitle}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-300 text-xs">No Image</span>
              </div>
            )}
          </div>

          {/* 정보 */}
          <div className="flex flex-col justify-between flex-1">
            <div>
              <h3 className="text-m font-bold text-black leading-tight mt-1">
                {courseTitle}
              </h3>
              <p className="text-sm text-black font-semibold mt-1">
                {startDate} - {endDate}
              </p>
            </div>
          </div>
        </div>

        {/* 상세 보기 버튼 (편집 모드 아닐 때만) */}
        {!isEditMode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="flex items-center gap-1 text-[13px] text-black font-semibold mt-1 cursor-pointer"
          >
            상세 보기
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 9L5 5L1 1" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {/* 태그 영역 */}
      <div className="flex flex-wrap gap-2">
        <span className="text-[0.75rem] font-semibold text-[#34B1E9] px-2 py-1">
          장소 개수 : {placeCount}개
        </span>
        <span className="text-[0.75rem] font-semibold text-[#34B1E9] px-2 py-1">
          #{regionName}
        </span>
        <span className="text-[0.75rem] font-semibold text-[#34B1E9] px-2 py-1">
          #{formatDuration(travelDays)}
        </span>
      </div>
    </div>
  );
}