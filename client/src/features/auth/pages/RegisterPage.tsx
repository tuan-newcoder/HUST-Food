import React, { useState } from 'react';
import { User, Mail, Lock, Check, ArrowRight } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from '@/components/feedback/Toast';

interface RegisterPageProps {
  onSuccess?: () => void;
  onNavigateToLogin?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onSuccess,
  onNavigateToLogin,
}) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { setAuth } = useAuthStore();

  const validate = (): string | null => {
    if (!fullName.trim()) return 'Vui lòng nhập họ và tên của bạn';
    if (!username.trim() || username.length < 3 || username.length > 30) {
      return 'Tên tài khoản phải từ 3 đến 30 ký tự';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      return 'Tên tài khoản chỉ được chứa chữ cái, số và dấu gạch dưới (_)';
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      return 'Địa chỉ email không hợp lệ';
    }
    if (password.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (password !== confirmPassword) {
      return 'Mật khẩu xác nhận không khớp';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await authService.register({
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.success && response.data) {
        setAuth(response.data.user, response.data.accessToken, response.data.refreshToken);
        toast.success(`Tài khoản ${response.data.user.username} đã được tạo thành công!`, 'Đăng ký hoàn tất');
        onSuccess?.();
      } else {
        throw new Error(response.message || 'Đăng ký thất bại');
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string };
      const message = axiosError.response?.data?.message || axiosError.message;

      // Fallback demo nếu server chưa bật
      if (message?.includes('Network Error') || message?.includes('ERR_CONNECTION_REFUSED') || !axiosError.response) {
        const mockNewUser = {
          _id: 'usr_' + Date.now(),
          username: username.trim().toLowerCase(),
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=faces',
          bio: 'Thành viên mới gia nhập HUST-Food 🎉',
          role: 'USER' as const,
          status: 'ACTIVE' as const,
          followersCount: 0,
          followingCount: 0,
          postsCount: 0,
          createdAt: new Date().toISOString(),
        };
        setAuth(mockNewUser, 'demo_access_token', 'demo_refresh_token');
        toast.success('Đăng ký tài khoản thành công (Chế độ mô phỏng offline)');
        onSuccess?.();
      } else {
        setErrorMsg(message || 'Đã có lỗi xảy ra trong quá trình đăng ký');
        toast.error(message || 'Đăng ký không thành công', 'Lỗi');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white dark:bg-[#151D2C] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50 transition-colors duration-150">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Tạo tài khoản HUST-Food
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Gia nhập cộng đồng review & chia sẻ ẩm thực Bách Khoa
        </p>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-600 dark:text-red-400 font-medium">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Họ và tên"
          type="text"
          placeholder="Nguyễn Văn A"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          leftIcon={<User className="w-4 h-4" />}
          required
        />

        <Input
          label="Tên tài khoản (Username)"
          type="text"
          placeholder="nguyenvana (3-30 ký tự, không dấu)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          leftIcon={<span className="text-xs font-bold text-slate-400 dark:text-slate-500">@</span>}
          required
        />

        <Input
          label="Địa chỉ Email"
          type="email"
          placeholder="a.nv@sis.hust.edu.vn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Mật khẩu"
          type="password"
          placeholder="Tối thiểu 6 ký tự"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          required
        />

        <Input
          label="Xác nhận mật khẩu"
          type="password"
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          leftIcon={<Check className="w-4 h-4" />}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-3 min-h-[48px]"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Đăng ký tài khoản
        </Button>
      </form>

      {/* Bottom Switch to Login */}
      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Đã có tài khoản HUST-Food?{' '}
        <button
          type="button"
          onClick={onNavigateToLogin}
          className="min-h-[44px] font-bold text-brand-600 dark:text-rose-400 hover:text-brand-700 dark:hover:text-rose-300 underline underline-offset-2 ml-1"
        >
          Đăng nhập ngay
        </button>
      </div>
    </div>
  );
};
