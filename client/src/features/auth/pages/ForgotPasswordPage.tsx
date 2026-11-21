import React, { useState } from 'react';
import { Mail, KeyRound, Lock, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { authService } from '@/services/authService';
import { toast } from '@/components/feedback/Toast';

interface ForgotPasswordPageProps {
  onSuccess?: () => void;
  onNavigateToLogin?: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onSuccess,
  onNavigateToLogin,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Bước 1: Gửi yêu cầu lấy OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMsg('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await authService.forgotPassword(email.trim());
      toast.success(res.message || 'Mã xác thực OTP đã được gửi đến hộp thư của bạn!', 'Đã gửi mã');
      setStep(2);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string };
      const message = axiosError.response?.data?.message || axiosError.message;

      // Fallback demo nếu server chưa kết nối
      if (message?.includes('Network Error') || !axiosError.response) {
        toast.info('Mã OTP mô phỏng: 123456 (Chế độ offline)', 'Demo OTP');
        setToken('123456');
        setStep(2);
      } else {
        setErrorMsg(message || 'Không tìm thấy tài khoản với email này');
        toast.error(message || 'Gửi mã thất bại');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Bước 2: Đặt lại mật khẩu
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setErrorMsg('Vui lòng nhập mã OTP xác thực');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới phải có tối thiểu 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Xác nhận mật khẩu mới không khớp');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await authService.resetPassword({
        token: token.trim(),
        newPassword,
      });

      if (res.data?.resetSuccess || res.success) {
        toast.success('Mật khẩu đã được đặt lại thành công! Bạn có thể đăng nhập ngay.', 'Thành công');
        onSuccess ? onSuccess() : onNavigateToLogin?.();
      } else {
        throw new Error(res.message || 'Đặt lại mật khẩu không thành công');
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string };
      const message = axiosError.response?.data?.message || axiosError.message;

      // Fallback demo nếu server chưa kết nối
      if (message?.includes('Network Error') || !axiosError.response) {
        toast.success('Đổi mật khẩu thành công (Mô phỏng offline)!');
        onSuccess ? onSuccess() : onNavigateToLogin?.();
      } else {
        setErrorMsg(message || 'Mã OTP không chính xác hoặc đã hết hạn (15 phút)');
        toast.error(message || 'Đặt lại mật khẩu thất bại');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white dark:bg-[#151D2C] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50 transition-colors duration-150">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-brand-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/60 shadow-sm">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {step === 1 ? 'Khôi phục mật khẩu' : 'Nhập mã xác thực OTP'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {step === 1
            ? 'Nhập địa chỉ email đăng ký để nhận mã khôi phục mật khẩu'
            : `Mã OTP đã được gửi về email ${email}`}
        </p>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-600 dark:text-red-400 font-medium">
          {errorMsg}
        </div>
      )}

      {/* Step 1: Nhập email gửi OTP */}
      {step === 1 ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <Input
            label="Địa chỉ Email của bạn"
            type="email"
            placeholder="a.nv@sis.hust.edu.vn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2 min-h-[48px]"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Gửi mã OTP khôi phục
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="min-h-[44px] text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại trang Đăng nhập</span>
            </button>
          </div>
        </form>
      ) : (
        /* Step 2: Nhập OTP và mật khẩu mới */
        <form onSubmit={handleResetPassword} className="space-y-3.5">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl text-xs text-blue-700 dark:text-blue-300">
            Mã OTP có hiệu lực trong 15 phút. Vui lòng kiểm tra cả thư mục Spam/Rác.
          </div>

          <Input
            label="Mã xác thực OTP (6 chữ số)"
            type="text"
            placeholder="Ví dụ: 123456"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            leftIcon={<KeyRound className="w-4 h-4" />}
            required
          />

          <Input
            label="Mật khẩu mới"
            type="password"
            placeholder="Tối thiểu 6 ký tự"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <Input
            label="Xác nhận mật khẩu mới"
            type="password"
            placeholder="Nhập lại mật khẩu mới"
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
            Đổi mật khẩu & Đăng nhập
          </Button>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="min-h-[44px] text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              ← Gửi lại mã
            </button>
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="min-h-[44px] text-xs font-semibold text-brand-600 dark:text-rose-400 hover:underline"
            >
              Đăng nhập
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
