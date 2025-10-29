"use client"
import React, { useState } from 'react';
import { Mail, Lock, Users } from 'lucide-react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<{ email: string; password: string }>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<'email' | 'password', string>>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Partial<Record<'email' | 'password', string>> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setServerError(null);
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setServerError(data?.message || 'Login failed');
        setLoading(false);
        return;
      }
      
      // Store token in cookie
      document.cookie = `token=${data.jwtToken}; path=/; max-age=${24 * 60 * 60}`;
      
      const next = searchParams?.get('next');
      if (next) {
        router.push(next);
      } else {
        // Redirect based on user category from response
       const category = data?.user?.category?.toString().toLowerCase().trim();
       console.log("User category:", category);
        if (category === 'admin') router.push('/admin');
        else if (category === 'worker') router.push('/worker');
        else if (category === 'citizen')
        router.push('/citizen');
      else router.push('/');
      }
    } catch (err) {
      setServerError('Unexpected error during login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as 'email' | 'password']) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-indigo-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.12),_transparent_50%),radial-gradient(ellipse_at_bottom,_rgba(16,185,129,0.10),_transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.10),_transparent_50%),radial-gradient(ellipse_at_bottom,_rgba(168,85,247,0.10),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-pan" />
      <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-indigo-400/25 blur-3xl animate-float-slow dark:bg-cyan-400/20" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full bg-emerald-400/20 blur-3xl animate-float dark:bg-violet-500/20" />

      <div className="relative container mx-auto max-w-lg px-4 py-16 grid place-items-center">
        {/* Gradient border wrapper */}
        <div className="w-full rounded-2xl p-[1px] bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 shadow-2xl animate-in slide-in-from-top-10 duration-700 ease-out">
          <div className="rounded-2xl border border-border/60 bg-card will-change-transform">
            <div className="p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent shadow-sm animate-pop">
                  <Users className="h-6 w-6" />
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Welcome back</h1>
                <p className="mt-2 text-sm text-muted-foreground">Sign in to your account to continue</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    icon={Mail}
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    error={errors.email}
                  />
                </div>

                <div className="space-y-2">
                  <Input
                    icon={Lock}
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    error={errors.password}
                  />
                </div>

                {serverError && (
                  <p className="text-sm text-red-500">{serverError}</p>
                )}

                <div className="pt-2">
                  <Button onClick={() => handleSubmit()} loading={loading} type="button" className="w-full">
                    Login
                  </Button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link
                    href="/signup"
                    className="text-accent hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) }
          50% { transform: translateY(-12px) }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) }
          50% { transform: translateY(-18px) }
        }
        @keyframes pop {
          0% { transform: scale(.9); opacity:.0 }
          100% { transform: scale(1); opacity:1 }
        }
        .animate-float { animation: float 8s ease-in-out infinite }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite }
        .animate-pop { animation: pop .5s cubic-bezier(.16,1,.3,1) both }
        @keyframes pan-bg {
          0% { background-position: 0% 0% }
          100% { background-position: 200% 200% }
        }
        .bg-pan {
          background: linear-gradient(120deg, transparent 0%, rgba(99,102,241,.06) 25%, transparent 50%, rgba(16,185,129,.06) 75%, transparent 100%);
          background-size: 200% 200%;
          animation: pan-bg 20s linear infinite;
          mix-blend-mode: overlay;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
