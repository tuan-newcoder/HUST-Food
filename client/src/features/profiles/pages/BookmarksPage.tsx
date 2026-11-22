import React from 'react';
import { Bookmark } from 'lucide-react';
import { BookmarksList } from '../components/BookmarksList';

interface BookmarksPageProps {
  onSelectPlace?: (placeId: string) => void;
  onSelectPost?: (postId: string) => void;
  onExploreMore?: () => void;
}

export const BookmarksPage: React.FC<BookmarksPageProps> = ({
  onSelectPlace,
  onSelectPost,
  onExploreMore,
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4" />
            <span>Mục đã lưu trữ</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quán ăn & Bài viết đã đánh dấu
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-md">
            Bộ sưu tập các quán xá yêu thích quanh Bách Khoa và công thức nấu ăn bạn đã lưu lại để ghé thăm hoặc nấu tại phòng trọ.
          </p>
        </div>
      </div>

      {/* Bookmarks List */}
      <BookmarksList
        onSelectPlace={onSelectPlace}
        onSelectPost={onSelectPost}
        onExploreMore={onExploreMore}
      />
    </div>
  );
};

