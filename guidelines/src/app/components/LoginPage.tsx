import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface LoginPageProps {
  onLogin: (userId?: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 检查 Supabase 是否已配置
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        // 模拟登录（未配置 Supabase）
        if (email && password) {
          console.log('使用模拟登录（未配置 Supabase）');
          await new Promise(resolve => setTimeout(resolve, 500));
          onLogin('mock-user-id');
        } else {
          setError('请输入邮箱和密码');
        }
        setIsLoading(false);
        return;
      }

      // 使用 Supabase 认证
      if (isRegisterMode) {
        // 注册
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          // 如果用户已存在，尝试登录
          if (signUpError.message.includes('already registered')) {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (signInError) throw signInError;
            onLogin(signInData.user?.id);
          } else {
            throw signUpError;
          }
        } else {
          // 注册成功，自动登录
          if (data.user) {
            onLogin(data.user.id);
          }
        }
      } else {
        // 登录
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          // 如果用户不存在，尝试自动注册
          if (signInError.message.includes('Invalid login credentials')) {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email,
              password,
            });

            if (signUpError) throw signUpError;
            if (signUpData.user) {
              onLogin(signUpData.user.id);
            }
          } else {
            throw signInError;
          }
        } else {
          onLogin(data.user?.id);
        }
      }
    } catch (err) {
      console.error('登录错误:', err);
      setError(err instanceof Error ? err.message : '登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-slate-900 mb-2">
              心理咨询师培训系统
            </h1>
            <p className="text-slate-500">
              {isRegisterMode ? '注册账号' : '登录以开始您的培训评测'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 text-white hover:opacity-90"
              style={{ backgroundColor: '#7BC0CD' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isRegisterMode ? '注册中...' : '登录中...'}
                </>
              ) : (
                isRegisterMode ? '注册' : '登录'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError('');
              }}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              {isRegisterMode ? '已有账号？去登录' : '没有账号？自动注册'}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-slate-400 mt-8">
          © 2026 心理咨询师培训评测系统
        </p>
      </div>
    </div>
  );
}
