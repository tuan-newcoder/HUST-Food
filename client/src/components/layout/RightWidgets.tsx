import React, { useState } from 'react';
import { Flame, Crown, UserPlus, UserCheck } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { toast } from '@/components/feedback/Toast';

interface RightWidgetsProps {
  onSelectTag?: (tag: string) => void;
}

export const RightWidgets: React.FC<RightWidgetsProps> = ({ onSelectTag }) => {
  const [following, setFollowing] = useState<{ [key: string]: boolean }>({});

  const trendingTags = [
    { tag: 'bun-ca-cay', postsCount: 142, isHot: true },
    { tag: 'ngo-tu-do', postsCount: 98, isHot: true },
    { tag: 'mon-ngon-bk', postsCount: 86, isHot: false },
    { tag: 'cong-thuc', postsCount: 65, isHot: false },
    { tag: 'cafe-hoc-bai', postsCount: 43, isHot: false },
    { tag: 'ta-quang-buu', postsCount: 39, isHot: false },
  ];

  const topReviewers = [
    {
      id: 'rev1',
      name: 'Lê Minh Trang',
      username: 'tranglee',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
      reviewsCount: 38,
      badge: 'Chuyên gia Bún cá',
    },
    {
      id: 'rev2',
      name: 'Trần Hoàng Long',
      username: 'longtran.bk',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      reviewsCount: 29,
      badge: 'Thánh ăn vặt',
    },
    {
      id: 'rev3',
      name: 'Phạm Thuỳ Dung',
      username: 'dungpham_food',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
      reviewsCount: 24,
      badge: 'Reviewer tích cực',
    },
  ];

  const toggleFollow = (id: string, name: string) => {
    const isNowFollowed = !following[id];
    setFollowing((prev) => ({
      ...prev,
      [id]: isNowFollowed,
    }));
    toast.success(
      isNowFollowed ? `Đã theo dõi ${name}!` : `Đã hủy theo dõi ${name}`
    );
  };

  return (
    <aside className="w-[320px] hidden lg:block space-y-6">
      {/* Trending Tags Widget */}
      <div className="bg-white dark:bg-[#151D2C] rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-150">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-brand-600 dark:text-rose-400 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-brand-600 dark:fill-rose-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Chủ đề thịnh hành
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-rose-400 cursor-pointer">
            Xem tất cả
          </span>
        </div>

        <div className="space-y-1.5">
          {trendingTags.map((item, idx) => (
            <div
              key={item.tag}
              onClick={() => {
                onSelectTag?.(item.tag);
                toast.info(`Lọc bài viết theo chủ đề #${item.tag}`);
              }}
              className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 w-4">
                  #{idx + 1}
                </span>
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-rose-400 transition">
                    #{item.tag}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {item.postsCount} bài viết
                  </div>
                </div>
              </div>
              {item.isHot && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-brand-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                  HOT
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Top Reviewers Widget */}
      <div className="bg-white dark:bg-[#151D2C] rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-150">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Crown className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Reviewer nổi bật
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-rose-400 cursor-pointer">
            Xem thêm
          </span>
        </div>

        <div className="space-y-3.5">
          {topReviewers.map((reviewer) => {
            const isFollowed = following[reviewer.id];
            return (
              <div key={reviewer.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar
                    src={reviewer.avatar}
                    name={reviewer.name}
                    size="md"
                    className="ring-2 ring-slate-100 dark:ring-slate-700"
                  />
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight truncate hover:underline cursor-pointer">
                      {reviewer.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {reviewer.reviewsCount} bài review • {reviewer.badge}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFollow(reviewer.id, reviewer.name)}
                  className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                    isFollowed
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-brand-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60'
                  }`}
                >
                  {isFollowed ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Đã theo</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Theo dõi</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Footer Links */}
      <div className="px-3 text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
          <a href="#" className="hover:underline">Về HUST-Food</a>
          <a href="#" className="hover:underline">Điều khoản</a>
          <a href="#" className="hover:underline">Quy tắc cộng đồng</a>
          <a href="#" className="hover:underline">Liên hệ</a>
        </div>
        <div>© 2026 HUST-Food Project • Dành cho sinh viên Bách Khoa</div>
      </div>
    </aside>
  );
};
