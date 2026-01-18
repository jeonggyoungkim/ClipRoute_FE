import { useState } from 'react';
import Header from '../components/common/Header';
import DestinationModal from '../components/TravelDateSelector/DestinationModal';
import mappinicon from "../assets/icons/mappin-icon.svg";
import calendaricon from "../assets/icons/calendar-icon.svg";

interface Destination {
  id: string;
  name: string;
  imageUrl: string;
}

const Home = () => {
  const [isDestinationModalOpen, setIsDestinationModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  const handleDestinationSelect = (destination: Destination) => {
    setSelectedDestination(destination);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="" 
        showNotification={true}
        onNotificationClick={() => console.log('알림 클릭')}
      />
      
      <main className="max-w-md mx-auto p-4">
        <h2 className="text-[16px] font-bold mb-4">
          대표 여행 유튜버들의 국내 여행 코스를 한 눈에!
        </h2>
        
        {/* 여행지/날짜 선택 박스 */}
        <div className="bg-white rounded-lg border-[1px] border-[#42BCEB] p-4 mb-6">
          
          {/* 여행지 선택 버튼 */}
          <button 
            onClick={() => setIsDestinationModalOpen(true)}
            className="flex items-center gap-4 mb-3 w-full text-left"
          >
            <img src={mappinicon} alt="mappinicon"/>
            <span className={selectedDestination ? 'font-medium text-gray-900' : 'text-gray-500'}>
              {selectedDestination ? selectedDestination.name : '여행지를 선택해 주세요'}
            </span>
          </button>

          <div className="mx-4 border-t border-[#D2D2D2]" />

          {/* 날짜 선택 버튼 */}
          <button 
            className="flex items-center gap-4 py-2 w-full text-left text-gray-500"
          >
            <img src={calendaricon} alt="calendaricon"/>
            <span>여행 날짜를 선택해 주세요</span>
          </button>
        </div>

        
        <div className='flex justify-end mb-8'>
           <button className="w-[150px] bg-[#42BCEB] text-[14px] text-white py-3 rounded-lg font-semibold">
          코스 생성하기
        </button>
        </div>
       

        <section className="mt-8">
          <h3 className="text-[20px] font-semibold mb-4">
            대표 지역/인기 영상 속 코스
          </h3>
          <p className="text-[12px] text-gray-500">현재 가장 인기 있는 대표 지역은 제주, 부산입니다.</p>
          
          {/* 코스 카드가 들어갈 자리 */}
          <div className="mt-4 space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="bg-gray-200 h-40 rounded-lg mb-3"></div>
              <div className="flex items-center gap-2">
                <div>
                  <p className="font-semibold">[채널명]</p>
                  <p className="text-sm text-gray-600">영상 제목이 들어갑니다.</p>
                  <p className="text-xs text-cyan-400">#여행지 #2박 3일</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 여행지 선택 모달 */}
      <DestinationModal
        isOpen={isDestinationModalOpen}
        onClose={() => setIsDestinationModalOpen(false)}
        onSelect={handleDestinationSelect}
      />
    </div>
  );
};

export default Home;