import { useNavigate, useLocation } from "react-router-dom";
import { HomeIcon } from "../assets/icons/NavBar/HomeIcon";
import { MycourseIcon } from "../assets/icons/NavBar/MycourseIcon";
import { MyPageIcon } from "../assets/icons/NavBar/MyPageIcon";

interface NavItem {
  id: 'home' | 'course' | 'mypage';
  label: string;
  path: string;
  Icon: React.ComponentType<{ isActive: boolean; size?: number }>;
}


const NAV_MENU: NavItem[] = [
  { id: 'home', label: '홈', path: '/', Icon: HomeIcon },
  { id: 'course', label: '내 코스', path: '/course', Icon: MycourseIcon },
  { id: 'mypage', label: '마이페이지', path: '/my', Icon: MyPageIcon },
];

export default function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation(); 

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-50 flex w-[90%] max-w-md h-16 justify-around items-center rounded-full bg-white shadow-[0_0_10px_0_rgba(0,0,0,0.1)] mx-auto border border-gray-50 px-6">
      {NAV_MENU.map((item) => {
        // 현재 경로가 item.path와 일치하는지 확인하여 활성화 상태 결정
        const isActive = location.pathname === item.path;

        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)} 
            className="flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-90"
          >
            <item.Icon isActive={isActive} size={24} />
            <span
              className={`text-sm transition-colors duration-200 ${
                isActive ? 'text-[#42BCEB] font-bold' : 'text-gray-400'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}