import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { UserCheck, UserPlus, Users } from 'lucide-react';
import { User } from '@/types/user.types';
import { toast } from '@/components/feedback/Toast';

export interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: 'Người theo dõi' | 'Đang theo dõi';
  users?: User[];
}

const SAMPLE_FOLLOWERS: User[] = [
  {
    _id: 'usr_f1',
    username: 'minh_nguyen',
    fullName: 'Nguyễn Quang Minh',
    email: 'minh.nq@hust.edu.vn',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop',
    bio: 'Reviewer bún bò Tạ Quang Bửu • K65 CTTN',
    role: 'USER',
    status: 'ACTIVE',
    followersCount: 89,
    followingCount: 120,
    postsCount: 14,
    isFollowing: true,
    createdAt: '2026-09-01',
  },
  {
    _id: 'usr_f2',
    username: 'thao_linh',
    fullName: 'Trần Thảo Linh',
    email: 'linh.tt@hust.edu.vn',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
    bio: 'Chuyên gia săn deal quán cà phê học bài HUST ☕',
    role: 'USER',
    status: 'ACTIVE',
    followersCount: 230,
    followingCount: 95,
    postsCount: 28,
    isFollowing: false,
    createdAt: '2026-08-15',
  },
  {
    _id: 'usr_f3',
    username: 'hoang_nam',
    fullName: 'Lê Hoàng Nam',
    email: 'nam.lh@hust.edu.vn',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&h=120&fit=crop',
    bio: 'Ăn hết các quán cơm bình dân quanh Lê Thanh Nghị 🍚',
    role: 'USER',
    status: 'ACTIVE',
    followersCount: 54,
    followingCount: 62,
    postsCount: 8,
    isFollowing: true,
    createdAt: '2026-10-02',
  },
];

export const FollowersModal: React.FC<FollowersModalProps> = ({
  isOpen,
  onClose,
  title,
  users = SAMPLE_FOLLOWERS,
}) => {
  const [list, setList] = useState<User[]>(users);

  const handleToggleFollow = (userId: string, currentStatus?: boolean) => {
    setList((prev) =>
      prev.map((u) =>
        u._id === userId
          ? {
              ...u,
              isFollowing: !currentStatus,
              followersCount: currentStatus
                ? u.followersCount - 1
                : u.followersCount + 1,
            }
          : u
      )
    );
    if (currentStatus) {
      toast.info('Đã hủy theo dõi');
    } else {
      toast.success('Đã theo dõi thành công!');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-600 dark:text-rose-400" />
          <span className="text-slate-900 dark:text-slate-100">{title}</span>
        </div>
      }
      maxWidth="md"
    >
      <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[60vh] overflow-y-auto">
        {list.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500">
            Chưa có người dùng nào trong danh sách này
          </div>
        ) : (
          list.map((u) => (
            <div
              key={u._id}
              className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/60 rounded-xl px-2 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar src={u.avatarUrl} name={u.fullName} size="md" />
                <div className="min-w-0 text-left">
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {u.fullName}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    @{u.username}
                  </div>
                  {u.bio && (
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                      {u.bio}
                    </div>
                  )}
                </div>
              </div>

              <Button
                variant={u.isFollowing ? 'outline' : 'primary'}
                size="sm"
                onClick={() => handleToggleFollow(u._id, u.isFollowing)}
                leftIcon={
                  u.isFollowing ? (
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <UserPlus className="w-3.5 h-3.5" />
                  )
                }
              >
                {u.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
              </Button>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};

