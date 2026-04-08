import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthProps {
  onSuccess: (mockUser?: any) => void;
  onBack: () => void;
}

const translateError = (error: string) => {
  if (error.includes('Invalid login credentials')) return 'Email hoặc mật khẩu không chính xác.';
  if (error.includes('User already registered')) return 'Email này đã được đăng ký.';
  if (error.includes('Password should be at least 6 characters')) return 'Mật khẩu phải có ít nhất 6 ký tự.';
  if (error.includes('Email not confirmed')) return 'Vui lòng xác nhận email trước khi đăng nhập.';
  return error;
};

export const Auth: React.FC<AuthProps> = ({ onSuccess, onBack }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setError('Supabase chưa được cấu hình. Vui lòng kiểm tra Settings.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        // Demo Admin Bypass
        if (email === 'admin@gmail.com' && password === 'Admin@123456') {
          onSuccess({ id: 'demo-admin-id', email: 'admin@gmail.com', full_name: 'Admin Demo' });
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) throw error;
      }
      onSuccess();
    } catch (err: any) {
      setError(translateError(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl shadow-emerald-900/10 border border-emerald-100 overflow-hidden"
      >
        <div className="bg-primary-900 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-white rounded-full blur-3xl"></div>
          </div>
          <button 
            onClick={onBack}
            className="absolute top-4 left-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowRight className="rotate-180" size={20} />
          </button>
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-primary-900 font-black text-2xl">C</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
          </h2>
          <p className="text-primary-200 text-sm mt-2">
            {mode === 'login' ? 'Đăng nhập để tiếp tục tạo CV chuyên nghiệp' : 'Bắt đầu hành trình sự nghiệp của bạn ngay hôm nay'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 italic">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Họ và tên</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 ring-primary-500 outline-none transition-all"
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 ring-primary-500 outline-none transition-all"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 ring-primary-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-800 transition-all shadow-lg shadow-primary-900/20 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (mode === 'login' ? 'Đăng nhập' : 'Đăng ký')}
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
            <button 
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="ml-1 text-primary-700 font-bold hover:underline"
            >
              {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
};
