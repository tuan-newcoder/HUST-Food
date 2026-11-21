import React, { useState } from 'react';
import {
  Settings,
  LogOut,
  Calendar,
  MapPin,
  Utensils,
  Bookmark,
  Grid,
  Heart,
  MessageCircle,
  UserCheck,
  UserPlus,
  UtensilsCrossed,
  ChefHat,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Avatar } from '@/components/common/Avatar';
import { EmptyState } from '@/components/feedback/EmptyState';
import { User } from '@/types/user.types';
import { Post } from '@/types/post.types';
import { useAuthStore, DEMO_USER } from '@/stores/useAuthStore';
import { EditProfileModal } from '../components/EditProfileModal';
import { FollowersModal } from '../components/FollowersModal';
import { BookmarksList } from '../components/BookmarksList';
import { toast } from '@/components/feedback/Toast';
import { formatDate } from '@/utils/formatDate';
import { cn } from '@/utils/cn';

interface ProfilePageProps {
  user?: User | null;
  onSelectPost?: (postId: string) => void;
  onExploreMore?: () => void;
}

// Sample posts authored by this user
const PROFILE_COVER =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&h=500&fit=crop';

const SAMPLE_USER_POSTS: Post[] = [
  {
    _id: 'post_u1',
    authorId: 'usr_hust_01',
    author: {
      _id: 'usr_hust_01',
      username: 'tuan_le',
      fullName: 'Lê Anh Tuấn',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    },
    postType: 'EXPERIENCE',
    title: 'Review chi tiết Bún cá cay ngõ 33 Tạ Quang Bửu - Món ruột của dân CNTT',
    content: 'Nước dùng chua thanh đậm đà từ xương cá và me, chả cá thu rán giòn rụm không bị khô. Bát 35k đầy ú ụ cá, lòng cá và dọc mùng giòn sần sật. Chấm 9/10 điểm cho một buổi trưa no nê!',
    images: [
      'https://images.unsplash.com/photo-1594998893017-36147cbcae05?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80',
    ],
    tags: ['bun-ca-cay', 'ta-quang-buu', 'an-trua-hust'],
    metrics: {
      yummyCount: 148,
      commentsCount: 32,
      savesCount: 65,
    },
    status: 'PUBLISHED',
    isYummied: true,
    isBookmarked: true,
    createdAt: '2026-11-06T11:20:00Z',
  },
  {
    _id: 'post_u2',
    authorId: 'usr_hust_01',
    author: {
      _id: 'usr_hust_01',
      username: 'tuan_le',
      fullName: 'Lê Anh Tuấn',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    },
    postType: 'RECIPE',
    title: 'Cách làm Cơm chiên dưa bò kim chi siêu nhanh trong phòng trọ',
    content: 'Tận dụng cơm nguội tối hôm qua và hộp kim chi siêu thị. Xào thịt bò lửa lớn cho mềm rồi đảo đều cùng cơm và dưa chua giòn sần sật. Mùi thơm nức mũi cả dãy trọ luôn!',
    images: [
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80',
    ],
    tags: ['com-rang-dua-bo', 'phong-tro', 'mon-ngon-de-lam'],
    recipeInfo: {
      cookingTimeMinutes: 15,
      estimatedCost: 35000,
      servings: 2,
      difficulty: 'EASY',
      ingredients: [],
      steps: [],
    },
    metrics: {
      yummyCount: 89,
      commentsCount: 14,
      savesCount: 42,
    },
    status: 'PUBLISHED',
    isYummied: false,
    isBookmarked: false,
    createdAt: '2026-10-28T18:45:00Z',
  },
];

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user: propUser,
  onSelectPost,
  onExploreMore,
}) => {
  const { user: currentAuthUser, logout } = useAuthStore();
  const profileUser: User = propUser || currentAuthUser || DEMO_USER;
  const isOwnProfile = currentAuthUser?._id === profileUser._id;

  const [activeTab, setActiveTab] = useState<'posts' | 'places' | 'bookmarks'>('posts');
  const [postFilter, setPostFilter] = useState<'ALL' | 'EXPERIENCE' | 'RECIPE'>('ALL');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [followersModalTitle, setFollowersModalTitle] = useState<'Người theo dõi' | 'Đang theo dõi' | null>(null);
  const [isFollowing, setIsFollowing] = useState(profileUser.isFollowing || false);
  const [followersCount, setFollowersCount] = useState(profileUser.followersCount);

  const handleToggleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
    toast.success(isFollowing ? 'Đã hủy theo dõi' : `Đang theo dõi ${profileUser.fullName}`);
  };

  const filteredPosts = SAMPLE_USER_POSTS.filter((p) => {
    if (postFilter === 'ALL') return true;
    return p.postType === postFilter;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* 1. Profile Header Card */}
      <div className="bg-white dark:bg-[#151D2C] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-150">
        {/* Cover Banner — ảnh trang trí (User chưa có trường coverImage trong CSDL) */}
        <div className="relative h-36 sm:h-52 w-full overflow-hidden bg-rose-600">
          <img
            src={PROFILE_COVER}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/35 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>Khu vực Bách Khoa • Hà Nội</span>
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="px-5 sm:px-8 pb-8 relative">
          {/* Hàng 1: Avatar (nhô lên ảnh bìa) + nút hành động (nằm hẳn dưới ảnh bìa) */}
          <div className="flex items-end justify-between gap-3">
            <div className="-mt-12 sm:-mt-16 relative z-10 shrink-0">
              <Avatar
                src={profileUser.avatarUrl}
                name={profileUser.fullName}
                size="xl"
                className="w-24 h-24 sm:w-32 sm:h-32 ring-4 ring-white dark:ring-[#151D2C] shadow-xl text-3xl"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2.5 pt-3">
              {isOwnProfile ? (
                <>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setIsEditModalOpen(true)}
                    leftIcon={<Settings className="w-4 h-4" />}
                    className="min-h-[44px]"
                  >
                    <span className="sm:hidden">Sửa hồ sơ</span>
                    <span className="hidden sm:inline">Chỉnh sửa hồ sơ</span>
                  </Button>
                  <button
                    type="button"
                    title="Đăng xuất"
                    onClick={() => {
                      logout();
                      toast.info('Bạn đã đăng xuất tài khoản');
                    }}
                    className="min-w-[44px] min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:border-red-200 dark:hover:border-red-900/60 flex items-center justify-center transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <Button
                  variant={isFollowing ? 'outline' : 'primary'}
                  size="md"
                  onClick={handleToggleFollow}
                  leftIcon={
                    isFollowing ? (
                      <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )
                  }
                  className="min-h-[44px]"
                >
                  {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                </Button>
              )}
            </div>
          </div>

          {/* Hàng 2: Tên & username — luôn nằm dưới ảnh bìa, không đè lên mép */}
          <div className="mt-3 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {profileUser.fullName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-brand-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                K66 • HUST
              </span>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              @{profileUser.username}
            </div>
          </div>

          {/* Bio text */}
          <div className="max-w-2xl text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
            {profileUser.bio ||
              'Chưa có tiểu sử giới thiệu. Nhấn "Chỉnh sửa hồ sơ" để cập nhật sở thích ăn uống của bạn.'}
          </div>

          {/* Meta details & Stats Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
              <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>Gia nhập từ {formatDate(profileUser.createdAt)}</span>
            </div>

            {/* 3 Clickable Stats Counters */}
            <div className="grid grid-cols-3 w-full sm:w-auto sm:flex sm:items-center sm:gap-6 text-center sm:text-left whitespace-nowrap">
              <button
                type="button"
                onClick={() => setFollowersModalTitle('Người theo dõi')}
                className="min-h-[44px] flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 hover:text-brand-600 dark:hover:text-rose-400 transition group select-none"
              >
                <span className="font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-rose-400 text-sm">
                  {followersCount}
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">Người theo dõi</span>
              </button>

              <button
                type="button"
                onClick={() => setFollowersModalTitle('Đang theo dõi')}
                className="min-h-[44px] flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 hover:text-brand-600 dark:hover:text-rose-400 transition group select-none"
              >
                <span className="font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-rose-400 text-sm">
                  {profileUser.followingCount}
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">Đang theo dõi</span>
              </button>

              <div className="min-h-[44px] flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5">
                <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                  {profileUser.postsCount || SAMPLE_USER_POSTS.length}
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">Bài viết</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Profile Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto [scrollbar-width:none]">
        <button
          type="button"
          onClick={() => setActiveTab('posts')}
          className={cn(
            'min-h-[44px] pb-3.5 px-3 sm:px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all select-none whitespace-nowrap shrink-0',
            activeTab === 'posts'
              ? 'border-brand-600 text-brand-600 dark:border-rose-400 dark:text-rose-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          )}
        >
          <Grid className="w-4 h-4" />
          <span>Bài viết ({SAMPLE_USER_POSTS.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('places')}
          className={cn(
            'min-h-[44px] pb-3.5 px-3 sm:px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all select-none whitespace-nowrap shrink-0',
            activeTab === 'places'
              ? 'border-brand-600 text-brand-600 dark:border-rose-400 dark:text-rose-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          )}
        >
          <Utensils className="w-4 h-4" />
          <span>Quán đã đóng góp</span>
        </button>

        {isOwnProfile && (
          <button
            type="button"
            onClick={() => setActiveTab('bookmarks')}
            className={cn(
              'min-h-[44px] pb-3.5 px-3 sm:px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all select-none whitespace-nowrap shrink-0',
              activeTab === 'bookmarks'
                ? 'border-brand-600 text-brand-600 dark:border-rose-400 dark:text-rose-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            )}
          >
            <Bookmark className="w-4 h-4" />
            <span>Mục đã lưu</span>
          </button>
        )}
      </div>

      {/* 3. Tab Contents */}
      {/* TAB 1: POSTS */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {/* Sub Filters for Posts */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPostFilter('ALL')}
              className={cn(
                'min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition',
                postFilter === 'ALL'
                  ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tất cả bài viết</span>
            </button>
            <button
              onClick={() => setPostFilter('EXPERIENCE')}
              className={cn(
                'min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition',
                postFilter === 'EXPERIENCE'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              )}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Trải nghiệm quán</span>
            </button>
            <button
              onClick={() => setPostFilter('RECIPE')}
              className={cn(
                'min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition',
                postFilter === 'RECIPE'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              )}
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Công thức nấu ăn</span>
            </button>
          </div>

          {/* Posts Grid */}
          {filteredPosts.length === 0 ? (
            <EmptyState
              icon="food"
              title="Chưa có bài viết trong danh mục này"
              description="Hãy chia sẻ những quán ăn ngon quanh trường hoặc bí quyết nấu nướng tại phòng trọ nhé!"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredPosts.map((post) => (
                <div
                  key={post._id}
                  onClick={() => onSelectPost?.(post._id)}
                  className="bg-white dark:bg-[#151D2C] rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1',
                          post.postType === 'RECIPE'
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-brand-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60'
                        )}
                      >
                        {post.postType === 'RECIPE' ? (
                          <>
                            <ChefHat className="w-3 h-3" />
                            <span>Công thức</span>
                          </>
                        ) : (
                          <>
                            <UtensilsCrossed className="w-3 h-3" />
                            <span>Trải nghiệm</span>
                          </>
                        )}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-2 mb-2 hover:text-brand-600 dark:hover:text-rose-400 transition">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 mb-3 leading-relaxed">
                      {post.content}
                    </p>

                    {/* Image preview */}
                    {post.images && post.images.length > 0 && (
                      <div className="h-44 rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800">
                        <img
                          src={post.images[0]}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>

                  {/* Metrics footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-brand-600 dark:text-rose-400 font-bold">
                        <Heart className="w-3.5 h-3.5 fill-brand-600 dark:fill-rose-400 text-brand-600 dark:text-rose-400" />
                        <span>{post.metrics.yummyCount}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span>{post.metrics.commentsCount}</span>
                      </span>
                    </div>
                    <span className="text-brand-600 dark:text-rose-400 font-semibold text-xs flex items-center gap-1">
                      <span>Xem bài viết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PLACES CONTRIBUTED */}
      {activeTab === 'places' && (
        <div className="bg-white dark:bg-[#151D2C] rounded-3xl p-10 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/60">
            <Utensils className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
            Quán ăn đã đóng góp lên bản đồ
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            Người dùng này đã đóng góp 2 địa điểm ẩm thực quanh Đại học Bách Khoa Hà Nội.
          </p>
          <div className="text-xs font-semibold text-brand-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5 border border-rose-100 dark:border-rose-900/60">
            <MapPin className="w-3.5 h-3.5" />
            <span>Bún cá cay Hải Phòng & Cơm niêu Kombo</span>
          </div>
        </div>
      )}

      {/* TAB 3: BOOKMARKS (SCR-07 / F05) */}
      {activeTab === 'bookmarks' && (
        <BookmarksList onExploreMore={onExploreMore} />
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={profileUser}
      />

      {/* Followers / Following Modal */}
      {followersModalTitle && (
        <FollowersModal
          isOpen={!!followersModalTitle}
          onClose={() => setFollowersModalTitle(null)}
          title={followersModalTitle}
        />
      )}
    </div>
  );
};
