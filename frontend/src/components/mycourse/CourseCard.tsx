interface CourseCardProps {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  locationCount: number;
  region: string;
  duration: string;
  thumbnailUrl: string;
  status: "current" | "completed";
  onClick: () => void;
}

export default function CourseCard({
  title,
  startDate,
  endDate,
  locationCount,
  region,
  duration,
  thumbnailUrl,
  onClick,
}: CourseCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E8E8] p-4">
      {/* 카드 헤더 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-3 flex-1">
          {/* 썸네일 */}
          <div className="w-[56px] h-[56px] rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={title}
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
                {title}
              </h3>
              <p className="text-sm text-black font-semibold mt-1">
                {startDate} - {endDate}
              </p>
            </div>
          </div>
        </div>

        {/* 상세 보기 버튼 */}
        <button
                    onClick={onClick}
                    className="flex items-center gap-1 text-[13px] text-black font-semibold mt-1 cursor-pointer"
                >
                    상세 보기
                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 9L5 5L1 1" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

      {/* 태그 영역 */}
      <div className="flex flex-wrap gap-2">
        <span className="text-[0.75rem] font-semibold text-[#34B1E9]  px-2 py-1">
          장소 개수 : {locationCount}개
        </span>
        <span className="text-[0.75rem] font-semibold text-[#34B1E9]  px-2 py-1 ">
          #{region}
        </span>
        <span className="text-[0.75rem] font-semibold text-[#34B1E9]  px-2 py-1 ">
          #{duration}
        </span>
      </div>
    </div>
  );
}