import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { HomePage } from './features/posts/pages/HomePage';

export function App() {
  const [activeTab, setActiveTab] = useState('home');

  const handleSearch = (query: string) => {
    alert(`Đang tìm kiếm với từ khoá: "${query}"`);
  };

  const handleOpenCreatePost = () => {
    alert('Mở modal tạo bài viết mới (SCR-05)');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. Left Navigation Sidebar (Fixed w-[308px]) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenCreatePost={handleOpenCreatePost}
      />

      {/* 2. Main Workspace (Pushed to the right of fixed sidebar) */}
      <div className="ml-[308px] flex flex-col min-h-screen">
        {/* Top Header */}
        <Header onSearch={handleSearch} />

        {/* Page Content */}
        <main className="flex-1 px-8 py-6 max-w-6xl mx-auto w-full">
          {activeTab === 'home' && <HomePage />}

          {activeTab === 'map' && (
            <div className="bg-white rounded-2xl p-12 border border-[#E2E8F0] text-center shadow-sm">
              <div className="text-4xl mb-3">🗺️</div>
              <h2 className="text-xl font-bold text-[#0F172A] mb-2">
                Bản đồ Ẩm thực Bách Khoa (Food Map - Route: /map)
              </h2>
              <p className="text-sm text-[#64748B] max-w-md mx-auto">
                Màn hình SCR-02 đang trong kế hoạch tích hợp bản đồ số vệ tinh và quét bán kính quanh trường.
              </p>
            </div>
          )}

          {activeTab === 'places' && (
            <div className="bg-white rounded-2xl p-12 border border-[#E2E8F0] text-center shadow-sm">
              <div className="text-4xl mb-3">🍜</div>
              <h2 className="text-xl font-bold text-[#0F172A] mb-2">
                Danh bạ Quán ăn & Địa điểm (/places)
              </h2>
              <p className="text-sm text-[#64748B] max-w-md mx-auto">
                Màn hình SCR-03 tổng hợp danh bạ toàn bộ quán xá Tạ Quang Bửu, Lê Thanh Nghị, Trần Đại Nghĩa.
              </p>
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div className="bg-white rounded-2xl p-12 border border-[#E2E8F0] text-center shadow-sm">
              <div className="text-4xl mb-3">🔖</div>
              <h2 className="text-xl font-bold text-[#0F172A] mb-2">
                Danh sách Bài viết & Quán đã lưu (Bookmarks)
              </h2>
              <p className="text-sm text-[#64748B] max-w-md mx-auto">
                Màn hình SCR-07 quản lý các địa điểm ẩm thực và công thức nấu ăn bạn đã đánh dấu.
              </p>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl p-12 border border-[#E2E8F0] text-center shadow-sm">
              <div className="text-4xl mb-3">👤</div>
              <h2 className="text-xl font-bold text-[#0F172A] mb-2">
                Hồ sơ cá nhân Nguyễn Văn A (/profile)
              </h2>
              <p className="text-sm text-[#64748B] max-w-md mx-auto">
                Màn hình SCR-07 xem thông tin sinh viên, lịch sử bài đăng và các huy hiệu đạt được.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
