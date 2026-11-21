import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MapPin,
  Clock,
  Coins,
  Sparkles,
  MoreHorizontal,
  Flag,
  Trash2,
  Edit3,
  Copy,
  Star,
  UtensilsCrossed,
  ChefHat,
} from 'lucide-react';
import { Post } from '@/types/post.types';
import { Avatar } from '@/components/common/Avatar';
import { Dropdown } from '@/components/common/Dropdown';
import { CommentSection } from './CommentSection';
import { ReportModal } from './ReportModal';
import { EditPostModal } from './EditPostModal';
import { postService } from '@/services/postService';
import { bookmarkService } from '@/services/bookmarkService';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from '@/components/feedback/Toast';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import { cn } from '@/utils/cn';

interface PostCardProps {
  post: Post;
  onSelectPost?: (postId: string) => void;
  onFilterTag?: (tag: string) => void;
  onDeletePost?: (postId: string) => void;
  onPostUpdated?: (updatedPost: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onSelectPost,
  onFilterTag,
  onDeletePost,
  onPostUpdated,
}) => {
  const { user } = useAuthStore();
  const isOwnPost = user?._id === post.author._id || user?._id === post.authorId;

  // Interaction State
  const [isYummied, setIsYummied] = useState(post.isYummied || false);
  const [yummyCount, setYummyCount] = useState(post.metrics?.yummyCount || 0);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [commentsCount, setCommentsCount] = useState(post.metrics?.commentsCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Thả Yummy (Like)
  const handleToggleYummy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isYummied;
    setIsYummied(nextState);
    setYummyCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await postService.toggleYummy(post._id);
    } catch {
      // Optimistic update fallback
    }
  };

  // Lưu Bookmark
  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    if (nextState) {
      toast.success('Đã lưu bài viết vào danh sách Bookmarks!');
    } else {
      toast.info('Đã bỏ lưu bài viết');
    }

    try {
      await bookmarkService.toggleBookmark({
        targetType: 'POST',
        targetId: post._id,
      });
    } catch {
      // Optimistic update fallback
    }
  };

  // Chia sẻ bài viết
  const handleShare = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard?.writeText(window.location.origin + `/#posts-${post._id}`);
    toast.success('Đã sao chép liên kết bài viết vào bộ nhớ tạm!');
  };

  // Xóa bài viết
  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      try {
        await postService.deletePost(post._id);
        toast.info('Đã xóa bài viết thành công');
        onDeletePost?.(post._id);
      } catch {
        toast.info('Đã xóa bài viết khỏi bảng tin');
        onDeletePost?.(post._id);
      }
    }
  };

  return (
    <article className="bg-white dark:bg-[#151D2C] rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm mb-6 hover:shadow-md hover:border-slate-200/80 dark:hover:border-slate-700 transition-all duration-200">
      {/* 1. Header: Author & Options */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar
            src={post.author.avatarUrl}
            name={post.author.fullName}
            size="md"
            className="ring-2 ring-rose-100 dark:ring-rose-900"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                onClick={() => onSelectPost?.(post._id)}
                className="font-bold text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-rose-400 transition cursor-pointer text-sm"
              >
                {post.author.fullName}
              </span>
              <span
                className={cn(
                  'px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1',
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
                    <span>Trải nghiệm quán</span>
                  </>
                )}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>@{post.author.username}</span>
              <span>•</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* 3-dots Menu */}
        <Dropdown
          trigger={
            <button
              type="button"
              aria-label="Tùy chọn bài viết"
              className="min-w-[44px] min-h-[44px] rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          }
          items={[
            {
              label: 'Sao chép liên kết',
              icon: <Copy className="w-4 h-4 text-slate-500" />,
              onClick: () => handleShare(),
            },
            ...(isOwnPost
              ? [
                  {
                    divider: true,
                    label: 'Chỉnh sửa bài viết',
                    icon: <Edit3 className="w-4 h-4 text-blue-500" />,
                    onClick: () => setIsEditModalOpen(true),
                  },
                  {
                    label: 'Xóa bài viết',
                    icon: <Trash2 className="w-4 h-4 text-red-500" />,
                    danger: true,
                    onClick: handleDelete,
                  },
                ]
              : [
                  {
                    divider: true,
                    label: 'Báo cáo vi phạm',
                    icon: <Flag className="w-4 h-4 text-red-500" />,
                    danger: true,
                    onClick: () => setIsReportModalOpen(true),
                  },
                ]),
          ]}
        />
      </div>

      {/* 2. Post Title & Content */}
      <h3
        onClick={() => onSelectPost?.(post._id)}
        className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 leading-snug hover:text-brand-600 dark:hover:text-rose-400 transition cursor-pointer"
      >
        {post.title}
      </h3>

      <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3.5 whitespace-pre-wrap">
        {isExpanded || post.content.length <= 220 ? (
          post.content
        ) : (
          <>
            {post.content.slice(0, 220)}...
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="text-brand-600 dark:text-rose-400 font-bold ml-1.5 hover:underline cursor-pointer"
            >
              Xem thêm
            </button>
          </>
        )}
      </div>

      {/* 3. #Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {post.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onFilterTag?.(tag)}
              className="min-h-[32px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-brand-600 dark:hover:text-rose-300 text-slate-600 dark:text-slate-300 text-xs font-semibold transition"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* 4. Experience Place Snippet */}
      {post.postType === 'EXPERIENCE' && post.place && (
        <div className="mb-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-brand-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-900/60">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {post.place.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {post.place.address}
              </div>
            </div>
          </div>

          {post.place.averageRatings?.overall && (
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border border-amber-200 dark:border-amber-900/60">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{post.place.averageRatings.overall.toFixed(1)}</span>
            </div>
          )}
        </div>
      )}

      {/* 5. Recipe Quick Strip */}
      {post.postType === 'RECIPE' && post.recipeInfo && (
        <div className="mb-4 p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/40 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{post.recipeInfo.cookingTimeMinutes} phút</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{formatCurrency(post.recipeInfo.estimatedCost)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>
              {post.recipeInfo.difficulty === 'EASY'
                ? 'Dễ làm'
                : post.recipeInfo.difficulty === 'MEDIUM'
                ? 'Trung bình'
                : 'Thử thách'}
            </span>
          </div>
        </div>
      )}

      {/* 6. Image Grid (1 to 5 images) */}
      {post.images && post.images.length > 0 && (
        <div className="mb-4 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
          {post.images.length === 1 && (
            <div
              className="h-72 w-full bg-slate-100 dark:bg-slate-800 cursor-pointer overflow-hidden group"
              onClick={() => onSelectPost?.(post._id)}
            >
              <img
                src={post.images[0]}
                alt="preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          )}

          {post.images.length === 2 && (
            <div
              className="grid grid-cols-2 gap-1.5 h-64 bg-slate-100 dark:bg-slate-800 cursor-pointer overflow-hidden"
              onClick={() => onSelectPost?.(post._id)}
            >
              {post.images.map((img, i) => (
                <div key={i} className="overflow-hidden group h-full">
                  <img
                    src={img}
                    alt="preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}

          {post.images.length >= 3 && (
            <div
              className="grid grid-cols-3 gap-1.5 h-60 bg-slate-100 dark:bg-slate-800 cursor-pointer overflow-hidden"
              onClick={() => onSelectPost?.(post._id)}
            >
              {post.images.slice(0, 3).map((img, i) => (
                <div key={i} className="relative h-full overflow-hidden group">
                  <img
                    src={img}
                    alt="preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {i === 2 && post.images.length > 3 && (
                    <div className="absolute inset-0 bg-black/60 text-white font-extrabold text-base flex items-center justify-center backdrop-blur-xs">
                      +{post.images.length - 3} ảnh
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. Action Bar (Yummy, Comments, Bookmark, Share) */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Yummy (Like) button */}
          <button
            type="button"
            onClick={handleToggleYummy}
            className={cn(
              'min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition select-none',
              isYummied
                ? 'bg-rose-50 dark:bg-rose-950/40 text-brand-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
            )}
          >
            <Heart
              className={cn(
                'w-4 h-4 transition-transform duration-150',
                isYummied ? 'fill-brand-600 text-brand-600 scale-110' : 'text-slate-400 dark:text-slate-500'
              )}
            />
            <span>{yummyCount} Yummy</span>
          </button>

          {/* Comment button */}
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className={cn(
              'min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition select-none',
              showComments
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
            )}
          >
            <MessageCircle className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span>{commentsCount} Bình luận</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Bookmark button */}
          <button
            type="button"
            onClick={handleToggleBookmark}
            title={isBookmarked ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}
            className={cn(
              'min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition select-none',
              isBookmarked
                ? 'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            )}
          >
            <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-amber-500 text-amber-500')} />
          </button>

          {/* Share button */}
          <button
            type="button"
            onClick={handleShare}
            title="Sao chép liên kết"
            className="min-w-[44px] min-h-[44px] rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center transition select-none"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 8. Inline Recursive Comment Section */}
      {showComments && (
        <CommentSection
          postId={post._id}
          onCommentCountChange={(cnt) => setCommentsCount(cnt)}
        />
      )}

      {/* F20: Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="POST"
        targetId={post._id}
        targetTitle={post.title}
      />

      {/* F17: Edit Post Modal */}
      <EditPostModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        post={post}
        onPostUpdated={(updated) => onPostUpdated?.(updated)}
      />
    </article>
  );
};
