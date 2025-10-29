"use client";

import React, { useState } from "react";
import { Mail, Lock, User, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignupPage: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    category: "" as "citizen" | "worker" | "admin" | "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name) newErrors.name = "Username is required";
    else if (formData.name.length < 3) newErrors.name = "Username must be at least 3 characters";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email address";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 4) newErrors.password = "Password must be at least 4 characters";

    if (!formData.category) newErrors.category = "Please select a category";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data?.message || "Signup failed");
        return;
      }

      router.push("/login");
    } catch (err) {
      console.error(err);
      setServerError("Unexpected error during signup");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCategoryChange = (val: string) => {
    setFormData((prev) => ({ ...prev, category: val === 'UNSET' ? '' : (val as any) }));
    setErrors((prev) => ({ ...prev, category: "" }));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-rose-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-rose-400/25 blur-3xl animate-float-slow dark:bg-violet-500/25" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full bg-amber-300/25 blur-3xl animate-float dark:bg-blue-500/20" />

      <div className="relative container mx-auto max-w-lg px-4 py-16 grid place-items-center">
        <div className="w-full rounded-2xl p-[1px] bg-gradient-to-r from-rose-400/40 via-amber-400/40 to-rose-400/40 shadow-2xl">
          <div className="rounded-2xl border border-border/60 bg-card">
            <div className="p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent animate-pop">
                  <Users className="h-6 w-6" />
                </div>
                <h1 className="font-serif text-3xl font-bold text-foreground">Create your account</h1>
                <p className="mt-2 text-sm text-muted-foreground">Join the platform and start contributing</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  icon={User}
                  type="text"
                  name="name"
                  placeholder="Username"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                />

                <Input
                  icon={Mail}
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />

                <Input
                  icon={Lock}
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Category</label>
                  <Select
                    value={formData.category || 'UNSET'}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UNSET">Select category</SelectItem>
                      <SelectItem value="citizen">Citizen</SelectItem>
                      <SelectItem value="worker">Worker</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                </div>

                {serverError && <p className="text-sm text-red-500">{serverError}</p>}

                <Button onClick={handleSubmit} loading={loading} type="submit" className="w-full mt-2">
                  Sign Up
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/login" className="text-accent hover:underline font-medium">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes float-slow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes pop { 0%{transform:scale(.9);opacity:0} 100%{transform:scale(1);opacity:1} }
        .animate-float { animation: float 8s ease-in-out infinite }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite }
        .animate-pop { animation: pop .5s cubic-bezier(.16,1,.3,1) both }
      `}</style>
    </div>
  );
};

export default SignupPage;
