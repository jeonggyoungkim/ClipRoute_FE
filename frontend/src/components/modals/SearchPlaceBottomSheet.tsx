import { useRef, useEffect } from "react";
import Checkbox from "../common/Checkbox";
import shareIcon from "../../assets/icons/share-icon.svg";

interface SearchPlaceBottomSheetProps {
    places: any[];
    selectedPlace: any | null;
    onSelect: (place: any) => void;
    onAdd: () => void;
    regionName?: string;
}

const SearchPlaceBottomSheet = ({
    places,
    selectedPlace,
    onSelect,
    onAdd,
    regionName = "검색된"
}: SearchPlaceBottomSheetProps) => {
    const listRef = useRef<HTMLDivElement>(null);

    // 검색 결과가 바뀌면 스크롤 맨 위로 이동
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = 0;
        }
    }, [places]);

    return (
        <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-white rounded-t-[24px] shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-20 flex flex-col animate-slide-up">
            {/* 드래그 핸들 */}
            <div className="w-full flex justify-center pt-[10px] pb-[20px]">
                <div className="w-[3.75rem] h-[0.1875rem] bg-[#E4E4E4] rounded-full" />
            </div>

            {/* 헤더 */}
            <div className="px-5 py-3 flex-shrink-0">
                <h3 className="text-[16px] font-bold text-[#333]">
                    {regionName} 장소 리스트
                </h3>
            </div>

            {/* 장소 리스트 */}
            <div className="flex-1 overflow-y-auto px-5 scrollbar-hide" ref={listRef}>
                {places.length > 0 ? (
                    places.map((place) => {
                        const isSelected = selectedPlace?.placeId === place.placeId;
                        return (
                            <div
                                key={place.placeId}
                                className="flex items-center py-4 border-b border-gray-100 last:border-0 cursor-pointer"
                                onClick={() => onSelect(place)}
                            >
                                {/* 체크박스 */}
                                <div className="mr-3 flex-shrink-0">
                                    <Checkbox
                                        checked={isSelected}
                                        onChange={() => onSelect(place)}
                                    />
                                </div>

                                {/* 정보 */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className={`text-[16px] font-bold truncate ${isSelected ? 'text-[#333]' : 'text-[#333]'}`}>
                                            {place.placeName}
                                        </span>
                                        <span className="text-[13px] text-[#42BCEB] flex-shrink-0">#{place.category}</span>
                                    </div>
                                    <p className="text-[13px] text-[#999] truncate">
                                        {place.address || "주소 정보가 없습니다"}
                                    </p>
                                </div>

                                {/* 외부 링크 버튼 */}
                                <button
                                    className="p-2 ml-1 text-gray-400 hover:text-[#42BCEB] flex-shrink-0"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // 외부 링크 연결 로직
                                    }}
                                >
                                    <img src={shareIcon} alt="link" className="w-[18px] h-[18px]" />
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2 mt-10">
                        <p>조건에 맞는 장소가 없습니다.</p>
                    </div>
                )}
            </div>

            {/* 하단 고정 버튼 영역 */}
            <div className="p-5 bg-white pb-8">
                <button
                    onClick={onAdd}
                    disabled={!selectedPlace}
                    className={`w-full py-3.5 rounded-xl text-[16px] font-bold transition-all shadow-sm ${selectedPlace
                        ? 'bg-[#42BCEB] text-white hover:bg-[#3aa8d4]'
                        : 'bg-gray-200 text-white cursor-not-allowed'
                        }`}
                >
                    장소 추가
                </button>
            </div>
        </div>
    );
};

export default SearchPlaceBottomSheet;
