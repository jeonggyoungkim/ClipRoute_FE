import { useEffect } from 'react';
import PlaceItem from '../course/PlaceItem';
import youtubeIcon from '../../assets/icons/social/youtube-icon.svg';
import naverIcon from '../../assets/icons/social/naver-icon.svg';

interface PlaceLinkLayerProps {
    place: any;
    rect: DOMRect | null;
    onClose: () => void;
}

const PlaceLinkLayer = ({ place, rect, onClose }: PlaceLinkLayerProps) => {
    useEffect(() => {
        // Esc 키로 닫기 및 스크롤 방지
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEsc);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    if (!place || !rect) return null;

    // 외부 링크 연결 핸들러
    const handleLink = (type: 'youtube' | 'naver') => {
        let url = '';
        // 검색어: 장소 이름 + (주소 or 카테고리)
        const query = encodeURIComponent(`${place.name} ${place.address || ''}`);

        if (type === 'youtube') {
            // 유튜브: 비디오 ID가 있으면 해당 영상으로 이동, 없으면 검색 결과
            if (place.yt_video_id) {
                url = `https://www.youtube.com/watch?v=${place.yt_video_id}`;
            } else {
                url = `https://m.youtube.com/results?search_query=${query}`;
            }
        } else {
            // 네이버 지도
            if (place.lat && place.lng) {
                // 좌표가 있는 경우 지도 화면으로 직접 이동
                url = `https://map.naver.com/v5/?c=${place.lng},${place.lat},15,0,0,0,dh`;
            } else {
                // 좌표가 없는 경우 검색 결과 (모바일 웹)
                url = `https://m.map.naver.com/search2/search.naver?query=${query}`;
            }
        }

        window.open(url, '_blank');
    };

    return (
        <div
            className="fixed inset-0 z-[60] flex flex-col"
            onClick={onClose}
        >
            {/* 배경 Dim 처리 */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] animate-fade-in transition-opacity" />

            {/* 아이템 위치에 복제되어 띄워질 컨테이너 */}
            <div
                className="absolute z-10"
                style={{
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    // 높이는 내용물에 따라 자동 조절
                }}
                onClick={(e) => e.stopPropagation()} // 아이템 영역 클릭 시 닫히지 않음
            >
                {/* 하이라이트된 PlaceItem */}
                {/* 하이라이트된 PlaceItem */}
                <div className="flex flex-col items-start gap-[0.625rem] pt-[0.025rem] pb-[0.625rem] pl-[0.375rem] pr-0 rounded-[0.3125rem] bg-white w-full h-[4.5rem] shadow-2xl scale-[1.02] transition-transform duration-200">
                    {/* 
                      PlaceItem을 재사용하여 동일한 모양 유지.
                      isEditMode={false}로 설정하여 단순 뷰 모드로 렌더링.
                   */}
                    <div className="w-full"> {/* PlaceItem이 flex-1 등을 쓰므로 width 확보 필요 */}
                        <PlaceItem place={place} isEditMode={false} />
                    </div>
                </div>

                {/* 링크 연결 버튼들 (우측 상단 배치) */}
                <div className="absolute -top-[7.5rem] right-0 flex flex-col items-end gap-3 pointer-events-auto pb-4">
                    {/* YouTube Button */}
                    <div
                        className="flex items-center gap-3 group cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                        onClick={() => handleLink('youtube')}
                    >
                        <span className="text-white text-[0.75rem] font-normal drop-shadow-md">유튜브로 연결하기</span>
                        <img src={youtubeIcon} alt="YouTube" className="w-[2.8125rem] h-[2.8125rem] shadow-lg rounded-full" />
                    </div>

                    {/* Naver Button */}
                    <div
                        className="flex items-center gap-3 group cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                        onClick={() => handleLink('naver')}
                    >
                        <span className="text-white text-[0.75rem] font-normal drop-shadow-md">네이버로 연결하기</span>
                        <img src={naverIcon} alt="Naver" className="w-[2.8125rem] h-[2.8125rem]  rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceLinkLayer;
