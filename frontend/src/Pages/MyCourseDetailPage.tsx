import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GoogleMap from "../components/GoolgeMap";
import DetailHeader from "../components/mycourse/DetailHeader";
import PlaceBottomSheet from "../components/course/PlaceBottomSheet";
import { fetchMyCourseDetail, updateMyCourseDetail } from "../api/myCourse";
import type { MyCourseDetail } from "../types/mycourse";

export default function MyCourseDetailPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [courseDetail, setCourseDetail] = useState<MyCourseDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);


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

            // 1. places 데이터를 백엔드 API 스펙(itineraries)으로 변환
            // Day별로 그룹핑
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
                    visitOrder: index + 1, // 순서 재할당
                    placeId: p.placeId || p.id, // 기존 장소 ID (새 장소일 경우 placeId 필요)
                    coursePlaceId: p.coursePlaceId // 기존 장소면 유지, 없으면 생략
                    // 필요한 경우 placeName 등 추가
                }));

                return {
                    visitDay: day,
                    places: items // API 스펙상 key가 'places' 인지 'items' 인지 확인 필요. 아까 10번 응답 예시엔 places였음.
                };
            });

            // API 호출 Payload 구성
            const payload = {
                courseTitle: (courseDetail as any).courseTitle,
                travelStatus: courseDetail.travelStatus,
                regionId: courseDetail.regionId,
                // 필요한 다른 필드들...
                itineraries: itineraries
            };

            console.log("💾 저장 Payload:", payload);

            // 2. API 호출
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


    const [places, setPlaces] = useState<any[]>([]);

    useEffect(() => {
        if (courseDetail) {
            const newPlaces = courseDetail.itineraries.flatMap((itinerary) =>
                itinerary.places.map((place) => ({
                    day: itinerary.visitDay,
                    id: place.placeId,
                    coursePlaceId: place.coursePlaceId, // 저장 시 식별 위해 필요
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
    const mapPlaces = places.map(p => ({
        id: p.id,
        lat: p.lat,
        lng: p.lng,
        order: p.order,
        name: p.name,
    }));

    // 날짜 데이터 API에 없으면 임시 값 사용
    const dateRange = "2026.01.26 - 01.28";


    return (
        <div className="h-screen flex flex-col bg-white relative overflow-hidden">
            {/* 헤더 */}
            <DetailHeader
                region={courseDetail.regionName}
                title={(courseDetail as any).courseTitle || courseDetail.videoTitle}
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
                title={(courseDetail as any).courseTitle || "내 코스 정리"}
                isEditMode={isEditMode}
                setPlaces={setPlaces}
            />
        </div>
    );
}
