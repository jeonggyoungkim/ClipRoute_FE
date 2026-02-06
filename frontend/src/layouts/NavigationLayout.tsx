import type { ReactNode } from 'react';
import NavigationBar from '../components/NavigationBar';

interface NavigationLayoutProps {
  children: ReactNode;
  activeTab?: 'home' | 'course' | 'mypage';  // ← 여기서 받아서
}

export default function NavigationLayout({ children, activeTab }: NavigationLayoutProps) {
  return (
    <div className="main-layout">
      <main className="content">
        {children}
      </main>
      <NavigationBar activeTab={activeTab} /> 
    </div>
  );
}