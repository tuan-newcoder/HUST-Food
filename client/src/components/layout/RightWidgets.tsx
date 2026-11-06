import React, { useState } from 'react';

export const RightWidgets: React.FC = () => {
  const [following, setFollowing] = useState<{ [key: string]: boolean }>({});

  const trendingTags = [
    { tag: 'bun-ca-cay', postsCount: 142, isHot: true },
    { tag: 'pho-bo-nam-dinh', postsCount: 98, isHot: true },
    { tag: 'tra-chanh-ta-quang-buu', postsCount: 86, isHot: false },
    { tag: 'com-suon-nuong', postsCount: 65, isHot: false },
    { tag: 'healthy-bach-khoa', postsCount: 43, isHot: false },
    { tag: 'cafe-hoc-bai', postsCount: 39, isHot: false },
  ];

  const topReviewers = [
    {
      id: 'rev1',
      name: 'Lê Minh Trang',
      username: '@tranglee',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
      reviewsCount: 38,
      badge: 'Chuyên gia Bún cá',
    },
    {
      id: 'rev2',
      name: 'Trần Hoàng Long',
      username: '@longtran.bk',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      reviewsCount: 29,
      badge: 'Thánh ăn vặt',
    },
    {
      id: 'rev3',
      name: 'Phạm Thuỳ Dung',
      username: '@dungpham_food',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
      reviewsCount: 24,
      badge: 'Reviewer tích cực',
    },
  ];

  const toggleFollow = (id: string) => {
    setFollowing((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <aside className="w-[320px] hidden lg:block space-y-6">
      {/* Trending Tags Widget */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-rose-500 font-bold text-lg">🔥</span>
            <h3 className="font-bold text-[#0F172A] text-[15px]">
              Chủ đề thịnh hành
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[#64748B] hover:text-[#E11D48] cursor-pointer">
            Xem tất cả
          </span>
        </div>

        <div className="space-y-3">
          {trendingTags.map((item, idx) => (
            <div
              key={item.tag}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-slate-400 w-4">
                  #{idx + 1}
                </span>
                <div>
                  <div className="text-sm font-semibold text-[#0F172A] group-hover:text-[#E11D48] transition">
                    #{item.tag}
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    {item.postsCount} bài viết
                  </div>
                </div>
              </div>
              {item.isHot && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-[#E11D48]">
                  HOT
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Top Reviewers Widget */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 font-bold text-lg">👑</span>
            <h3 className="font-bold text-[#0F172A] text-[15px]">
              Reviewer nổi bật
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[#64748B] hover:text-[#E11D48] cursor-pointer">
            Xem thêm
          </span>
        </div>

        <div className="space-y-3.5">
          {topReviewers.map((reviewer) => {
            const isFollowed = following[reviewer.id];
            return (
              <div key={reviewer.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={reviewer.avatar}
                    alt={reviewer.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <div className="text-sm font-bold text-[#0F172A] leading-tight hover:underline cursor-pointer">
                      {reviewer.name}
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      {reviewer.reviewsCount} bài đánh giá
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollow(reviewer.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isFollowed
                      ? 'bg-slate-100 text-[#64748B] hover:bg-slate-200'
                      : 'bg-[#FFF1F2] text-[#E11D48] hover:bg-rose-100'
                  }`}
                >
                  {isFollowed ? 'Đã theo dõi' : '+ Theo dõi'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Footer Links */}
      <div className="px-2 text-xs text-[#94A3B8] leading-relaxed">
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
          <a href="#" className="hover:underline">Về HUST-Food</a>
          <a href="#" className="hover:underline">Điều khoản</a>
          <a href="#" className="hover:underline">Quy tắc cộng đồng</a>
          <a href="#" className="hover:underline">Liên hệ</a>
        </div>
        <div>© 2026 HUST-Food Project • Made for Bách Khoa students</div>
      </div>
    </aside>
  );
};
