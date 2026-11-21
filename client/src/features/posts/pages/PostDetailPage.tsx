import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Share2,
  Clock,
  Coins,
  Sparkles,
  MapPin,
  Star,
  CheckSquare,
  Square,
  UserCheck,
  UserPlus,
  Flag,
  UtensilsCrossed,
  ChefHat,
} from 'lucide-react';
import { Post } from '@/types/post.types';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { CommentSection } from '../components/CommentSection';
import { ReportModal } from '../components/ReportModal';
import { postService } from '@/services/postService';
import { bookmarkService } from '@/services/bookmarkService';
import { toast } from '@/components/feedback/Toast';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import { cn } from '@/utils/cn';

interface PostDetailPageProps {
  post: Post;
  onBack: () => void;
}

export const PostDetailPage: React.FC<PostDetailPageProps> = ({ post, onBack }) => {
  const [isYummied, setIsYummied] = useState(post.isYummied || false);
  const [yummyCount, setYummyCount] = useState(post.metrics?.yummyCount || 0);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<number[]>([]);

  const handleToggleYummy = async () => {
    const next = !isYummied;
    setIsYummied(next);
    setYummyCount((prev) => (next ? prev + 1 : Math.max(0, prev - 1)));
    try {
      await postService.toggleYummy(post._id);
    } catch {}
  };

  const handleToggleBookmark = async () => {
    const next = !isBookmarked;
    setIsBookmarked(next);
    toast.success(next ? 'Đã lưu bài viết vào Bookmarks!' : 'Đã bỏ lưu bài viết');
    try {
      await bookmarkService.toggleBookmark({
        targetType: 'POST',
        targetId: post._id,
      });
    } catch {}
  };

  const handleToggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Đã sao chép liên kết bài viết!');
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="min-h-[44px] mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-rose-400 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại Bảng tin</span>
      </button>

      {/* Main Post Container */}
      <article className="bg-white dark:bg-[#151D2C] rounded-3xl p-6 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-sm mb-8 transition-colors duration-150">
        {/* Author Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 sm:gap-4">
            <Avatar
              src={post.author.avatarUrl}
              name={post.author.fullName}
              size="lg"
              className="ring-2 ring-rose-100 dark:ring-rose-900"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
                  {post.author.fullName}
                </h3>
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1',
                    post.postType === 'RECIPE'
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-brand-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60'
                  )}
                >
                  {post.postType === 'RECIPE' ? (
                    <>
                      <ChefHat className="w-3.5 h-3.5" />
                      <span>Công thức nấu ăn</span>
                    </>
                  ) : (
                    <>
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                      <span>Trải nghiệm quán</span>
                    </>
                  )}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                @{post.author.username} • Đăng ngày {formatDate(post.createdAt)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isFollowing ? 'outline' : 'primary'}
              size="sm"
              onClick={() => {
                setIsFollowing(!isFollowing);
                toast.success(isFollowing ? 'Đã hủy theo dõi' : `Đang theo dõi ${post.author.fullName}`);
              }}
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

            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              title="Báo cáo vi phạm"
              className="min-w-[44px] min-h-[44px] rounded-xl text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-center transition"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Full Content */}
        <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap mb-8">
          {post.content}
        </div>

        {/* Linked Place Card (If EXPERIENCE) */}
        {post.postType === 'EXPERIENCE' && post.place && (
          <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {post.place.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {post.place.address}
                  </p>
                </div>
              </div>

              {post.place.averageRatings?.overall && (
                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-amber-600 dark:text-amber-400 font-bold text-sm shadow-sm">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{post.place.averageRatings.overall.toFixed(1)} / 5.0</span>
                </div>
              )}
            </div>

            {/* 4 Criteria Rating breakdown */}
            {post.place.averageRatings && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Hương vị</div>
                  <div className="font-extrabold text-amber-700 dark:text-amber-400 text-sm flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{post.place.averageRatings.taste?.toFixed(1) || '4.5'}</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Giá cả</div>
                  <div className="font-extrabold text-amber-700 dark:text-amber-400 text-sm flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{post.place.averageRatings.price?.toFixed(1) || '4.5'}</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Vệ sinh</div>
                  <div className="font-extrabold text-amber-700 dark:text-amber-400 text-sm flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{post.place.averageRatings.hygiene?.toFixed(1) || '4.2'}</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-center">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Phục vụ</div>
                  <div className="font-extrabold text-amber-700 dark:text-amber-400 text-sm flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{post.place.averageRatings.service?.toFixed(1) || '4.4'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recipe Info Block (If RECIPE) */}
        {post.postType === 'RECIPE' && post.recipeInfo && (
          <div className="mb-8 p-6 rounded-3xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-amber-200/50 dark:border-amber-900/30 shadow-sm">
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Thời gian
                </div>
                <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                  {post.recipeInfo.cookingTimeMinutes} phút
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-amber-200/50 dark:border-amber-900/30 shadow-sm">
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mb-1">
                  <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Chi phí
                </div>
                <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                  {formatCurrency(post.recipeInfo.estimatedCost)}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-amber-200/50 dark:border-amber-900/30 shadow-sm">
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Độ khó
                </div>
                <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                  {post.recipeInfo.difficulty === 'EASY'
                    ? 'Dễ làm'
                    : post.recipeInfo.difficulty === 'MEDIUM'
                    ? 'Trung bình'
                    : 'Thử thách'}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-amber-200/50 dark:border-amber-900/30 shadow-sm">
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mb-1">
                  <ChefHat className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Khẩu phần
                </div>
                <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                  {post.recipeInfo.servings || 2} người ăn
                </div>
              </div>
            </div>

            {/* Ingredients Checklist */}
            {post.recipeInfo.ingredients && post.recipeInfo.ingredients.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-3 flex items-center gap-2">
                  <span>Nguyên liệu chuẩn bị ({post.recipeInfo.ingredients.length})</span>
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                    (nhấn để đánh dấu đã mua/chuẩn bị)
                  </span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {post.recipeInfo.ingredients.map((ing, idx) => {
                    const isChecked = checkedIngredients.includes(idx);
                    return (
                      <div
                        key={idx}
                        onClick={() => handleToggleIngredient(idx)}
                        className={cn(
                          'flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition select-none',
                          isChecked
                            ? 'bg-amber-100/60 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-slate-400 dark:text-slate-500 line-through'
                            : 'bg-white dark:bg-slate-800 border-amber-200/70 dark:border-amber-900/50 text-slate-800 dark:text-slate-200 hover:border-amber-400'
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-amber-500 shrink-0" />
                          )}
                          <span className="text-xs sm:text-sm font-semibold">
                            {ing.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                          {ing.amount}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Steps Timeline */}
            {post.recipeInfo.steps && post.recipeInfo.steps.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-4">
                  Các bước thực hiện ({post.recipeInfo.steps.length} bước)
                </h4>
                <div className="space-y-4">
                  {post.recipeInfo.steps.map((st) => (
                    <div
                      key={st.stepNumber}
                      className="flex items-start gap-3.5 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-amber-200/50 dark:border-amber-900/30"
                    >
                      <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                        {st.stepNumber}
                      </div>
                      <div className="flex-1 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed pt-0.5">
                        {st.instruction}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Images Gallery */}
        {post.images && post.images.length > 0 && (
          <div className="mb-8 space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              Hình ảnh thực tế ({post.images.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {post.images.map((img, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm h-64 bg-slate-100 dark:bg-slate-800"
                >
                  <img
                    src={img}
                    alt={`Ảnh ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Interaction Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleYummy}
              className={cn(
                'min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition select-none',
                isYummied
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-brand-600 dark:text-rose-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <Heart
                className={cn(
                  'w-5 h-5 transition-transform duration-150',
                  isYummied ? 'fill-brand-600 text-brand-600 scale-110' : 'text-slate-400 dark:text-slate-500'
                )}
              />
              <span>{yummyCount} Yummy</span>
            </button>

            <button
              type="button"
              onClick={handleToggleBookmark}
              className={cn(
                'min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition select-none',
                isBookmarked
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <Bookmark
                className={cn('w-5 h-5', isBookmarked && 'fill-amber-500 text-amber-500')}
              />
              <span>{isBookmarked ? 'Đã lưu' : 'Lưu lại'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold flex items-center gap-2 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Chia sẻ</span>
          </button>
        </div>
      </article>

      {/* Recursive Comment Section */}
      <CommentSection postId={post._id} />

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="POST"
        targetId={post._id}
        targetTitle={post.title}
      />
    </div>
  );
};
