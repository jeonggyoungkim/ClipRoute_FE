interface MyCourseFiltersProps {
    sortBy: "recent" | "progress";
    setSortBy: (value: "recent" | "progress") => void;
    filterBy: "all" | "favorite";
    setFilterBy: (value: "all" | "favorite") => void;
}

export default function MyCourseFilters({
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
}: MyCourseFiltersProps) {
    return (
        <div className="px-5 py-4 flex justify-end gap-[1.25rem] items-center bg-white">
            {/* 지역 필터 */}
            <div className="inline-flex justify-center items-center gap-[0.3125rem] relative cursor-pointer">
                <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as "all" | "favorite")}
                    className="appearance-none bg-transparent pr-[1.4rem] z-10 cursor-pointer text-[#606060] font-medium text-[0.875rem] leading-[1.5rem]"
                    style={{ fontFamily: 'Pretendard' }}
                >
                    <option value="all">지역</option>
                    <option value="favorite">즐겨찾기</option>
                </select>
                <div className="absolute right-0 flex w-[1.125rem] h-[1.125rem] items-center justify-center p-[0.46875rem] rotate-[-90deg] pointer-events-none">
                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                        <path d="M5 1L1 5L5 9" stroke="#606060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {/* 여행 기간 필터 */}
            <div className="inline-flex justify-center items-center gap-[0.3125rem] relative cursor-pointer">
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "recent" | "progress")}
                    className="appearance-none bg-transparent pr-[1.4rem] z-10 cursor-pointer text-[#606060] font-medium text-[0.875rem] leading-[1.5rem]"
                    style={{ fontFamily: 'Pretendard' }}
                >
                    <option value="recent">여행 기간</option>
                    <option value="progress">진행률</option>
                </select>
                <div className="absolute right-0 flex w-[1.125rem] h-[1.125rem] items-center justify-center p-[0.46875rem] rotate-[-90deg] pointer-events-none">
                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                        <path d="M5 1L1 5L5 9" stroke="#606060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
}