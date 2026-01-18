import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface MobileLayoutProps {
  children?: ReactNode;
  /** 페이지마다 배경색이 다를 수 있으므로 커스텀 클래스를 허용합니다. */
  containerClassName?: string;
}

export default function MobileLayout({ children, containerClassName = "" }: MobileLayoutProps) {
  return (
    /* 1. 전체 배경: PC 환경에서 중앙 정렬을 담당 */
    <div className="flex justify-center items-center min-h-screen bg-[#F2F4F7]">
      
      {/* 2. 웹앱 메인 컨테이너: 
          - 이 부분은 '모바일 기기 자체'의 크기를 정의합니다.
          - 내부 여백(px-)은 여기서 주지 말고, 각 페이지 컴포넌트에서 줍니다.
      */}
      <div className={`
        relative bg-white shadow-xl
        w-full h-dvh 
        sm:w-[393px] sm:h-[852px] 
        flex flex-col overflow-hidden
        ${containerClassName}
      `}>
        
        {/* 3. 실제 콘텐츠 영역:
            - h-full w-full을 주어 자식 요소가 전체 공간을 다 쓰게 합니다.
            - overflow-y-auto를 통해 내용이 길어지면 이 안에서만 스크롤되게 합니다.
        */}
        <main className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden">
          {children || <Outlet />}
        </main>

      </div>
    </div>
  );
}