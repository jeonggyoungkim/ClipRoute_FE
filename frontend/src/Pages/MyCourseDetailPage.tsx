import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GoogleMap from "../components/GoolgeMap";
import DetailHeader from "../components/mycourse/DetailHeader";
import PlaceBottomSheet from "../components/course/PlaceBottomSheet";
import { fetchMyCourseDetail, updateMyCourseDetail } from "../api/myCourse";
import type { MyCourseDetail } from "../types/mycourse";
import DeleteButton from "../components/common/DeleteButton";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";
export default function MyCourseDetailPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [courseDetail, setCourseDetail] = useState<MyCourseDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);



    const [places, setPlaces] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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


                const response: any = await fetchMyCourseDetail(targetId);

                if (response?.result) {
                    setCourseDetail(response.result);
                } else {
                    setCourseDetail(response);
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
            // 편집 모드 진입
            setIsEditMode(true);
            return;
        }

        // 편집 완료 (저장)
        try {
            if (!courseDetail || !courseId) return;


            // Day별로 그룹화
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

                // 각 장소 데이터를 items 구조로 변환
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

            console.log("💾 저장 Payload:", payload);

            //  API 호출
            const response = await updateMyCourseDetail(courseId, payload);

            if (response.isSuccess) {
                // 성공 시 데이터 갱신 및 모드 종료
                setCourseDetail(response.result); // 응답으로 온 최신 데이터 반영
                setIsEditMode(false);
                alert("코스가 저장되었습니다.");
            }

        } catch (error) {
            console.error("저장 실패:", error);
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    if (isLoading || !courseDetail) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <p className="text-gray-500">불러오는 중...</p>
            </div>
        );
    }




    // 지도 표시용 데이터 (state 기반)


    // 날짜 데이터 API에 없으면 임시 값 사용
    const dateRange = "2026.01.26 - 01.28";


    return (
        <div className="h-screen flex flex-col bg-white relative overflow-hidden">
            {/* 헤더 */}
            <DetailHeader
                region={courseDetail.regionName}
                title={courseDetail.courseTitle || courseDetail.videoTitle}
                date={dateRange}
                onBack={() => navigate(-1)}
                onEdit={handleSave}
                isEditMode={isEditMode}
            />


            <div className="flex-1 w-full h-full">
                <GoogleMap places={mapPlaces} />
            </div>



            <PlaceBottomSheet
                places={places}
                title={courseDetail.courseTitle || "내 코스 정리"}
                isEditMode={isEditMode}
                setPlaces={setPlaces}
                selectedItems={selectedItems}
                onToggleSelect={handleToggleSelect}
                onDaySelect={handleDaySelect}
            />


            {/* 삭제 버튼 (편집 모드 + 선택된 항목이 있을 때만 표시) */}
            {isEditMode && selectedItems.size > 0 && (
                <DeleteButton
                    count={selectedItems.size}
                    onClick={handleRemoveSelected}
                // 위치 등 스타일 조정이 필요하다면 className 추가
                />
            )}

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
