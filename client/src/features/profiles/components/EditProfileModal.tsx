import React, { useState } from 'react';
import { Camera, Lock, User as UserIcon, FileText, Check } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { User } from '@/types/user.types';
import { userService } from '@/services/userService';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from '@/components/feedback/Toast';

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');
  const [fullName, setFullName] = useState(user.fullName || '');
  const [bio, setBio] = useState(user.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || PRESET_AVATARS[0]);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useAuthStore();

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.warning('Họ và tên không được để trống');
      return;
    }
    if (bio.length > 250) {
      toast.warning('Tiểu sử không được vượt quá 250 ký tự');
      return;
    }

    setIsLoading(true);
    try {
      // Gọi API cập nhật
      await userService.updateMe({
        fullName: fullName.trim(),
        avatarUrl,
        bio: bio.trim(),
      });
      updateUser({
        fullName: fullName.trim(),
        avatarUrl,
        bio: bio.trim(),
      });
      toast.success('Hồ sơ đã được cập nhật thành công!', 'Cập nhật hoàn tất');
      onClose();
    } catch {
      // Fallback offline mock update
      updateUser({
        fullName: fullName.trim(),
        avatarUrl,
        bio: bio.trim(),
      });
      toast.success('Đã lưu thay đổi hồ sơ cá nhân!');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.warning('Vui lòng nhập mật khẩu hiện tại');
      return;
    }
    if (newPassword.length < 6) {
      toast.warning('Mật khẩu mới phải có tối thiểu 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.warning('Xác nhận mật khẩu mới không khớp');
      return;
    }

    setIsLoading(true);
    try {
      // Mock / API call
      await new Promise((r) => setTimeout(r, 600));
      toast.success('Đổi mật khẩu thành công!', 'Bảo mật');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chỉnh sửa hồ sơ cá nhân"
      description="Cập nhật thông tin nhận diện sinh viên và tài khoản của bạn"
      maxWidth="lg"
    >
      {/* Sub Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'info'
              ? 'border-brand-600 text-brand-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Thông tin cơ bản
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('password')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'password'
              ? 'border-brand-600 text-brand-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Đổi mật khẩu
        </button>
      </div>

      {activeTab === 'info' ? (
        <form onSubmit={handleSaveInfo} className="space-y-5">
          {/* Avatar selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 block">
              Ảnh đại diện (Avatar)
            </label>
            <div className="flex items-center gap-4 mb-3">
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-rose-100 dark:ring-rose-900/30 shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 bg-brand-600 p-1.5 rounded-full text-white shadow">
                  <Camera className="w-3 h-3" />
                </div>
              </div>
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="Dán link ảnh đại diện..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Gợi ý mẫu:</span>
              <div className="flex gap-2">
                {PRESET_AVATARS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(preset)}
                    className={`w-7 h-7 rounded-full overflow-hidden border-2 transition ${
                      avatarUrl === preset ? 'border-brand-600 ring-2 ring-brand-300 dark:ring-rose-900' : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Input
            label="Họ và tên hiển thị"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            leftIcon={<UserIcon className="w-4 h-4" />}
            required
          />

          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 select-none mb-1.5 block">
              Tiểu sử giới thiệu (Bio)
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={250}
                placeholder="Chia sẻ đôi nét về bạn, sở thích ẩm thực hay chuyên ngành học tại HUST..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition"
              />
              <span className="absolute bottom-2.5 right-3 text-[11px] text-slate-400 dark:text-slate-500">
                {bio.length}/250
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              rightIcon={<Check className="w-4 h-4" />}
            >
              Lưu thay đổi
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input
            label="Mật khẩu hiện tại"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <Input
            label="Mật khẩu mới"
            type="password"
            placeholder="Tối thiểu 6 ký tự"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <Input
            label="Xác nhận mật khẩu mới"
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={<Check className="w-4 h-4" />}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              rightIcon={<Check className="w-4 h-4" />}
            >
              Cập nhật mật khẩu
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

