import React, { useState } from 'react';
import { Bookmark as BookmarkIcon, MapPin, Star, Utensils, Heart, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Avatar } from '@/components/common/Avatar';
import { EmptyState } from '@/components/feedback/EmptyState';
import { BookmarkTargetType } from '@/types/bookmark.types';
import { Place } from '@/types/place.types';
import { Post } from '@/types/post.types';
import { toast } from '@/components/feedback/Toast';
import { formatCurrency } from '@/utils/formatCurrency';
import { cn } from '@/utils/cn';

// Dữ liệu mẫu phong phú ban đầu cho Bookmarks
const SAMPLE_BOOKMARKED_PLACES: Place[] = [
  {
    _id: 'p1',
    name: 'Bún Cá Cay Hải Phòng - Tạ Quang Bửu',
    category: 'STREET_FOOD',
    address: 'Kiot 14, Ngõ 33 Tạ Quang Bửu, Hai Bà Trưng, Hà Nội',
    coverImage: 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?w=500&auto=format&fit=crop&q=80',
    priceRange: { min: 35000, max: 50000 },
    averageRatings: {
      taste: 4.8,
      price: 4.5,
      hygiene: 4.2,
      service: 4.4,
      overall: 4.7,
    },
    totalReviews: 86,
    isBookmarked: true,
    createdAt: '2026-10-10',
  },
  {
    _id: 'p2',
    name: 'Cơm Niêu Singapore Kombo - Lê Thanh Nghị',
    category: 'RESTAURANT',
    address: '110 Lê Thanh Nghị, Bách Khoa, Hai Bà Trưng, Hà Nội',
    coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    priceRange: { min: 65000, max: 110000 },
    averageRatings: {
      taste: 4.6,
      price: 3.9,
      hygiene: 4.8,
      service: 4.5,
      overall: 4.5,
    },
    totalReviews: 124,
    isBookmarked: true,
    createdAt: '2026-09-20',
  },
  {
    _id: 'p3',
    name: 'Cà phê Học bài The Coffee House - Trần Đại Nghĩa',
    category: 'CAFE',
    address: '68 Trần Đại Nghĩa, Đồng Tâm, Hai Bà Trưng, Hà Nội',
    coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=80',
    priceRange: { min: 39000, max: 69000 },
    averageRatings: {
      taste: 4.3,
      price: 4.0,
      hygiene: 4.9,
      service: 4.7,
      overall: 4.5,
    },
    totalReviews: 210,
    isBookmarked: true,
    createdAt: '2026-08-11',
  },
];

const SAMPLE_BOOKMARKED_POSTS: Post[] = [
  {
    _id: 'post_b1',
    authorId: 'usr_02',
    author: {
      _id: 'usr_02',
      username: 'lananh_foodie',
      fullName: 'Vũ Lan Anh',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
    },
    postType: 'RECIPE',
    title: 'Bí kíp làm Trứng chiên cà chua chuẩn vị sinh viên lười chỉ trong 10 phút',
    content: 'Món ăn quốc dân chống cháy những ngày cuối tháng của sinh viên Bách Khoa. Chỉ cần 2 quả trứng gà, 1 quả cà chua và chút hành lá...',
    images: ['https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80'],
    tags: ['mon-ngon-sinh-vien', 'nau-an-tai-phong', 'tiet-kiem'],
    metrics: {
      yummyCount: 156,
      commentsCount: 23,
      savesCount: 88,
    },
    recipeInfo: {
      cookingTimeMinutes: 10,
      estimatedCost: 15000,
      servings: 1,
      difficulty: 'EASY',
      ingredients: [],
      steps: [],
    },
    status: 'PUBLISHED',
    isBookmarked: true,
    createdAt: '2026-10-25T10:00:00Z',
  },
  {
    _id: 'post_b2',
    authorId: 'usr_03',
    author: {
      _id: 'usr_03',
      username: 'bachkhoa_eats',
      fullName: 'Hội Ăn Sập Bách Khoa',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop',
    },
    postType: 'EXPERIENCE',
    title: 'Review quán bánh mì chảo cột điện ngõ Tạ Quang Bửu có thực sự ngon như lời đồn?',
    content: 'Chảo đầy đặn pate béo ngậy, xúc xích và sốt cay sánh quyện. Giá chỉ 35k kèm bánh mì giòn rụm rất đáng thử cho bữa xế!',
    images: ['https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop&q=80'],
    tags: ['banh-mi-chao', 'ta-quang-buu', 'an-chieu'],
    metrics: {
      yummyCount: 312,
      commentsCount: 45,
      savesCount: 142,
    },
    status: 'PUBLISHED',
    isBookmarked: true,
    createdAt: '2026-11-01T14:30:00Z',
  },
];

interface BookmarksListProps {
  onSelectPlace?: (placeId: string) => void;
  onSelectPost?: (postId: string) => void;
  onExploreMore?: () => void;
}

export const BookmarksList: React.FC<BookmarksListProps> = ({
  onSelectPlace,
  onSelectPost,
  onExploreMore,
}) => {
  const [activeTab, setActiveTab] = useState<BookmarkTargetType>('PLACE');
  const [places, setPlaces] = useState<Place[]>(SAMPLE_BOOKMARKED_PLACES);
  const [posts, setPosts] = useState<Post[]>(SAMPLE_BOOKMARKED_POSTS);

  const handleRemovePlaceBookmark = (placeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaces((prev) => prev.filter((p) => p._id !== placeId));
    toast.info('Đã xóa quán khỏi danh sách đã lưu');
  };

  const handleRemovePostBookmark = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts((prev) => prev.filter((p) => p._id !== postId));
    toast.info('Đã xóa bài viết khỏi danh sách đã lưu');
  };

  return (
    <div className="w-full">
      {/* Sub-tab Pill Switcher */}
      <div className="flex items-center gap-2 mb-6 p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl w-fit transition-colors duration-150">
        <button
          type="button"
          onClick={() => setActiveTab('PLACE')}
          className={cn(
            'min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all select-none',
            activeTab === 'PLACE'
              ? 'bg-white dark:bg-[#151D2C] text-brand-600 dark:text-rose-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          )}
        >
          <Utensils className="w-4 h-4" />
          <span>Quán ăn yêu thích ({places.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('POST')}
          className={cn(
            'min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all select-none',
            activeTab === 'POST'
              ? 'bg-white dark:bg-[#151D2C] text-brand-600 dark:text-rose-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          )}
        >
          <BookmarkIcon className="w-4 h-4" />
          <span>Bài viết & Công thức ({posts.length})</span>
        </button>
      </div>

      {/* Tab: PLACES */}
      {activeTab === 'PLACE' && (
        <div>
          {places.length === 0 ? (
            <EmptyState
              icon="bookmark"
              title="Chưa có quán ăn nào được lưu"
              description="Hãy khám phá các quán xá quanh khu vực Bách Khoa và nhấn biểu tượng Bookmark để lưu lại ghé thăm nhé!"
              actionLabel="Khám phá quán ăn ngay"
              onAction={onExploreMore}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {places.map((place) => (
                <div
                  key={place._id}
                  onClick={() => onSelectPlace?.(place._id)}
                  className="group bg-white dark:bg-[#151D2C] rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={place.coverImage}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow-sm">
                      {place.category === 'STREET_FOOD' && 'Ăn vặt vỉa hè'}
                      {place.category === 'RESTAURANT' && 'Nhà hàng / Cơm'}
                      {place.category === 'CAFE' && 'Cà phê & Trà'}
                      {place.category === 'BAKERY' && 'Tiệm bánh'}
                    </div>

                    <button
                      type="button"
                      title="Bỏ lưu quán"
                      onClick={(e) => handleRemovePlaceBookmark(place._id, e)}
                      className="absolute top-3 right-3 min-w-[44px] min-h-[44px] rounded-full bg-white/95 dark:bg-slate-900/95 text-amber-500 hover:text-red-500 hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center shadow-md transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-rose-400 transition line-clamp-1 mb-1.5">
                        {place.name}
                      </h4>
                      <div className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{place.address}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-900/60">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{place.averageRatings?.overall.toFixed(1) || '4.5'}</span>
                        <span className="text-[10px] text-amber-800 dark:text-amber-300 font-normal">
                          ({place.totalReviews || 0})
                        </span>
                      </div>

                      <div className="font-semibold text-slate-600 dark:text-slate-300">
                        {formatCurrency(place.priceRange.min)} - {formatCurrency(place.priceRange.max)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: POSTS */}
      {activeTab === 'POST' && (
        <div>
          {posts.length === 0 ? (
            <EmptyState
              icon="bookmark"
              title="Chưa có bài viết hay công thức nào được lưu"
              description="Lướt bảng tin để đọc các bài review quán ngon và công thức nấu ăn, sau đó click nút Lưu để xem lại tại đây!"
              actionLabel="Lướt bảng tin ngay"
              onAction={onExploreMore}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {posts.map((post) => (
                <div
                  key={post._id}
                  onClick={() => onSelectPost?.(post._id)}
                  className="group bg-white dark:bg-[#151D2C] rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Author & unbookmark button */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          src={post.author.avatarUrl}
                          name={post.author.fullName}
                          size="sm"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                            {post.author.fullName}
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500">
                            @{post.author.username}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        title="Bỏ lưu bài viết"
                        onClick={(e) => handleRemovePostBookmark(post._id, e)}
                        className="min-w-[44px] min-h-[44px] rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-center transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Post Content preview */}
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-rose-400 transition line-clamp-2 mb-1.5">
                      {post.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                      {post.content}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Thumbnail & metrics */}
                  <div>
                    {post.images && post.images.length > 0 && (
                      <div className="h-40 rounded-2xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800">
                        <img
                          src={post.images[0]}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-brand-600 dark:text-rose-400 font-semibold">
                          <Heart className="w-3.5 h-3.5 fill-brand-600 dark:fill-rose-400 text-brand-600 dark:text-rose-400" />
                          <span>{post.metrics.yummyCount}</span>
                        </span>
                        <span>{post.metrics.commentsCount} bình luận</span>
                      </div>
                      <span className="text-xs font-semibold text-brand-600 dark:text-rose-400 flex items-center gap-1">
                        <span>Xem chi tiết</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
