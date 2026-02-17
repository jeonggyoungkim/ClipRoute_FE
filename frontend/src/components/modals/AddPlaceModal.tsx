import { useState, useEffect } from 'react';
import GoogleMap from '../GoogleMap';
import backIcon from '../../assets/icons/back-icon.svg';
import { fetchPlaceSearch } from '../../api/searchPlace';
import { CATEGORIES } from '../../constants/categories';

interface AddPlaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPlaceSelect?: (place: any) => void;
    regionId?: number;
}

const AddPlaceModal = ({ isOpen, onClose, regionId }: AddPlaceModalProps) => {
    const [tempPlaces, setTempPlaces] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        if (isOpen && regionId) {
            const loadPlaces = async () => {
                const params: any = {
                    regionId: regionId,
                    page: 0,
                    pageSize: 20
                };

                if (selectedCategory !== "all") {
                    params.category = selectedCategory;
                }

                console.log(`[AddPlaceModal] 장소 검색 (Category: ${selectedCategory})`);
                const response = await fetchPlaceSearch(params);

                if (response?.result) {
                    setTempPlaces(response.result.places);
                }
            };
            loadPlaces();
        }
    }, [isOpen, regionId, selectedCategory]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-modal-up">
            {/* 전체 지도 영역 */}
            <div className="absolute inset-0 w-full h-full">
                <GoogleMap
                    places={tempPlaces.map(p => ({
                        ...p,
                        id: p.placeId,
                        name: p.placeName,
                    }))}
                    mode="add"
                />
            </div>

            {/* 상단 플로팅 헤더 (카드 형태) */}
            <div className="absolute top-8 left-4 right-4 z-10 flex flex-col gap-3">
                <div className="bg-white rounded-xl border border-[#42BCEB] p-3 flex items-center gap-3">
                    <button onClick={onClose} className="p-1 -ml-1">
                        <img src={backIcon} alt="뒤로가기" className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-lg">부산 장소 리스트</span>
                </div>

                {/* 카테고리 필터 */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide px-1">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`
                                flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm border transition-all whitespace-nowrap
                                ${selectedCategory === cat.id
                                    ? 'bg-[#42BCEB] text-white border-[#42BCEB]'
                                    : 'bg-white text-gray-700 border-white/80 hover:bg-gray-50'}
                            `}
                        >
                            {cat.icon && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className={selectedCategory === cat.id ? "text-white" : "text-[#42BCEB]"}>
                                    {cat.icon}
                                </svg>
                            )}
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes modalUp { 
                  from { transform: translateY(100%); } 
                  to { transform: translateY(0); } 
                }
                .animate-modal-up { 
                  animation: modalUp 0.3s cubic-bezier(0.33, 1, 0.68, 1) forwards; 
                }
            `}</style>
        </div>
    );
};

export default AddPlaceModal;
