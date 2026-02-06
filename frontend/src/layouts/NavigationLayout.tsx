import type { ReactNode } from 'react';
import NavigationBar from '../components/NavigationBar';

interface NavigationLayoutProps {
  children: ReactNode;
  activeTab?: 'home' | 'course' | 'mypage';  // 호환성 유지
  hideNavigation?: boolean;
}

export default function NavigationLayout({ children, hideNavigation = false }: NavigationLayoutProps) {
  return (
    <div className="main-layout">
      <main className="content">
        {children}
      </main>
      {!hideNavigation && <NavigationBar />}
    </div>
  );
}