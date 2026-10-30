import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNavigation } from './BottomNavigation';
import { Footer } from './Footer';

interface MainLayoutProps {
  rightSidebar?: React.ReactNode;
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ rightSidebar, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Header Navbar */}
      <Header />

      {/* Main Container - 3 Columns Layout */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 items-start gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Left Column: Sidebar */}
        <Sidebar />

        {/* Center Column: Feed / Page Content */}
        <main className="flex-1 min-w-0 pb-16 lg:pb-0">
          {children || <Outlet />}
        </main>

        {/* Right Column: Optional Trending Tags / Map Widget */}
        {rightSidebar && (
          <aside className="hidden xl:flex w-80 flex-col gap-6 sticky top-20 h-[calc(100vh-5rem)] pb-6 overflow-y-auto">
            {rightSidebar}
          </aside>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />

      {/* Footer */}
      <Footer />
    </div>
  );
};

