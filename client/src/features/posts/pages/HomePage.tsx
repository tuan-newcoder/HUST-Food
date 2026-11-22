import React, { useState } from 'react';
import { QuickPostBar } from '../components/QuickPostBar';
import { FeedTabs, FeedTabType } from '../components/FeedTabs';
import { PostCard } from '../components/PostCard';
import { CreatePostModal } from '../components/CreatePostModal';
import { PostDetailPage } from './PostDetailPage';
import { RightWidgets } from '../../../components/layout/RightWidgets';
import { Post } from '@/types/post.types';
import { X, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { PostCardSkeleton } from '@/components/feedback/Skeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';

export const INITIAL_POSTS: Post[] = [
  {
    _id: 'post-1',
    authorId: 'usr_tranglee',
    author: {
      _id: 'usr_tranglee',
      fullName: 'Lê Minh Trang',
      username: 'tranglee',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    },
    postType: 'EXPERIENCE',
    createdAt: '2026-11-10T14:30:00Z',
    title: 'Bún cá cay ngõ Tự Do - Cứu cánh những ngày cuối tháng của sinh viên Bách Khoa!',
    content: 'Hôm nay trời lành lạnh, ghé ngay ngõ Tự Do làm bát bún cá cay đầy đặn. Nước dùng chua ngọt cay nồng chuẩn vị Hải Phòng, cá rô phi rán giòn rụm không bị tanh xíu nào.\n\nĐặc biệt quán cho thêm lòng cá xào dưa siêu đưa miệng. Bát đặc biệt 35k no căng rốn!',
    tags: ['bun-ca-cay', 'ngo-tu-do', 'mon-ngon-bk', 'gia-sinh-vien'],
    images: [
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
    ],
    placeId: 'p1',
    place: {
      _id: 'p1',
      name: 'Bún Cá Cay Hải Phòng - Ngõ Tự Do',
      address: 'Số 18 Ngõ Tự Do, Trần Đại Nghĩa, Hai Bà Trưng',
      averageRatings: {
        taste: 4.8,
        price: 4.5,
        hygiene: 4.2,
        service: 4.4,
        overall: 4.8,
      },
    },
    metrics: {
      yummyCount: 128,
      commentsCount: 34,
      savesCount: 52,
    },
    status: 'PUBLISHED',
    isYummied: true,
    isBookmarked: false,
  },
  {
    _id: 'post-2',
    authorId: 'usr_namhoang',
    author: {
      _id: 'usr_namhoang',
      fullName: 'Hoàng Nam',
      username: 'namhoang_cook',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    },
    postType: 'RECIPE',
    createdAt: '2026-11-09T08:15:00Z',
    title: 'Công thức làm Cơm chiên kim chi bò bằng nồi cơm điện trong KTX',
    content: 'Dành cho các bạn ở ký túc xá B7-B9 không có bếp gas mà vẫn muốn ăn ngon:\n1. Bật nồi cơm điện phi thơm tỏi với chút dầu ăn.\n2. Cho thịt bò xay và kim chi cắt nhỏ vào xào sơ.\n3. Đổ cơm nguội vào đảo đều cùng 1 thìa tương ớt Hàn Quốc.\n4. Đậy nắp bấm Cook 5 phút là có đĩa cơm xèo xèo thơm phức!',
    tags: ['cong-thuc', 'ktx-bach-khoa', 'nau-an-tiet-kiem'],
    images: [
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop',
    ],
    recipeInfo: {
      difficulty: 'EASY',
      cookingTimeMinutes: 15,
      estimatedCost: 35000,
      servings: 2,
      ingredients: [
        { name: 'Thịt bò xay', amount: '100g' },
        { name: 'Kim chi cải thảo', amount: '1 bát nhỏ' },
        { name: 'Cơm nguội', amount: '2 bát' },
        { name: 'Tương ớt Gochujang', amount: '1 thìa canh' },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Phi thơm tỏi trong lòng nồi cơm điện' },
        { stepNumber: 2, instruction: 'Cho thịt bò và kim chi vào đảo đều' },
        { stepNumber: 3, instruction: 'Đổ cơm nguội và tương ớt vào trộn đều, bấm Cook 5 phút' },
      ],
    },
    metrics: {
      yummyCount: 94,
      commentsCount: 19,
      savesCount: 68,
    },
    status: 'PUBLISHED',
    isYummied: false,
    isBookmarked: true,
  },
  {
    _id: 'post-3',
    authorId: 'usr_linhtran',
    author: {
      _id: 'usr_linhtran',
      fullName: 'Trần Thuỳ Linh',
      username: 'linhtran.it',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces',
    },
    postType: 'EXPERIENCE',
    createdAt: '2026-11-08T18:00:00Z',
    title: 'Phát hiện quán Cà phê học bài có điều hoà 24/7 view nhìn thẳng thư viện Tạ Quang Bửu',
    content: 'Không gian yên tĩnh, bàn dài có sẵn ổ cắm điện cho từng chỗ ngồi. Đồ uống giá chỉ từ 25k - 40k, trà đào cam sả thanh mát không quá ngọt. Bạn nào đang ôn thi giữa kỳ chạy deadline đồ án thì đây là chân ái nhé!',
    tags: ['cafe-hoc-bai', 'ta-quang-buu', 'on-thi-bk'],
    images: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&h=400&fit=crop',
    ],
    placeId: 'p3',
    place: {
      _id: 'p3',
      name: 'The Study Cafe & Tea',
      address: 'Tầng 2, 45 Tạ Quang Bửu, Bách Khoa',
      averageRatings: {
        taste: 4.3,
        price: 4.5,
        hygiene: 4.8,
        service: 4.6,
        overall: 4.6,
      },
    },
    metrics: {
      yummyCount: 215,
      commentsCount: 52,
      savesCount: 104,
    },
    status: 'PUBLISHED',
    isYummied: false,
    isBookmarked: false,
  },
];

interface HomePageProps {
  selectedPostId?: string | null;
  onSelectPost?: (postId: string | null) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  selectedPostId,
  onSelectPost,
  searchQuery = '',
  onClearSearch,
}) => {
  const [activeTab, setActiveTab] = useState<FeedTabType>('ALL');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Lọc bài viết theo tab, tag và từ khóa tìm kiếm (F14, F16)
  const filteredPosts = posts.filter((post) => {
    // Lọc theo tag
    if (activeTag && !post.tags.includes(activeTag)) return false;

    // Lọc theo từ khóa tìm kiếm (F16)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchContent = post.content.toLowerCase().includes(q);
      const matchTag = post.tags.some((t) => t.toLowerCase().includes(q));
      const matchPlace = post.place?.name.toLowerCase().includes(q);
      if (!matchTitle && !matchContent && !matchTag && !matchPlace) return false;
    }

    // Lọc theo Tab (F14)
    if (activeTab === 'ALL') return true;
    return post.postType === activeTab;
  });

  // Nếu đang xem chi tiết bài viết (SCR-06)
  const currentDetailPost = posts.find((p) => p._id === selectedPostId);

  if (currentDetailPost) {
    return (
      <PostDetailPage
        post={currentDetailPost}
        onBack={() => onSelectPost?.(null)}
      />
    );
  }

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter((p) => p._id !== postId));
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      const extraPost: Post = {
        _id: 'post_extra_' + Date.now(),
        authorId: 'usr_hust_01',
        author: {
          _id: 'usr_hust_01',
          fullName: 'Lê Anh Tuấn',
          username: 'tuan_le',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        },
        postType: 'EXPERIENCE',
        createdAt: '2026-11-05T12:00:00Z',
        title: 'Bánh mì chảo cột điện ngõ 27 Tạ Quang Bửu - Món ngon không thể bỏ qua',
        content: 'Chảo pate béo ngậy kèm trứng ốp la lòng đào và xúc xích rán giòn. Nước sốt đậm đà chấm bánh mì nóng hổi cực kỳ đưa miệng!',
        tags: ['banh-mi-chao', 'ta-quang-buu', 'mon-ngon-bk'],
        images: [
          'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=400&fit=crop',
        ],
        metrics: {
          yummyCount: 78,
          commentsCount: 12,
          savesCount: 35,
        },
        status: 'PUBLISHED',
      };
      setPosts((prev) => [...prev, extraPost]);
      setIsLoadingMore(false);
      setHasMore(false);
    }, 600);
  };

  return (
    <div className="flex gap-8">
      {/* Center Feed Column */}
      <div className="flex-1 max-w-[700px] w-full min-w-0">
        {/* Quick Post Box */}
        <QuickPostBar onOpenModal={() => setIsCreateModalOpen(true)} />

        {/* Tab Filters */}
        <FeedTabs activeTab={activeTab} onChange={setActiveTab} />

        {/* Active Filters Bar (Search & Tag) */}
        {(activeTag || searchQuery) && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {searchQuery && (
              <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-xl text-xs font-bold">
                <Search className="w-3.5 h-3.5" />
                <span>Tìm kiếm: "{searchQuery}"</span>
                <button
                  type="button"
                  onClick={onClearSearch}
                  className="p-1 hover:bg-blue-200 dark:hover:bg-blue-900/60 rounded-md ml-1 transition-colors"
                  aria-label="Xóa tìm kiếm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {activeTag && (
              <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-brand-600 dark:text-rose-400 px-3 py-1.5 rounded-xl text-xs font-bold">
                <span>Tag: #{activeTag}</span>
                <button
                  type="button"
                  onClick={() => setActiveTag(null)}
                  className="p-1 hover:bg-rose-200 dark:hover:bg-rose-900/60 rounded-md ml-1 transition-colors"
                  aria-label="Bỏ chọn tag"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Posts Stream - 4 States */}
        {isInitialLoading ? (
          <div className="space-y-6">
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        ) : hasError ? (
          <ErrorState
            title="Không thể tải bảng tin"
            message="Đã có lỗi khi nạp các bài viết mới. Vui lòng nhấn nút thử lại để tải lại dữ liệu."
            onRetry={() => {
              setHasError(false);
              setIsInitialLoading(true);
              setTimeout(() => setIsInitialLoading(false), 500);
            }}
          />
        ) : filteredPosts.length === 0 ? (
          <EmptyState
            icon={searchQuery || activeTag ? 'search' : 'food'}
            title={
              searchQuery || activeTag
                ? 'Không tìm thấy bài viết phù hợp'
                : 'Chưa có bài viết nào trong mục này'
            }
            description={
              searchQuery || activeTag
                ? 'Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ bảng tin ẩm thực.'
                : 'Hãy trở thành người đầu tiên chia sẻ món ngon hoặc công thức nấu ăn nhé!'
            }
            actionLabel={
              searchQuery || activeTag
                ? 'Xóa tất cả bộ lọc'
                : 'Chia sẻ bài viết đầu tiên'
            }
            onAction={
              searchQuery || activeTag
                ? () => {
                    onClearSearch?.();
                    setActiveTag(null);
                  }
                : () => setIsCreateModalOpen(true)
            }
          />
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onSelectPost={(id) => onSelectPost?.(id)}
                onFilterTag={(t) => setActiveTag(t)}
                onDeletePost={handleDeletePost}
                onPostUpdated={handlePostUpdated}
              />
            ))}

            {/* Load more trigger */}
            {hasMore ? (
              <div className="text-center pt-2 pb-6">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleLoadMore}
                  isLoading={isLoadingMore}
                  className="rounded-2xl bg-white border-slate-200 text-slate-700 hover:text-brand-600 min-h-[44px]"
                >
                  Tải thêm bài viết cũ hơn...
                </Button>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Bạn đã xem hết các bài viết mới nhất trên bảng tin!</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Column: Trending Tags & Top Reviewers */}
      <RightWidgets onSelectTag={(t) => setActiveTag(t)} />

      {/* Create Post Modal (SCR-05) */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};
