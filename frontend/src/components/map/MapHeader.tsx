import backIcon from "../../assets/icons/back-icon.svg";
import saveIcon from"../../assets/icons/save-icon.svg";
import saveactionIcon from "../../assets/icons/save-action-icon.svg";

const MapHeader = () => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 px-[16px] pt-[12px]">
      {/*  헤더 */}
      <div className="w-full h-[48px] bg-white rounded-[13px] border border-[#42BCEB] flex items-center px-3 shadow-sm">
        
        
        <button className="back-icon">
          <img src={backIcon}className='w-4 h-4'/>
        </button>

        {/* 수정 필요 */}
        <span className="flex-1 text-[15px] font-bold truncate text-[#333] px-1">
          [영상 제목..] 코스 정리
        </span>

        
        <div className="relative flex flex-col items-center">
          <button>
          <img src={saveIcon} className="w-5 h-5"/>
          </button>

          
          <div className="absolute top-full mt-1 flex flex-col items-center">
            <img src={saveactionIcon} className="w-100 w-200"/>
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default MapHeader;