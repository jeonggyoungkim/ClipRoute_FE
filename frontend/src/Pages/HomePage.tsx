import { useState } from 'react';
import NavigationLayout from '../layouts/NavigationLayout';
import Header from '../components/common/Header';
import { CourseInputCard } from '../components/CourseInputCard';
import DestinationModal from '../components/modals/DestinationModal';
import DateSelectModal from '../components/modals/DateSelectModal';
import VideoSection from '../components/VideoSection';
import bellicon from "../assets/icons/bell-icon.svg";
import logoicon from "../assets/icons/logo-icon.svg";

interface Destination {
  regionId: number;
  regionName: string;
  imageUrl: string;
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

const HomePage = () => {
  const [isDestinationModalOpen, setIsDestinationModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | null>(null);
  const [shouldFilter, setShouldFilter] = useState(false);

  const calculateTravelDays = (dateRange: DateRange | null): number | null => {
    if (!dateRange?.startDate || !dateRange?.endDate) return null;
    const days = Math.ceil(
      (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  const handleGenerateCourse = () => {
    setShouldFilter(true);
    setTimeout(() => {
      document.getElementById('video-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const isAnyModalOpen = isDestinationModalOpen || isDateModalOpen;

  return (
    <NavigationLayout activeTab="home" hideNavigation={isAnyModalOpen}>
      <div className="bg-white min-h-screen">
        <Header
          left={<img src={logoicon} alt="logo"/>}
          right={<img src={bellicon} alt="notifications" className='w-5 h-5'/>}
        />

        <main className='px-5 pt-6 pb-24'>
          <h1 className="font-sans font-[700] text-[1rem] pb-[15px]">
            대표 여행 유튜버들의 국내 여행 코스를 한 눈에!
          </h1>

          <CourseInputCard 
            region={selectedDestination} 
            dateRange={selectedDateRange}
            onLocationClick={() => setIsDestinationModalOpen(true)}
            onDateClick={() => setIsDateModalOpen(true)}
          />

          <div className="flex justify-end mt-4">
            <button 
              className="px-5 py-3 rounded-xl font-bold bg-[#42BCEB] text-white active:opacity-80 transition-all"
              onClick={handleGenerateCourse}
            >
              코스 생성하기
            </button>
          </div>

          <DestinationModal 
            isOpen={isDestinationModalOpen}
            onClose={() => setIsDestinationModalOpen(false)}
            onSelect={(dest) => {
              setSelectedDestination(dest);
              setIsDestinationModalOpen(false);
            }} 
          />

          <DateSelectModal
            isOpen={isDateModalOpen}
            onClose={() => setIsDateModalOpen(false)}
            onConfirm={(dateRange) => {
              setSelectedDateRange(dateRange);
            }}
          />

          <div id="video-section">
            <VideoSection 
              destination={selectedDestination}
              travelDays={calculateTravelDays(selectedDateRange)}
              shouldFilter={shouldFilter}
            />
          </div>
        </main>
      </div>
    </NavigationLayout>
  );
};

export default HomePage;