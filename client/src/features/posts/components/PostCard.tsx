import React, { useState } from 'react';

export interface PostData {
  id: string;
  type: 'experience' | 'recipe';
  author: {
    name: string;
    username: string;
    avatar: string;
    badge?: string;
  };
  createdAt: string;
  title: string;
  content: string;
  tags: string[];
  images: string[];
  place?: {
    name: string;
    address: string;
    rating: number;
    priceRange?: string;
  };
  recipeInfo?: {
    difficulty: 'Dễ' | 'Trung bình' | 'Khó';
    cookingTime: string;
    cost: string;
  };
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

interface PostCardProps {
  post: PostData;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked || false);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  return (
    <article className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm mb-6 hover:border-slate-300 transition-all">
      {/* Header: Author & Metadata */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0F172A] hover:underline cursor-pointer text-sm">
                {post.author.name}
              </span>
              {post.author.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-[#E11D48] border border-rose-200">
                  {post.author.badge}
                </span>
              )}
            </div>
            <div className="text-xs text-[#64748B] flex items-center gap-1.5 mt-0.5">
              <span>{post.author.username}</span>
              <span>•</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
        </div>

        {/* 3-dots menu button */}
        <button
          title="Tùy chọn"
          className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-50 rounded-lg transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="19" cy="12" r="1"/>
            <circle cx="5" cy="12" r="1"/>
          </svg>
        </button>
      </div>

      {/* Body: Title & Content */}
      <div className="mb-3">
        <h2 className="text-base font-bold text-[#0F172A] mb-1.5 hover:text-[#E11D48] cursor-pointer transition">
          {post.title}
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {post.content}
        </p>

        {/* Hashtags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold text-rose-600 bg-rose-50/80 hover:bg-rose-100 px-2 py-0.5 rounded-md cursor-pointer transition"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Attached Place / Restaurant Metadata */}
      {post.place && (
        <div className="mb-3.5 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#E11D48] shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-[#0F172A]">
                {post.place.name}
              </div>
              <div className="text-xs text-[#64748B]">
                {post.place.address} {post.place.priceRange && `• ${post.place.priceRange}`}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 text-amber-700 font-bold text-xs">
            <span>⭐</span>
            <span>{post.place.rating.toFixed(1)}</span>
          </div>
        </div>
      )}

      {/* Recipe Info Metadata */}
      {post.recipeInfo && (
        <div className="mb-3.5 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-center justify-around text-xs">
          <div>
            <span className="text-[#64748B]">Độ khó: </span>
            <span className="font-bold text-[#0F172A]">{post.recipeInfo.difficulty}</span>
          </div>
          <div className="h-4 w-[1px] bg-amber-200" />
          <div>
            <span className="text-[#64748B]">Thời gian: </span>
            <span className="font-bold text-[#0F172A]">{post.recipeInfo.cookingTime}</span>
          </div>
          <div className="h-4 w-[1px] bg-amber-200" />
          <div>
            <span className="text-[#64748B]">Chi phí: </span>
            <span className="font-bold text-[#0F172A]">{post.recipeInfo.cost}</span>
          </div>
        </div>
      )}

      {/* Image Grid */}
      {post.images && post.images.length > 0 && (
        <div className={`mb-4 rounded-xl overflow-hidden grid gap-1.5 ${
          post.images.length === 1 ? 'grid-cols-1' :
          post.images.length === 2 ? 'grid-cols-2' :
          post.images.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
        }`}>
          {post.images.map((img, idx) => (
            <div
              key={idx}
              className={`relative overflow-hidden group bg-slate-100 ${
                post.images.length === 1 ? 'max-h-[380px]' : 'h-[200px]'
              }`}
            >
              <img
                src={img}
                alt="Post attachment"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}

      {/* Footer Actions: Yummy, Comments, Bookmark, Share */}
      <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9] text-xs font-semibold text-[#64748B]">
        {/* Like / Yummy button */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
            liked
              ? 'text-[#E11D48] bg-rose-50'
              : 'hover:bg-slate-100 hover:text-[#0F172A]'
          }`}
        >
          <svg
            className={`w-4 h-4 transition-transform ${liked ? 'scale-110 fill-[#E11D48] text-[#E11D48]' : 'text-current'}`}
            viewBox="0 0 24 24"
            fill={liked ? '#E11D48' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
          <span>{likesCount} Yummy</span>
        </button>

        {/* Comment button */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-[#0F172A] transition">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span>{post.commentsCount} Bình luận</span>
        </button>

        {/* Bookmark button */}
        <button
          onClick={handleBookmark}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
            bookmarked
              ? 'text-[#F59E0B] bg-amber-50'
              : 'hover:bg-slate-100 hover:text-[#0F172A]'
          }`}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill={bookmarked ? '#F59E0B' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
          </svg>
          <span>{bookmarked ? 'Đã lưu' : 'Lưu'}</span>
        </button>

        {/* Share button */}
        <button
          onClick={() => alert('Đã sao chép liên kết bài viết!')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-[#0F172A] transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
          <span>Chia sẻ</span>
        </button>
      </div>
    </article>
  );
};
