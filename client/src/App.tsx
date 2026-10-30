import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { Avatar } from '@/components/common/Avatar';
import { Dropdown } from '@/components/common/Dropdown';
import { Sparkles, TrendingUp, Search, Heart, MessageCircle, Share2, Flame } from 'lucide-react';

const DemoFeed: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <div className="flex flex-col gap-6">
      {/* Banner Chào mừng Sprint 0 */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-600 via-rose-500 to-accent-500 p-6 text-white shadow-lg shadow-brand-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-accent-200" />
          <span className="text-xs font-bold uppercase tracking-wider text-white/90">
            Sprint 0 Completed • Frontend Lead
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Chào mừng đến với HUST-Food Platform
        </h1>
        <p className="mt-2 text-sm sm:text-base text-white/90 max-w-2xl">
          Nền tảng mạng xã hội ẩm thực, khám phá và đánh giá quán ăn chuẩn vị HUST.
          Hệ thống cấu trúc Monorepo TypeScript, 3-column Layout, UI Kit và Axios Interceptor đã sẵn sàng cho Sprint 1 & 2!
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            Mở Modal Test UI
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            Khám phá Quán ăn
          </Button>
        </div>
      </div>

      {/* Test Thư viện Components dùng chung (Common UI Kit) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5 text-brand-600" />
          UI Kit dùng chung (Sprint 0 Deliverables)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Button Variants */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase text-slate-400">Buttons</span>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="sm">Primary</Button>
              <Button variant="secondary" size="sm">Secondary</Button>
              <Button variant="outline" size="sm">Outline</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
              <Button variant="danger" size="sm">Danger</Button>
              <Button variant="primary" size="sm" isLoading>Loading</Button>
            </div>
          </div>

          {/* Avatar Sizes */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase text-slate-400">Avatars</span>
            <div className="flex items-center gap-3">
              <Avatar name="Nguyễn Văn A" size="xs" />
              <Avatar name="Trần Thị B" size="sm" status="online" />
              <Avatar name="Lê Hoàng C" size="md" status="busy" />
              <Avatar name="Phạm Tuấn" size="lg" status="offline" />
            </div>
          </div>

          {/* Form Input */}
          <div className="flex flex-col gap-3 md:col-span-2">
            <span className="text-xs font-semibold uppercase text-slate-400">Inputs & Form Controls</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email hoặc Tên đăng nhập"
                placeholder="vd: student@hust.edu.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                helperText="Dùng để đăng nhập hoặc khôi phục mật khẩu"
              />
              <Input
                type="password"
                label="Mật khẩu bảo mật"
                placeholder="Nhập ít nhất 6 ký tự"
                defaultValue="password123"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Demo Post Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name="Food Reviewer" size="md" status="online" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">Bách Khoa Ăn Gì</h4>
              <p className="text-xs text-slate-400">2 giờ trước • #ReviewQuán</p>
            </div>
          </div>
          <Dropdown
            trigger={<Button variant="ghost" size="sm">•••</Button>}
            items={[
              { label: 'Lưu bài viết', onClick: () => alert('Đã lưu bài viết!') },
              { label: 'Báo cáo vi phạm', danger: true, onClick: () => alert('Đã mở form báo cáo') },
            ]}
          />
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900">
            Bún cá chấm cay Hải Phòng - Cổng Parabol Bách Khoa
          </h3>
          <p className="mt-1 text-sm text-slate-600 leading-relaxed">
            Nước dùng chua ngọt đậm đà, cá chiên vàng rộm giòn rụm bên ngoài nhưng thịt cá bên trong vẫn mềm ngọt. Giá cả cực kỳ hợp túi tiền sinh viên chỉ từ 35.000đ!
          </p>
        </div>

        {/* Post Actions */}
        <div className="flex items-center gap-4 pt-3 border-t border-slate-100 text-slate-500 text-sm">
          <button className="flex items-center gap-1.5 hover:text-brand-600 font-semibold transition-colors">
            <Heart className="w-4 h-4" />
            <span>24 Yummy</span>
          </button>
          <button className="flex items-center gap-1.5 hover:text-brand-600 font-semibold transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span>8 Bình luận</span>
          </button>
          <button className="flex items-center gap-1.5 hover:text-brand-600 font-semibold transition-colors ml-auto">
            <Share2 className="w-4 h-4" />
            <span>Chia sẻ</span>
          </button>
        </div>
      </div>

      {/* Test Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Kiểm thử Modal UI Common"
        description="Thành phần Modal có hỗ trợ phím ESC và click backdrop để đóng"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Đóng
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
              Xác nhận
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 leading-relaxed">
          Modal được dựng theo chuẩn thiết kế của dự án, hỗ trợ cấu hình maxWidth, header, body cuộn độc lập và footer cố định.
        </p>
      </Modal>
    </div>
  );
};

// Widget Cột bên phải (Trending Tags)
const RightSidebarWidget: React.FC = () => {
  const trendingTags = [
    { tag: 'bun-ca-cay', count: '48 bài viết' },
    { tag: 'an-sang-hust', count: '35 bài viết' },
    { tag: 'tra-sua-ta-quang-buu', count: '29 bài viết' },
    { tag: 'com-tam-dem', count: '21 bài viết' },
    { tag: 'cong-thuc-eat-clean', count: '18 bài viết' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Trending Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm font-bold text-slate-900">Chủ đề thịnh hành</h3>
        </div>
        <div className="flex flex-col divide-y divide-slate-100">
          {trendingTags.map((item) => (
            <div
              key={item.tag}
              className="py-2.5 flex items-center justify-between hover:bg-slate-50 -mx-2 px-2 rounded-xl cursor-pointer transition-colors"
            >
              <span className="text-xs font-semibold text-slate-800">#{item.tag}</span>
              <span className="text-[11px] text-slate-400">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
          element={
            <MainLayout rightSidebar={<RightSidebarWidget />}>
              <Routes>
                <Route path="/" element={<DemoFeed />} />
                <Route
                  path="/places"
                  element={
                    <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                      <h2 className="text-xl font-bold">Mô-đun Địa điểm Quán ăn (places/)</h2>
                      <p className="text-slate-500 text-sm mt-1">Phụ trách bởi FE 2 (F06 - F08)</p>
                    </div>
                  }
                />
                <Route
                  path="/maps"
                  element={
                    <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                      <h2 className="text-xl font-bold">Mô-đun Bản đồ Ẩm thực (maps/)</h2>
                      <p className="text-slate-500 text-sm mt-1">Phụ trách bởi FE 2 (F11 - F13)</p>
                    </div>
                  }
                />
                <Route
                  path="/bookmarks"
                  element={
                    <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                      <h2 className="text-xl font-bold">Danh sách Đã lưu (bookmarks/)</h2>
                      <p className="text-slate-500 text-sm mt-1">Phụ trách bởi FE 1 (F05) - Sẵn sàng cho Sprint 1</p>
                    </div>
                  }
                />
                <Route
                  path="/profile/:username"
                  element={
                    <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                      <h2 className="text-xl font-bold">Trang cá nhân (profiles/)</h2>
                      <p className="text-slate-500 text-sm mt-1">Phụ trách bởi FE 1 (F03, F04) - Sẵn sàng cho Sprint 1</p>
                    </div>
                  }
                />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

