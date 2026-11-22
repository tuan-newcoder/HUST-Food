import React, { useState } from 'react';
import { Mail, Lock, Sparkles, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { authService } from '@/services/authService';
import { useAuthStore, DEMO_USER } from '@/stores/useAuthStore';
import { toast } from '@/components/feedback/Toast';

interface LoginPageProps {
  onSuccess?: () => void;
  onNavigateToRegister?: () => void;
  onNavigateToForgotPassword?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateToRegister,
  onNavigateToForgotPassword,
}) => {
  const [emailOrUsername, setEmailOrUsername] = useState('tuan_le');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { setAuth, loginDemoUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername.trim() || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ tên đăng nhập/email và mật khẩu');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await authService.login({
        emailOrUsername: emailOrUsername.trim(),
        password,
      });

      if (response.success && response.data) {
        setAuth(response.data.user, response.data.accessToken, response.data.refreshToken);
        toast.success(`Chào mừng ${response.data.user.fullName} quay trở lại!`, 'Đăng nhập thành công');
        onSuccess?.();
      } else {
        throw new Error(response.message || 'Đăng nhập thất bại');
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string };
      const message = axiosError.response?.data?.message || axiosError.message;

      // Nếu lỗi kết nối server (chưa chạy backend), cho phép dùng tài khoản demo
      if (message?.includes('Network Error') || message?.includes('ERR_CONNECTION_REFUSED') || !axiosError.response) {
        toast.info('Đang chạy chế độ mô phỏng (Server local chưa kết nối)', 'Chế độ Demo');
        loginDemoUser();
        toast.success(`Đã đăng nhập với tài khoản ${DEMO_USER.fullName}`);
        onSuccess?.();
      } else {
        setErrorMsg(message || 'Tài khoản hoặc mật khẩu không chính xác');
        toast.error(message || 'Đăng nhập thất bại', 'Lỗi xác thực');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginDemoUser();
    toast.success(`Đăng nhập thành công với tài khoản ${DEMO_USER.fullName}!`, 'Demo Mode');
    onSuccess?.();
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white dark:bg-[#151D2C] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50 transition-colors duration-150">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
          <UtensilsCrossed className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Chào mừng trở lại!
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Cộng đồng ẩm thực sinh viên Đại học Bách Khoa Hà Nội
        </p>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-600 dark:text-red-400 font-medium">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tài khoản hoặc Email"
          type="text"
          placeholder="tuan_le hoặc email@sis.hust.edu.vn"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          autoComplete="username"
          required
        />

        <div>
          <Input
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            autoComplete="current-password"
            required
          />
          <div className="flex justify-end mt-1.5">
            <button
              type="button"
              onClick={onNavigateToForgotPassword}
              className="min-h-[32px] text-xs font-semibold text-brand-600 dark:text-rose-400 hover:text-brand-700 dark:hover:text-rose-300 transition"
            >
              Quên mật khẩu?
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2 min-h-[48px]"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Đăng nhập
        </Button>
      </form>

      {/* Quick Demo Button for effortless testing */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full min-h-[44px] py-2.5 px-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/40 hover:bg-amber-100/70 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Đăng nhập nhanh với tài khoản Demo K66</span>
        </button>
      </div>

      {/* Bottom Switch to Register */}
      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Chưa có tài khoản HUST-Food?{' '}
        <button
          type="button"
          onClick={onNavigateToRegister}
          className="min-h-[44px] font-bold text-brand-600 dark:text-rose-400 hover:text-brand-700 dark:hover:text-rose-300 underline underline-offset-2 ml-1"
        >
          Đăng ký ngay
        </button>
      </div>
    </div>
  );
};
