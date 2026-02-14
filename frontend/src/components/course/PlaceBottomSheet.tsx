import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import PlaceItem from './PlaceItem';
import Checkbox from '../common/Checkbox';

const PlaceBottomSheet = ({
  places = [],
  title = "영상 속 장소 및 코스 정리",
  isEditMode = false,
  setPlaces,
  selectedItems = new Set(),
  onToggleSelect = () => { },
  onDaySelect = () => { }
}: any) => {
  const [isOpen, setIsOpen] = useState(false);



  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !setPlaces) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const newPlaces: any[] = Array.from(places);
    const [moved] = newPlaces.splice(sourceIndex, 1);
    newPlaces.splice(destinationIndex, 0, moved);

    let newDay = moved.day;
    if (destinationIndex === 0) {
      if (newPlaces.length > 1) {
        newDay = newPlaces[1].day;
      }
    } else {
      newDay = newPlaces[destinationIndex - 1].day;
    }
    moved.day = newDay;

    const dayCounters: { [key: number]: number } = {};
    const reorderedPlaces = newPlaces.map((place: any) => {
      const currentCount = dayCounters[place.day] || 0;
      dayCounters[place.day] = currentCount + 1;
      return {
        ...place,
        order: dayCounters[place.day]
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
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="course-places">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {places.map((place: any, index: number) => {
                    const isFirstOfDay = index === 0 || places[index - 1].day !== place.day;
                    const draggableId = place.id ? `place-${place.id}` : `place-idx-${index}`;

                    // 현재 Day의 모든 장소가 선택되었는지 확인
                    const isDayAllSelected = places
                      .filter((p: any) => p.day === place.day)
                      .every((p: any) => selectedItems.has(p.id));

                    return (
                      <div key={draggableId}>
                        {isFirstOfDay && (
                          <div className="flex items-center gap-2 mb-4 mt-6 first:mt-0 text-[#42BCEB] font-bold">
                            {isEditMode && (
                              <div className="mr-2">
                                <Checkbox
                                  checked={isDayAllSelected}
                                  onChange={() => onDaySelect(place.day, !isDayAllSelected)}
                                />
                              </div>
                            )}
                            <span>Day {place.day}</span>
                            <div className="flex-1 h-[1px] bg-gray-100" />
                          </div>
                        )}
                        <Draggable draggableId={draggableId} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="bg-white"
                            >
                              <PlaceItem
                                place={place}
                                isEditMode={isEditMode}
                                dragHandleProps={provided.dragHandleProps}
                                isChecked={selectedItems.has(place.id)}
                                onToggle={() => onToggleSelect(place.id)}
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