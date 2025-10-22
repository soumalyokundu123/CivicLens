"use client"
import React, { useState } from 'react';
import { Mail, Lock, User, Users } from 'lucide-react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<{ 
    name: string; 
    email: string; 
    password: string; 
    category: 'citizen' | 'worker' | 'admin' | '' 
  }>({
    name: '',
    email: '',
    password: '',
    category: '',
  });
  const [errors, setErrors] = useState<Partial<Record<'name' | 'email' | 'password' | 'category', string>>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Partial<Record<'name' | 'email' | 'password' | 'category', string>> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name) {
      newErrors.name = 'Username is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Username must be at least 3 characters';
    }

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

    if (!formData.category) {
      newErrors.category = 'Please select a category';
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
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setServerError(data?.message || 'Signup failed');
        setLoading(false);
        return;
      }
      
      // Redirect to login page after successful signup
      router.push('/login');
    } catch (err) {
      setServerError('Unexpected error during signup');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as 'name' | 'email' | 'password' | 'category']) {
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
            <h1 className="text-3xl font-bold text-purple-800 mb-2">Create Account</h1>
            <p className="text-white">Sign up for a new account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              icon={User}
              type="text"
              name="name"
              placeholder="Username"
              value={formData.name}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              error={errors.name}
            />

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

            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-purple-500" />
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.category ? 'border-red-400' : 'border-gray-200'
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black outline-none transition-all duration-200 bg-white`}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="citizen">Citizen</option>
                  <option value="worker">Worker</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
            </div>
            
            {serverError && (
              <p className="mt-2 text-sm text-red-400">{serverError}</p>
            )}

            <div className="mb-6">
              <Button onClick={() => handleSubmit()} loading={loading} type="button">
                Sign Up
              </Button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-purple-500 hover:text-purple-600 font-medium transition-colors duration-200"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
