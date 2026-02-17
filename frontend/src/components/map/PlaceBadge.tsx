import { CATEGORIES } from "../../constants/categories";

interface PlaceBadgeProps {
    name: string;
    category: string;
}

const PlaceBadge = ({ name, category }: PlaceBadgeProps) => {
    // 카테고리 아이콘 찾기
    const catInfo = CATEGORIES.find(c => c.id === category || c.name === category) || CATEGORIES.find(c => c.id === "기타");
    const icon = catInfo?.icon;

    return (
        <div className="relative flex items-center bg-[#42BCEB] text-white rounded-full pl-[0.2rem] pr-2 gap-1.5 min-w-max cursor-pointer hover:bg-[#3aaad6] transition-colors h-[1.5rem] shadow-sm border border-transparent">
            {/* 둥근 아이콘 배경 */}
            <div className="flex items-center justify-center w-[1.1rem] h-[1.1rem] bg-white rounded-full text-[#42BCEB] flex-shrink-0">
                {icon ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        {icon}
                    </svg>
                ) : (
                    <div className="w-1.5 h-1.5 bg-[#42BCEB] rounded-full" />
                )}
            </div>

            {/* 장소명 */}
            <span className="text-[0.75rem] font-bold truncate max-w-[120px] leading-none pt-[1px]">{name}</span>

            {/* 하단 꼬리 */}
            {/* <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-[#42BCEB]" /> */}
        </div>
    );
};

export default PlaceBadge;
