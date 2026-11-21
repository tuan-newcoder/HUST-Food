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
import { PlacesPage } from './features/places/pages/PlacesPage';
import { PlaceDetailPage } from './features/places/pages/PlaceDetailPage';
import { AddPlacePage } from './features/places/pages/AddPlacePage';
import { NotificationsPage } from './features/notifications/pages/NotificationsPage';
import { ToastContainer, toast } from './components/feedback/Toast';
import { useAuthStore } from './stores/useAuthStore';
import { useThemeStore } from './stores/useThemeStore';
import { AppNotification } from './types/notification.types';

const TABS = ['home', 'map', 'places', 'add-place', 'notifications', 'bookmarks', 'profile', 'login', 'register', 'forgot'];
const AUTH_TABS = ['add-place', 'notifications', 'bookmarks', 'profile'];

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
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

  // Đọc hash từ URL (ví dụ: #map, #places, #places/place_01, #notifications, #login)
  useEffect(() => {
    const handleHash = () => {
      const [tab, id] = window.location.hash.replace('#', '').split('/');
      if (TABS.includes(tab)) {
        setActiveTab(tab);
        setSelectedPostId(null);
        setSelectedPlaceId(tab === 'places' && id ? id : null);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Trang cần đăng nhập: chuyển về Bảng tin + mở popup đăng nhập
  useEffect(() => {
    if (!isAuthenticated && AUTH_TABS.includes(activeTab)) {
      setActiveTab('home');
      window.location.hash = '';
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    }
  }, [activeTab, isAuthenticated]);

  // Cuộn lên đầu mỗi khi đổi màn hình
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [activeTab, selectedPlaceId]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedPostId(null);
    setSelectedPlaceId(null);
    setIsMobileMenuOpen(false);
    window.location.hash = tab === 'home' ? '' : tab;
  };

  const handleOpenPlace = (placeId: string) => {
    setActiveTab('places');
    setSelectedPlaceId(placeId);
    setSelectedPostId(null);
    window.location.hash = `places/${placeId}`;
  };

  const handleOpenNotification = (n: AppNotification) => {
    if (n.post) {
      handleTabChange('home');
      setSelectedPostId(n.post._id);
    } else {
      // Thông báo FOLLOW: chưa có trang hồ sơ người khác → mở trang cá nhân
      handleTabChange('profile');
    }
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
          onOpenNotification={handleOpenNotification}
          onViewAllNotifications={() => handleTabChange('notifications')}
        />

        {/* Page Content */}
        {activeTab === 'map' ? (
          /* SCR-02: Bản đồ Ẩm thực Bách Khoa - Leaflet/Mapbox Full-Bleed Canvas */
          <main className="flex-1 w-full h-[calc(100vh-82px)] overflow-hidden relative">
            <FoodMapView onNavigatePlaceDetail={handleOpenPlace} />
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
            {activeTab === 'places' && !selectedPlaceId && (
              <PlacesPage
                onSelectPlace={handleOpenPlace}
                onAddPlace={() => handleTabChange('add-place')}
                onRequireAuth={() => handleOpenAuth('login')}
              />
            )}

            {/* SCR-04: Chi tiết Quán ăn & Đánh giá (/places/:id) */}
            {activeTab === 'places' && selectedPlaceId && (
              <PlaceDetailPage
                placeId={selectedPlaceId}
                onBack={() => handleTabChange('places')}
                onOpenMap={() => handleTabChange('map')}
                onRequireAuth={() => handleOpenAuth('login')}
              />
            )}

            {/* F08: Đóng góp quán mới (/places/new) */}
            {activeTab === 'add-place' && (
              <AddPlacePage onCancel={() => handleTabChange('places')} onCreated={handleOpenPlace} />
            )}

            {/* F21–F22: Hộp thư thông báo */}
            {activeTab === 'notifications' && (
              <NotificationsPage onOpenNotification={handleOpenNotification} />
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
