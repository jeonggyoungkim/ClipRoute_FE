import { Map } from '@vis.gl/react-google-maps';

const MapComponent = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Map
        defaultCenter={{ lat: 37.5665, lng: 126.9780 }}
        defaultZoom={13}
        gestureHandling={'greedy'}
        disableDefaultUI={false}
      />
    </div>
  );
};

export default MapComponent;