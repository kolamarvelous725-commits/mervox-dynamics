"use client";

import { useAdminAuth } from "@/context/AdminAuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const { isAdminAuthenticated, login } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAdminAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAdminAuthenticated, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/admin/dashboard");
      } else {
        setError("Invalid administrator email or password.");
      }
    } catch (err) {
      setError("An unexpected authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0f0f11] p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#18181c] rounded-[32px] border border-card-border/60 shadow-2xl overflow-hidden p-8 space-y-6 text-left">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="relative w-12 h-12 mx-auto">
            <Image
              src="/logo.png"
              alt="Mervox Dynamic Logo"
              fill
              sizes="48px"
              className="object-contain"
              priority
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-heading font-black tracking-wider text-slate-800 dark:text-white uppercase leading-none">
              Mervox Academy
            </h3>
            <span className="text-[10px] font-bold text-[#0055ff] uppercase tracking-widest block mt-1.5">
              Administrator Access Only
            </span>
          </div>
        </div>

        {/* Error panel */}
        {error && (
          <div className="p-3.5 text-xs font-semibold text-red-650 bg-red-50 dark:bg-red-955/20 border border-red-100 dark:border-red-900/30 rounded-xl leading-normal">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Admin Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Mail className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="email"
                placeholder="admin@mervoxdynamic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Admin Password</label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Lock className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-slate-400 hover:text-slate-655 bg-transparent border-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 flex items-center justify-center gap-2 font-bold text-white bg-[#0055ff] hover:bg-[#0044dd] disabled:bg-[#0055ff]/50 rounded-xl shadow-md transition-all cursor-pointer text-xs"
          >
            <span>{loading ? "Authenticating..." : "Login to Control Panel"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Back Link */}
        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-6 text-center">
          Looking for student login?{" "}
          <Link href="/academy/login" className="text-[#0055ff] hover:underline font-bold">
            Portal Login
          </Link>
        </p>

      </div>
    </main>
  );
}
