// 상단 헤더
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showNotification?: boolean;
  onNotificationClick?: () => void;
}

const Header = ({ 
  title, 
  showBack = false, 
  showNotification = false,
  onNotificationClick 
}: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-md mx-auto flex items-center justify-between h-14 px-4">
        {/* 왼쪽: 뒤로가기 버튼 */}
        <div className="w-10">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="text-gray-700 hover:text-gray-900"
              aria-label="뒤로가기"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* 중앙: 타이틀 */}
        <h1 className="text-lg font-semibold text-gray-900 truncate">
          {title}
        </h1>

        {/* 오른쪽: 알림 아이콘 */}
        <div className="w-10 flex justify-end">
          {showNotification && (
            <button
              onClick={onNotificationClick}
              className="text-gray-700 hover:text-gray-900 relative"
              aria-label="알림"
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {/* 알림 배지 (선택사항) */}
              {/* <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span> */}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;