import { useNavigate } from "react-router-dom";
import GoogleMap from "../components/GoolgeMap";
import DetailHeader from "../components/mycourse/DetailHeader";



export default function MyCourseDetailPage() {
    const navigate = useNavigate();

    // 테스트 데이터
    const TEST_PLACES = [
        { id: 1, lat: 35.1587, lng: 129.1604, order: 1, name: "해운대" },
        { id: 2, lat: 35.1689, lng: 129.1360, order: 2, name: "벡스코" }
    ];

    return (
        <div className="h-screen flex flex-col bg-white relative">
            {/* 헤더 */}
            <DetailHeader
                region="부산"
                title="부산"
                date="2026.01.26 - 01.28"
                onBack={() => navigate(-1)}
                onEdit={() => console.log("편집 클릭")}
            />

            {/* 지도 영역 */}
            <div className="flex-1 w-full h-full">
                <GoogleMap places={TEST_PLACES} />
            </div>
        </div>
    );
}
