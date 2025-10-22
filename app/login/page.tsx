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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-white to-purple-500 p-4">
      <div className="w-full max-w-md">
        <div className="bg-black rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-800 mb-2">Welcome Back</h1>
            <p className="text-white">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
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
            
            {serverError && (
              <p className="mt-2 text-sm text-red-400">{serverError}</p>
            )}

            <div className="mb-6">
              <Button onClick={() => handleSubmit()} loading={loading} type="button">
                Login
              </Button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="text-purple-500 hover:text-purple-600 font-medium transition-colors duration-200"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
