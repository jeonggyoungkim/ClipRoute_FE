import { useState, useEffect } from 'react';
import PlaceItem from './PlaceItem';

const PlaceBottomSheet = ({ places = [] }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  // 데이터 수신 확인 로그
  useEffect(() => {
    console.log(' [PlaceBottomSheet] 새로운 장소 데이터 수신:', places);
    if (!places || places.length === 0) {
      console.warn(' [PlaceBottomSheet] 표시할 장소 데이터가 비어있습니다.');
    }
  }, [places]);

  // 바텀시트 상태 로그
  useEffect(() => {
    console.log(`↔ [PlaceBottomSheet] 상태 변경: ${isOpen ? '열림(OPEN)' : '닫힘(CLOSE)'}`);
  }, [isOpen]);

  // 추출 및 정렬 로그
  const days = Array.from(new Set(places.map((p: any) => p.day))).sort();
  console.log('[PlaceBottomSheet] 렌더링될 Day 목록:', days);

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-20 bg-white rounded-t-[30px] shadow-[0_-8px_20px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-in-out"
      style={{ 
        height: '65vh', 
        transform: isOpen ? 'translateY(0)' : 'translateY(calc(65vh - 80px))' 
      }}
    >
      {/* 핸들러 영역: 클릭 시 토글 */}
      <div 
        className="flex flex-col items-center py-4 cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-[40px] h-[4px] bg-[#E5E5E5] rounded-full mb-3" />
        <h2 className="text-[18px] font-bold text-[#333] px-5 w-full text-left">
          영상 속 장소 및 코스 정리 ({places.length}곳)
        </h2>
      </div>

      <div className="px-5 pb-20 overflow-y-auto h-[calc(65vh-80px)] scrollbar-hide">
        {days.map((day: any) => (
          <div key={`day-section-${day}`} className="mb-6">
            <div className="flex items-center gap-2 mb-4 text-[#42BCEB] font-bold">
              <span>Day {day}</span>
              <div className="flex-1 h-[1px] bg-gray-100" />
            </div>
            
            {places
              .filter((p: any) => p.day === day)
              .map((place: any, index: number) => {
                // 중복 키 방지를 위해 key 조합 (ID가 없을 때 대비)
                const uniqueKey = place.id ? `place-${place.id}` : `place-${day}-${index}`;
                return <PlaceItem key={uniqueKey} place={place} />;
              })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaceBottomSheet;