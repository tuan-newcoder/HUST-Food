import { create } from 'zustand';
import { AppNotification } from '@/types/notification.types';

/**
 * Store thông báo. Hiện dùng dữ liệu mẫu; khi Backend sẵn sàng:
 *  - load(): notificationService.getNotifications()
 *  - markRead / markAllRead: gọi PATCH tương ứng
 *  - push(): gọi từ listener Socket.IO sự kiện 'notification:new'
 */
interface NotificationState {
  items: AppNotification[];
  push: (n: AppNotification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const ago = (minutes: number) => new Date(Date.now() - minutes * 60000).toISOString();

const sender = (id: string, fullName: string, username: string) => ({ _id: id, fullName, username, avatarUrl: '' });

const POST_1 = { _id: 'post-1', title: 'Bún cá cay ngõ Tự Do - Cứu cánh những ngày cuối tháng của sinh viên Bách Khoa!' };
const POST_2 = { _id: 'post-2', title: 'Công thức làm Cơm chiên kim chi bò bằng nồi cơm điện trong KTX' };
const POST_3 = { _id: 'post-3', title: 'Phát hiện quán Cà phê học bài có điều hoà 24/7 view nhìn thẳng thư viện Tạ Quang Bửu' };

const INITIAL: AppNotification[] = [
  { _id: 'n1', type: 'COMMENT', sender: sender('u2', 'Nguyễn Minh Anh', 'minhanh'), post: POST_1, isRead: false, createdAt: ago(2) },
  { _id: 'n2', type: 'YUMMY', sender: sender('u3', 'Trần Hoàng Long', 'longtran.bk'), post: POST_1, isRead: false, createdAt: ago(15) },
  { _id: 'n3', type: 'FOLLOW', sender: sender('u4', 'Phạm Thuỳ Dung', 'dungpham_food'), post: null, isRead: false, createdAt: ago(60) },
  { _id: 'n4', type: 'REPLY', sender: sender('u5', 'Đỗ Đức Huy', 'duchuy'), post: POST_3, isRead: true, createdAt: ago(180) },
  { _id: 'n5', type: 'YUMMY', sender: sender('u6', 'Vũ Ngọc Mai', 'ngocmai'), post: POST_2, isRead: true, createdAt: ago(60 * 26) },
  { _id: 'n6', type: 'FOLLOW', sender: sender('u7', 'Đỗ Quang Vinh', 'quangvinh'), post: null, isRead: true, createdAt: ago(60 * 30) },
  { _id: 'n7', type: 'COMMENT', sender: sender('u8', 'Lê Bảo Ngọc', 'baongoc'), post: POST_3, isRead: true, createdAt: ago(60 * 24 * 3) },
];

export const useNotificationStore = create<NotificationState>((set) => ({
  items: INITIAL,
  push: (n) => set((s) => ({ items: [n, ...s.items] })),
  markRead: (id) => set((s) => ({ items: s.items.map((n) => (n._id === id ? { ...n, isRead: true } : n)) })),
  markAllRead: () => set((s) => ({ items: s.items.map((n) => ({ ...n, isRead: true })) })),
}));

export const selectUnreadCount = (s: NotificationState) => s.items.filter((n) => !n.isRead).length;
