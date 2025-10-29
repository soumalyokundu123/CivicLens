"use client";
import React, { useEffect, useState } from "react";
import { User, Mail, Shield, Calendar, LogOut } from "lucide-react";
import Link from "next/link";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split(";").map(c => c.trim()).find(c => c.startsWith(name + "="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function decodeJwt<T = any>(token: string): T | null {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return json as T;
  } catch {
    return null;
  }
}

export default function ProfilePage() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const token = readCookie("token");
    if (!token) return;
    const payload = decodeJwt<any>(token);
    setUser(payload || null);
  }, []);

  const signOut = () => {
    document.cookie = "token=; path=/; max-age=0";
    window.location.href = "/login";
  };

  const name = user?.name || user?.username || user?.user?.name || "User";
  const email = user?.email || user?.user?.email || "";
  const category = (user?.category || user?.role || user?.user?.category || "").toString();
  const iat = user?.iat ? new Date(user.iat * 1000) : undefined;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="relative container mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-border bg-card shadow-xl">
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-accent/15 text-accent flex items-center justify-center">
                <User className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Profile</h1>
                <p className="text-sm text-muted-foreground">Your account details</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div className="text-base font-medium">{name}</div>
                </div>
              </div>

              {email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="text-base font-medium">{email}</div>
                  </div>
                </div>
              )}

              {category && (
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Role</div>
                    <div className="text-base font-medium capitalize">{category}</div>
                  </div>
                </div>
              )}

              {iat && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Signed in</div>
                    <div className="text-base font-medium">{iat.toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Go to your dashboard
              </div>
              <div className="flex gap-3">
                <Link href="/" className="text-sm underline text-accent">Home</Link>
                {category && (
                  <Link href={`/${category}`} className="text-sm underline text-accent">Dashboard</Link>
                )}
                <button onClick={signOut} className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
