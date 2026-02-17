import { useState, useRef, useEffect } from "react";
import chevronDown from "../../assets/icons/chevrondown-icon.svg";
import chevronUp from "../../assets/icons/chevronup-icon.svg";

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
    const [isRegionOpen, setIsRegionOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    const regionRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (regionRef.current && !regionRef.current.contains(event.target as Node)) {
                setIsRegionOpen(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="px-5 py-4 flex justify-end gap-[0.94rem] items-center bg-white">
            {/* 지역 필터 */}
            {/* 지역 필터 (Custom Dropdown) */}
            <div
                ref={regionRef}
                className="relative inline-flex items-center gap-[0.41rem] cursor-pointer"
                onClick={() => setIsRegionOpen(!isRegionOpen)}
            >
                <span className="text-[#606060] font-medium text-[0.875rem] leading-[1.5rem]">
                    {filterBy === 'all' ? '지역' : '즐겨찾기'}
                </span>
                <img
                    src={isRegionOpen ? chevronUp : chevronDown}
                    alt="toggle"
                    className="w-3 h-3"
                />

                {isRegionOpen && (
                    <ul className="absolute top-full right-0 mt-1 flex flex-col items-start gap-[0.9375rem] w-[6.25rem] p-[0.625rem_0.9375rem] bg-white border border-[#D2D2D2] rounded-[0.625rem] shadow-sm z-20">
                        <li
                            className={`text-[0.875rem] font-medium leading-[0.875rem] cursor-pointer ${filterBy === 'all' ? 'text-[#606060]' : 'text-black'}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setFilterBy('all');
                                setIsRegionOpen(false);
                            }}
                        >
                            지역
                        </li>
                        <li
                            className={`text-[0.875rem] font-medium leading-[0.875rem] cursor-pointer ${filterBy === 'favorite' ? 'text-[#606060]' : 'text-black'}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setFilterBy('favorite');
                                setIsRegionOpen(false);
                            }}
                        >
                            즐겨찾기
                        </li>
                    </ul>
                )}
            </div>

            {/* 여행 기간 필터 */}
            {/* 여행 기간 필터 (Custom Dropdown) */}
            <div
                ref={sortRef}
                className="relative inline-flex items-center gap-[0.31rem] cursor-pointer"
                onClick={() => setIsSortOpen(!isSortOpen)}
            >
                <span className="text-[#606060] font-medium text-[0.875rem] leading-[1.5rem]">
                    {sortBy === 'recent' ? '여행 기간' : '진행률'}
                </span>
                <img
                    src={isSortOpen ? chevronUp : chevronDown}
                    alt="toggle"
                    className="w-3 h-3"
                />

                {isSortOpen && (
                    <ul className="absolute top-full right-0 mt-1 flex flex-col items-start gap-[0.9375rem] w-[6.25rem] p-[0.625rem_0.9375rem] bg-white border border-[#D2D2D2] rounded-[0.625rem] shadow-sm z-20">
                        <li
                            className={`text-[0.875rem] font-medium leading-[0.875rem] cursor-pointer whitespace-nowrap ${sortBy === 'recent' ? 'text-[#606060]' : 'text-black'}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSortBy('recent');
                                setIsSortOpen(false);
                            }}
                        >
                            여행 기간
                        </li>
                        <li
                            className={`text-[0.875rem] font-medium leading-[0.875rem] cursor-pointer whitespace-nowrap ${sortBy === 'progress' ? 'text-[#606060]' : 'text-black'}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSortBy('progress');
                                setIsSortOpen(false);
                            }}
                        >
                            진행률
                        </li>
                    </ul>
                )}
            </div>
        </div>
    );
}