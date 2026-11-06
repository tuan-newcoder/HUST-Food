import React, { useState } from 'react';
import { QuickPostBar } from '../components/QuickPostBar';
import { FeedTabs, FeedTabType } from '../components/FeedTabs';
import { PostCard, PostData } from '../components/PostCard';
import { RightWidgets } from '../../../components/layout/RightWidgets';

const INITIAL_POSTS: PostData[] = [
  {
    id: 'post-1',
    type: 'experience',
    author: {
      name: 'Lê Minh Trang',
      username: '@tranglee',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
      badge: 'Top Reviewer',
    },
    createdAt: '15 phút trước',
    title: 'Bún cá cay ngõ Tự Do - Cứu cánh những ngày cuối tháng của sinh viên Bách Khoa!',
    content: 'Hôm nay trời lành lạnh, ghé ngay ngõ Tự Do làm bát bún cá cay đầy đặn. Nước dùng chua ngọt cay nồng chuẩn vị Hải Phòng, cá rô phi rán giòn rụm không bị tanh xíu nào.\n\nĐặc biệt quán cho thêm lòng cá xào dưa siêu đưa miệng. Bát đặc biệt 35k no căng rốn!',
    tags: ['bun-ca-cay', 'ngo-tu-do', 'mon-ngon-bk', 'gia-sinh-vien'],
    images: [
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
    ],
    place: {
      name: 'Bún Cá Cay Hải Phòng - Ngõ Tự Do',
      address: 'Số 18 Ngõ Tự Do, Trần Đại Nghĩa, Hai Bà Trưng',
      rating: 4.8,
      priceRange: '30.000đ - 40.000đ',
    },
    likesCount: 128,
    commentsCount: 34,
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: 'post-2',
    type: 'recipe',
    author: {
      name: 'Hoàng Nam',
      username: '@namhoang_cook',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
      badge: 'Bếp Trưởng KTX',
    },
    createdAt: '2 giờ trước',
    title: 'Công thức làm Cơm chiên kim chi bò bằng nồi cơm điện trong KTX',
    content: 'Dành cho các bạn ở ký túc xá B7-B9 không có bếp gas mà vẫn muốn ăn ngon:\n1. Bật nồi cơm điện phi thơm tỏi với chút dầu ăn.\n2. Cho thịt bò xay và kim chi cắt nhỏ vào xào sơ.\n3. Đổ cơm nguội vào đảo đều cùng 1 thìa tương ớt Hàn Quốc.\n4. Đậy nắp bấm Cook 5 phút là có đĩa cơm xèo xèo thơm phức!',
    tags: ['cong-thuc', 'ktx-bach-khoa', 'nau-an-tiet-kiem'],
    images: [
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop',
    ],
    recipeInfo: {
      difficulty: 'Dễ',
      cookingTime: '15 phút',
      cost: '35.000 VNĐ',
    },
    likesCount: 94,
    commentsCount: 19,
    isLiked: false,
    isBookmarked: true,
  },
  {
    id: 'post-3',
    type: 'experience',
    author: {
      name: 'Trần Thuỳ Linh',
      username: '@linhtran.it',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces',
    },
    createdAt: '5 giờ trước',
    title: 'Phát hiện quán Cà phê học bài có điều hoà 24/7 view nhìn thẳng thư viện Tạ Quang Bửu',
    content: 'Không gian yên tĩnh, bàn dài có sẵn ổ cắm điện cho từng chỗ ngồi. Đồ uống giá chỉ từ 25k - 40k, trà đào cam sả thanh mát không quá ngọt. Bạn nào đang ôn thi giữa kỳ chạy deadline đồ án thì đây là chân ái nhé!',
    tags: ['cafe-hoc-bai', 'ta-quang-buu', 'on-thi-bk'],
    images: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop',
    ],
    place: {
      name: 'The Study Cafe & Tea',
      address: 'Tầng 2, 45 Tạ Quang Bửu, Bách Khoa',
      rating: 4.6,
      priceRange: '25.000đ - 45.000đ',
    },
    likesCount: 215,
    commentsCount: 52,
    isLiked: false,
    isBookmarked: false,
  },
];

export const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FeedTabType>('all');
  const [posts] = useState<PostData[]>(INITIAL_POSTS);

  const filteredPosts = posts.filter((post) => {
    if (activeTab === 'all') return true;
    return post.type === activeTab;
  });

  return (
    <div className="flex gap-8">
      {/* Center Feed Column */}
      <div className="flex-1 max-w-[680px]">
        {/* Quick Post Box */}
        <QuickPostBar onOpenModal={() => alert('Mở popup soạn thảo bài viết mới!')} />

        {/* Tab Filters */}
        <FeedTabs activeTab={activeTab} onChange={setActiveTab} />

        {/* Posts Stream */}
        <div>
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* Right Column: Trending Tags & Top Reviewers */}
      <RightWidgets />
    </div>
  );
};
