import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import PlaceItem from './PlaceItem';

const PlaceBottomSheet = ({ places = [], title = "영상 속 장소 및 코스 정리", isEditMode = false, setPlaces }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  // setPlaces가 없으면 에러 방지 (read-only fall back)
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !setPlaces) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const newPlaces: any[] = Array.from(places);
    const [moved] = newPlaces.splice(sourceIndex, 1);
    newPlaces.splice(destinationIndex, 0, moved);

    // 1. 이동한 위치의 날짜(Day) 결정 로직
    let newDay = moved.day;

    if (destinationIndex === 0) {
      // 맨 앞으로 이동: 그 다음 아이템의 날짜를 따라감 (없으면 유지)
      if (newPlaces.length > 1) {
        newDay = newPlaces[1].day;
      }
    } else {
      // 중간이나 끝으로 이동: 바로 앞 아이템의 날짜를 따라감
      newDay = newPlaces[destinationIndex - 1].day;
    }

    // 이동한 아이템의 Day 업데이트
    moved.day = newDay;

    // 2. 각 Day 내부에서의 순서(Order) 재정렬
    // (TIP: 백엔드 스펙상 Day별로 order가 1부터 다시 시작해야 함)

    // Day별 카운터 초기화
    const dayCounters: { [key: number]: number } = {};

    const reorderedPlaces = newPlaces.map((place: any) => {
      // 현재 Day의 카운터 가져오기 (없으면 0)
      const currentCount = dayCounters[place.day] || 0;

      // 카운터 증가
      dayCounters[place.day] = currentCount + 1;

      return {
        ...place,
        order: dayCounters[place.day] // 해당 Day에서의 순서 할당
      };
    });

    setPlaces(reorderedPlaces);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-20 bg-white rounded-t-[30px] shadow-[0_-8px_20px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-in-out"
      style={{
        height: '65vh',
        transform: isOpen ? 'translateY(0)' : 'translateY(calc(65vh - 80px))'
      }}
    >
      <div
        className="flex flex-col items-center py-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-[40px] h-[4px] bg-[#E5E5E5] rounded-full mb-3" />
        <h2 className="text-[18px] font-bold text-[#333] px-5 w-full text-left">
          {title}
        </h2>
      </div>

      <div className="px-5 pb-20 overflow-y-auto h-[calc(65vh-80px)] scrollbar-hide">
        {isEditMode ? (
          // 편집 모드: 전체 리스트 드래그 가능
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="course-places">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {places.map((place: any, index: number) => {
                    const isFirstOfDay = index === 0 || places[index - 1].day !== place.day;
                    const draggableId = place.id ? `place-${place.id}` : `place-idx-${index}`;

                    return (
                      <div key={draggableId}>
                        {isFirstOfDay && (
                          <div className="flex items-center gap-2 mb-4 mt-6 first:mt-0 text-[#42BCEB] font-bold">
                            <span>Day {place.day}</span>
                            <div className="flex-1 h-[1px] bg-gray-100" />
                          </div>
                        )}
                        <Draggable draggableId={draggableId} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="bg-white" // 드래그 시 배경 투명 방지
                            >
                              <PlaceItem
                                place={place}
                                isEditMode={isEditMode}
                                dragHandleProps={provided.dragHandleProps}
                              />
                            </div>
                          )}
                        </Draggable>
                      </div>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          // 일반 모드: 기존 날짜별 그룹핑 렌더링 (드래그 불가)
          places.map((place: any, index: number) => {
            const isFirstOfDay = index === 0 || places[index - 1].day !== place.day;
            const uniqueKey = place.id ? `view-place-${place.id}` : `view-place-${index}`;

            return (
              <div key={uniqueKey}>
                {isFirstOfDay && (
                  <div className="flex items-center gap-2 mb-4 mt-6 first:mt-0 text-[#42BCEB] font-bold">
                    <span>Day {place.day}</span>
                    <div className="flex-1 h-[1px] bg-gray-100" />
                  </div>
                )}
                <PlaceItem place={place} isEditMode={false} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PlaceBottomSheet;