import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GoogleMap from "../components/GoolgeMap";
import DetailHeader from "../components/mycourse/DetailHeader";
import PlaceBottomSheet from "../components/course/PlaceBottomSheet";
import { fetchCourseDetail } from "../api/courses";


interface CourseDetailResult {
    courseId: number;
    videoTitle: string;
    videoUrl: string;
    thumbnailUrl: string;
    channelName: string;
    regionId: number;
    regionName: string;
    isScrapped: boolean;
    travelStatus: "BEFORE" | "ONGOING" | "COMPLETED";
    itineraries: {
        visitDay: number;
        places: {
            coursePlaceId: number;
            visitOrder: number;
            placeId: number;
            placeName: string | number;
            placeCategory: string;
            address: string;
            lat: number;
            lng: number;
            timestamp: number;
        }[];
    }[];
}

export default function MyCourseDetailPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [courseDetail, setCourseDetail] = useState<CourseDetailResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const loadDetail = async () => {
            try {
                setIsLoading(true);

                const targetId = courseId || "1";


                const response: any = await fetchCourseDetail(targetId);

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

    if (isLoading || !courseDetail) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <p className="text-gray-500">불러오는 중...</p>
            </div>
        );
    }


    const mapPlaces = courseDetail.itineraries.flatMap((itinerary) =>
        itinerary.places.map((place) => ({
            id: place.placeId,
            lat: place.lat,
            lng: place.lng,
            order: place.visitOrder,
            name: String(place.placeName),
        }))
    );

    // 바텀시트 데이터 변환 
    const sheetPlaces = courseDetail.itineraries.flatMap((itinerary) =>
        itinerary.places.map((place) => ({
            day: itinerary.visitDay,
            id: place.placeId,
            order: place.visitOrder,
            name: String(place.placeName),
            category: place.placeCategory,
            address: place.address,
        }))
    );

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
                onEdit={() => console.log("편집 클릭")}
            />


            <div className="flex-1 w-full h-full">
                <GoogleMap places={mapPlaces} />
            </div>


            <PlaceBottomSheet
                places={sheetPlaces}
                title={(courseDetail as any).courseTitle || "내 코스 정리"}
            />
        </div>
    );
}
