import { useState, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from '@vis.gl/react-google-maps';
import MapPin from './map/MapPin';
import MapLabel from './map/MapLabel';
import PlaceBadge from './map/PlaceBadge';

interface Place {
  id: number;
  lat: number;
  lng: number;
  order?: number;
  name: string;
  category?: string;
  [key: string]: any;
}

interface GoogleMapProps {
  places: Place[];
  mode?: 'view' | 'add'; // view: 일반 핀, add: 검색 결과 뱃지
}

// 1. 실제 지도를 렌더링하고 조작하는 내부 컴포넌트
const MapInner = ({ places, mode = 'view' }: GoogleMapProps) => {
  const map = useMap(); // APIProvider 내부이므로 인스턴스를 가져올 수 있음
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleMarkerClick = useCallback(
    (place: Place) => {
      setSelectedId(place.id);
      if (map) {
        map.panTo({ lat: place.lat, lng: place.lng });
        map.setZoom(16);
      }
    },
    [map]
  );

  return (
    <Map
      defaultCenter={{ lat: 35.1587, lng: 129.1604 }}
      defaultZoom={13}
      mapId="YOUR_MAP_ID" // AdvancedMarker 사용 시 필수
      disableDefaultUI={true}
      gestureHandling={'greedy'}
      onClick={() => setSelectedId(null)}
    >
      {places.map((place) => (
        <AdvancedMarker
          key={place.id}
          position={{ lat: place.lat, lng: place.lng }}
          onClick={() => handleMarkerClick(place)}
          zIndex={selectedId === place.id ? 10 : 1}
        >
          {mode === 'add' ? (
            <PlaceBadge name={place.name} category={place.category || '기타'} />
          ) : (
            <div className="relative flex flex-col items-center">
              {selectedId === place.id && <MapLabel name={place.name} />}
              <MapPin order={place.order || 0} />
            </div>
          )}
        </AdvancedMarker>
      ))}
    </Map>
  );
};

// 2. 최상위 GoogleMap 컴포넌트 (Provider 역할)
const GoogleMap = ({ places, mode = 'view' }: GoogleMapProps) => {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div className="w-full h-full min-h-[500px]">
        <MapInner places={places} mode={mode} />
      </div>
    </APIProvider>
  );
};

export default GoogleMap;