import { useState } from 'react';

interface Destination {
  id: string;
  name: string;
  imageUrl: string;
}

interface DestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (destination: Destination) => void;
}

// 목업 데이터
const mockDestinations: Destination[] = [
  {
    id: '1',
    name: '강릉',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
  },
  {
    id: '2',
    name: '부산',
    imageUrl: 'https://images.unsplash.com/photo-1544781807-28d3c1a41d2d?w=400&h=400&fit=crop'
  },
  {
    id: '3',
    name: '제주',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop'
  }
];

const DestinationModal = ({ isOpen, onClose, onSelect }: DestinationModalProps) => {
  const [destinations] = useState<Destination[]>(mockDestinations);

  if (!isOpen) return null;

  const handleSelect = (destination: Destination) => {
    onSelect(destination);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      {/* 모달 컨테이너 - 전체 화면 높이 */}
      <div className="w-full max-w-md bg-white rounded-t-3xl flex flex-col" style={{ height: '90vh' }}>
        {/* 헤더 */}
        <div className="relative flex items-center justify-center py-4 border-b border-gray-200 shrink-0">
          <h2 className="text-lg font-semibold">여행지 선택</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
            aria-label="닫기"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 전체 선택 버튼 */}
        <div className="px-6 py-3 border-b border-gray-100 shrink-0">
          <button className="flex items-center justify-between w-full text-left">
            <span className="text-sm text-gray-700">전체 선택</span>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* 여행지 목록 - 상단에 배치 */}
        <div className="px-6 pt-8 pb-6 shrink-0">
          <div className="flex gap-8 justify-start">
            {destinations.map((destination) => (
              <button
                key={destination.id}
                onClick={() => handleSelect(destination)}
                className="flex flex-col items-center group"
              >
                {/* 이미지 */}
                <div className="w-20 h-20 rounded-full overflow-hidden mb-2 ring-2 ring-transparent group-hover:ring-cyan-400 transition-all">
                  <img
                    src={destination.imageUrl}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // 이미지 로드 실패 시 대체 배경
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.classList.add('bg-gray-300');
                    }}
                  />
                </div>
                {/* 지역명 */}
                <span className="text-sm font-medium text-gray-700 group-hover:text-cyan-400 transition-colors">
                  {destination.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 나머지 공간 */}
        <div className="flex-1"></div>
      </div>
    </div>
  );
};

export default DestinationModal;