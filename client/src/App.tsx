import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { HomePage } from './features/posts/pages/HomePage';
import { FoodMapView } from './features/maps/pages/FoodMapView';
import { ProfilePage } from './features/profiles/pages/ProfilePage';
import { BookmarksPage } from './features/profiles/pages/BookmarksPage';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from './features/auth/pages/ForgotPasswordPage';
import { AuthModal } from './features/auth/components/AuthModal';
import { CreatePostModal } from './features/posts/components/CreatePostModal';
import { ToastContainer, toast } from './components/feedback/Toast';
import { useAuthStore } from './stores/useAuthStore';
import { useThemeStore } from './stores/useThemeStore';
import { Store } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');

  const { isAuthenticated } = useAuthStore();
  const { initTheme } = useThemeStore();

  // Khởi tạo theme (sáng/tối) theo cấu hình người dùng & system preference
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // Đọc hash từ URL (ví dụ: #map, #profile, #bookmarks, #login)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'map', 'places', 'bookmarks', 'profile', 'login', 'register', 'forgot'].includes(hash)) {
        setActiveTab(hash);
        setSelectedPostId(null);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedPostId(null);
    setIsMobileMenuOpen(false);
    window.location.hash = tab === 'home' ? '' : tab;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab('home');
    setSelectedPostId(null);
    if (query.trim()) {
      toast.info(`Đang tìm kiếm bài viết: "${query}"`, 'Tìm kiếm');
    }
  };

  const handleOpenCreatePost = () => {
    if (!isAuthenticated) {
      toast.warning('Vui lòng đăng nhập để tạo bài viết mới', 'Yêu cầu đăng nhập');
      setIsAuthModalOpen(true);
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleOpenAuth = (mode: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleNavigatePlace = (placeId: string) => {
    toast.info(`Chuyển hướng sang chi tiết địa điểm: ${placeId}`, 'Địa điểm ẩm thực');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white selection:bg-rose-500 selection:text-white transition-colors duration-200">
      {/* Toast Notifications Provider */}
      <ToastContainer />

      {/* Auth Modal (Quick popup from any screen) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authModalMode}
      />

      {/* Create Post Modal (SCR-05) */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* 1. Left Navigation Sidebar (Responsive drawer on mobile, fixed w-[280px] - w-[308px] on desktop) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenCreatePost={handleOpenCreatePost}
        onOpenAuth={() => handleOpenAuth('login')}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Workspace (Pushed to the right of fixed sidebar on desktop, full width on mobile) */}
      <div
        className={`ml-0 lg:ml-[280px] xl:ml-[308px] flex flex-col min-h-screen ${
          activeTab === 'map' ? 'h-screen overflow-hidden pb-0' : 'pb-20 lg:pb-8'
        } transition-all`}
      >
        {/* Top Header */}
        <Header
          onSearch={handleSearch}
          onOpenProfile={() => handleTabChange('profile')}
          onOpenBookmarks={() => handleTabChange('bookmarks')}
          onOpenAuth={() => handleOpenAuth('login')}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Page Content */}
        {activeTab === 'map' ? (
          /* SCR-02: Bản đồ Ẩm thực Bách Khoa - Leaflet/Mapbox Full-Bleed Canvas */
          <main className="flex-1 w-full h-[calc(100vh-82px)] overflow-hidden relative">
            <FoodMapView onNavigatePlaceDetail={handleNavigatePlace} />
          </main>
        ) : (
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto w-full">
            {/* SCR-01: Trang chủ Bảng tin ẩm thực (Feed) */}
            {activeTab === 'home' && (
              <HomePage
                selectedPostId={selectedPostId}
                onSelectPost={(id) => setSelectedPostId(id)}
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery('')}
              />
            )}

            {/* SCR-03: Danh bạ Quán ăn & Địa điểm (/places) */}
            {activeTab === 'places' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-100 dark:border-slate-800 text-center shadow-sm max-w-2xl mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Store className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Danh bạ Quán ăn & Địa điểm (/places)
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
                  Màn hình SCR-03 tổng hợp danh bạ toàn bộ quán xá Tạ Quang Bửu, Lê Thanh Nghị, Trần Đại Nghĩa.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700">
                  <Store className="w-4 h-4 text-amber-600" />
                  <span>Tra cứu thực đơn, bảng giá & giờ mở cửa</span>
                </div>
              </div>
            )}

            {/* SCR-07: Quản lý danh sách đã lưu (Bookmarks) */}
            {activeTab === 'bookmarks' && (
              <BookmarksPage
                onExploreMore={() => handleTabChange('home')}
                onSelectPost={(id) => {
                  setActiveTab('home');
                  setSelectedPostId(id);
                }}
              />
            )}

            {/* SCR-07: Hồ sơ cá nhân sinh viên (Profile) */}
            {activeTab === 'profile' && (
              <ProfilePage
                onExploreMore={() => handleTabChange('home')}
                onSelectPost={(id) => {
                  setActiveTab('home');
                  setSelectedPostId(id);
                }}
              />
            )}

            {/* SCR-08: Màn hình Đăng nhập (Login) */}
            {activeTab === 'login' && (
              <div className="py-6 sm:py-8">
                <LoginPage
                  onSuccess={() => handleTabChange('home')}
                  onNavigateToRegister={() => handleTabChange('register')}
                  onNavigateToForgotPassword={() => handleTabChange('forgot')}
                />
              </div>
            )}

            {/* SCR-08: Màn hình Đăng ký (Register) */}
            {activeTab === 'register' && (
              <div className="py-6 sm:py-8">
                <RegisterPage
                  onSuccess={() => handleTabChange('home')}
                  onNavigateToLogin={() => handleTabChange('login')}
                />
              </div>
            )}

            {/* SCR-08: Màn hình Quên mật khẩu (Forgot Password) */}
            {activeTab === 'forgot' && (
              <div className="py-6 sm:py-8">
                <ForgotPasswordPage
                  onSuccess={() => handleTabChange('login')}
                  onNavigateToLogin={() => handleTabChange('login')}
                />
              </div>
            )}
          </main>
        )}
      </div>

      {/* 3. Mobile Bottom Navigation (Visible on screen < lg) */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenAuth={() => handleOpenAuth('login')}
      />
    </div>
  );
}

export default App;
