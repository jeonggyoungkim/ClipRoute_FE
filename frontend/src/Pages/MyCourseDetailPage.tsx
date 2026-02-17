import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GoogleMap from "../components/GoogleMap";
import DetailHeader from "../components/mycourse/DetailHeader";
import PlaceBottomSheet from "../components/course/PlaceBottomSheet";
import { fetchMyCourseDetail, updateMyCourseDetail } from "../api/myCourse";
import type { MyCourseDetail } from "../types/mycourse";
import DeleteButton from "../components/common/DeleteButton";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";
import CourseInfoEditModal from "../components/modals/CourseInfoEditModal";
import DateSelectModal from "../components/modals/DateSelectModal";
import PlaceLinkLayer from "../components/mycourse/PlaceLinkLayer";
import AddPlaceModal from "../components/modals/AddPlaceModal";
import AddPlaceButton from "../components/mycourse/AddPlaceButton";

export default function MyCourseDetailPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [courseDetail, setCourseDetail] = useState<MyCourseDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);

    const [places, setPlaces] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCourseInfoModalOpen, setIsCourseInfoModalOpen] = useState(false);
    const [isDateSelectModalOpen, setIsDateSelectModalOpen] = useState(false);
    const [isAddPlaceModalOpen, setIsAddPlaceModalOpen] = useState(false); // 장소 추가 모달 상태
    const [courseDateRange, setCourseDateRange] = useState("2026.01.26 - 01.28"); // 초기값
    const [activePlace, setActivePlace] = useState<{ place: any, rect: DOMRect } | null>(null); // 링크 연결 오버레이 상태

    // 코스 정보 수정 저장 (제목 변경)
    const handleCourseInfoSave = (newTitle: string, _newDate: string) => {
        // 날짜 변경은 handleDateSelect에서 처리됨. 여기선 제목만.
        if (courseDetail) {
            setCourseDetail({
                ...courseDetail,
                courseTitle: newTitle
            });
        }
        setIsCourseInfoModalOpen(false);
    };

    // 장소 추가 핸들러
    const handleAddPlace = () => {
        setIsAddPlaceModalOpen(true);
    };

    // 날짜 선택 완료 핸들러
    const handleDateSelect = ({ startDate, endDate }: { startDate: Date | null, endDate: Date | null }) => {
        if (!startDate) return;

        const format = (d: Date) => {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}.${m}.${day}`;
        };

        let newRange = format(startDate);
        if (endDate) {
            newRange += ` - ${format(endDate).slice(5)}`;
        }

        setCourseDateRange(newRange);
    };

    // 개별 장소 선택/해제 핸들러
    const handleToggleSelect = (placeId: number) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(placeId)) {
                newSet.delete(placeId);
            } else {
                newSet.add(placeId);
            }
            return newSet;
        });
    };

    // Day별 전체 선택/해제 핸들러
    const handleDaySelect = (day: number, isSelected: boolean) => {
        const targetPlaces = places.filter(p => p.day === day);
        const targetIds = targetPlaces.map(p => p.id);

        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (isSelected) {
                targetIds.forEach(id => newSet.add(id));
            } else {
                targetIds.forEach(id => newSet.delete(id));
            }
            return newSet;
        });
    };

    // 삭제 버튼 클릭 -> 모달 오픈
    const handleRemoveSelected = () => {
        if (selectedItems.size === 0) return;
        setIsDeleteModalOpen(true);
    };

    // 모달 확인 -> 실제 삭제
    const handleConfirmDelete = () => {
        setPlaces(prev => prev.filter(p => !selectedItems.has(p.id)));
        setSelectedItems(new Set());
        setIsDeleteModalOpen(false);
    };


    useEffect(() => {
        if (courseDetail) {
            const newPlaces = courseDetail.itineraries.flatMap((itinerary) =>
                itinerary.places.map((place) => ({
                    day: itinerary.visitDay,
                    id: place.placeId, // placeId 사용
                    coursePlaceId: place.coursePlaceId,
                    order: place.visitOrder,
                    name: String(place.placeName),
                    category: place.placeCategory,
                    address: place.address,
                    lat: place.lat,
                    lng: place.lng,
                }))
            );
            setPlaces(newPlaces);

            if (courseDetail.startDate && courseDetail.endDate) {
                const start = courseDetail.startDate.replace(/-/g, '.');
                const end = courseDetail.endDate.replace(/-/g, '.').slice(5);
                setCourseDateRange(`${start} - ${end}`);
            }
        }
    }, [courseDetail]);

    // 지도 표시용 데이터 (state 기반)
    const mapPlaces = places.map((p: any) => ({
        id: p.id,
        lat: p.lat,
        lng: p.lng,
        order: p.order,
        name: p.name,
    }));


    useEffect(() => {
        const loadDetail = async () => {
            try {
                setIsLoading(true);
                const targetId = courseId || "1";
                console.log(`[MyCourseDetailPage] 상세 정보 요청: ID=${targetId}`);

                const data = await fetchMyCourseDetail(targetId);

                if (data) {
                    console.log("[MyCourseDetailPage] 데이터 로드 성공:", data);
                    setCourseDetail(data);
                } else {
                    console.error("[MyCourseDetailPage] 데이터 로드 실패 (null 반환)");
                    // 필요 시 에러 상태 추가
                }
            } catch (error) {
                console.error("Failed to fetch course detail:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDetail();
    }, [courseId]);

    // 저장 버튼 핸들러
    const handleSave = async () => {
        if (!isEditMode) {
            setIsEditMode(true);
            return;
        }

        try {
            if (!courseDetail || !courseId) return;

            const placesByDay: { [key: number]: any[] } = {};
            places.forEach(place => {
                if (!placesByDay[place.day]) {
                    placesByDay[place.day] = [];
                }
                placesByDay[place.day].push(place);
            });

            const itineraries = Object.keys(placesByDay).map(dayStr => {
                const day = Number(dayStr);
                const dayPlaces = placesByDay[day];

                const items = dayPlaces.map((p, index) => ({
                    visitOrder: index + 1,
                    placeId: p.placeId || p.id,
                    coursePlaceId: p.coursePlaceId
                }));

                return {
                    visitDay: day,
                    places: items
                };
            });

            const payload = {
                courseTitle: courseDetail.courseTitle,
                travelStatus: courseDetail.travelStatus,
                regionId: courseDetail.regionId,
                itineraries: itineraries
            };

            const response = await updateMyCourseDetail(courseId, payload);

            if (response.isSuccess) {
                setCourseDetail(response.result);
                setIsEditMode(false);
                alert("코스가 저장되었습니다.");
            }

        } catch (error) {
            console.error("저장 실패:", error);
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <p className="text-gray-500">불러오는 중...</p>
            </div>
        );
    }

    if (!courseDetail) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-white gap-4">
                <p className="text-gray-500">코스 정보를 불러올 수 없습니다.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-gray-100 rounded-lg text-sm"
                >
                    뒤로 가기
                </button>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-white relative overflow-hidden">
            {/* 링크 연결 오버레이 */}
            {activePlace && (
                <PlaceLinkLayer
                    place={activePlace.place}
                    rect={activePlace.rect}
                    onClose={() => setActivePlace(null)}
                />
            )}

            {/* 헤더 */}
            <DetailHeader
                region={courseDetail.regionName}
                title={courseDetail.courseTitle || courseDetail.videoTitle}
                date={courseDateRange}
                onBack={() => navigate(-1)}
                onEdit={handleSave}
                isEditMode={isEditMode}
                onTitleClick={() => setIsCourseInfoModalOpen(true)}
            />

            <div className="flex-1 w-full h-full">
                <GoogleMap places={mapPlaces} />
            </div>

            {/* 장소 추가 버튼 (편집 모드 시 바텀시트 위에 플로팅) */}
            {isEditMode && (
                <div className="fixed bottom-6 right-5 z-30">
                    <AddPlaceButton onClick={handleAddPlace} />
                </div>
            )}

            <PlaceBottomSheet
                places={places}
                title="나의 코스 정리"
                isEditMode={isEditMode}
                setPlaces={setPlaces}
                selectedItems={selectedItems}
                onToggleSelect={handleToggleSelect}
                onDaySelect={handleDaySelect}
                onShareClick={(place: any, rect: DOMRect) => setActivePlace({ place, rect })}
            />

            {/* 삭제 버튼 (편집 모드 + 선택된 항목이 있을 때만 표시) */}
            {isEditMode && selectedItems.size > 0 && (
                <DeleteButton
                    count={selectedItems.size}
                    onClick={handleRemoveSelected}
                />
            )}

            {/* 장소 추가 모달 (전체 화면) */}
            <AddPlaceModal
                isOpen={isAddPlaceModalOpen}
                onClose={() => setIsAddPlaceModalOpen(false)}
                regionId={courseDetail?.regionId}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />

            <CourseInfoEditModal
                isOpen={isCourseInfoModalOpen}
                initialTitle={courseDetail.courseTitle || courseDetail.videoTitle}
                initialDate={courseDateRange}
                onClose={() => setIsCourseInfoModalOpen(false)}
                onSave={handleCourseInfoSave}
                onDateClick={() => setIsDateSelectModalOpen(true)}
            />

            <DateSelectModal
                isOpen={isDateSelectModalOpen}
                onClose={() => setIsDateSelectModalOpen(false)}
                onConfirm={handleDateSelect}
            />
        </div>
    );
}
