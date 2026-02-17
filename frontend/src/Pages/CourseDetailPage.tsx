import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import GoogleMap from '../components/GoolgeMap';
import MapHeader from '../components/map/MapHeader';
import PlaceBottomSheet from '../components/course/PlaceBottomSheet';
import positionicon from "../../src/assets/icons/positon-icon.svg";
import { fetchCourseDetail } from '../api/courses';


interface Place {
  coursePlaceId: number;
  visitOrder: number;
  placeId: number;
  placeName: string;
  placeCategory: string;
  address: string;
  lat: number;
  lng: number;
  timestamp: number;
}

interface Itinerary {
  visitDay: number;
  places: Place[];
}

interface CourseDetailResult {
  courseId: number;
  videoTitle: string;
  videoUrl: string;
  thumbnailUrl: string;
  channelName: string;
  regionId: number;
  regionName: string;
  isScrapped: boolean;
  travelStatus: 'BEFORE' | 'DURING' | 'AFTER';
  itineraries: Itinerary[];
}

interface CourseDetailResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: CourseDetailResult;
}


interface MapPlace {
  id: number;
  day: number;
  order: number;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  timestamp?: number;
}

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const { data, isLoading, isError } = useQuery<CourseDetailResponse>({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseDetail(courseId!),
    enabled: !!courseId,
  });

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#42BCEB]" />
      </div>
    );
  }

  if (isError || !data?.result) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <p className="text-red-500">코스 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }


  const places: MapPlace[] = data.result.itineraries.flatMap((itinerary: Itinerary) =>
    itinerary.places.map((place: Place) => ({
      id: place.coursePlaceId,
      day: itinerary.visitDay,
      order: place.visitOrder,
      name: place.placeName,
      category: place.placeCategory,
      address: place.address,
      lat: place.lat,
      lng: place.lng,
      timestamp: place.timestamp,
    }))
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <GoogleMap places={places} />
      <MapHeader
        courseId={data.result.courseId}
        videoTitle={data.result.videoTitle} />
      <PlaceBottomSheet places={places} />
      <button className="absolute bottom-[100px] right-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
        <img src={positionicon} alt="current position" />
      </button>
    </div>
  );
};

export default CourseDetailPage;