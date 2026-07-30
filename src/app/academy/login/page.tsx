"use client";

import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const { student, login } = useAcademyAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (student) {
      router.push("/academy/dashboard");
    }
  }, [student, router]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        router.push("/academy/dashboard");
      } else {
        setError("Invalid email address or password.");
      }
    } catch (err: any) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0f0f11] flex items-center justify-center p-4 sm:p-6 lg:p-8 select-none transition-colors duration-300">
      
      {/* Container Box */}
      <div className="w-full max-w-4xl bg-white dark:bg-[#18181c] rounded-[32px] border border-card-border/60 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* Left Side: Illustration Panel (Desktop only) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent relative p-12 flex-col justify-between items-center text-center overflow-hidden border-r border-card-border/40">
          <div className="absolute inset-0 bg-[radial-gradient(var(--accent)_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
          <div className="absolute top-[20%] right-[-10%] w-44 h-44 rounded-full bg-[#0055ff]/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-2 mt-4">
            <div className="relative w-8 h-8 mx-auto mb-3">
              <Image
                src="/logo.png"
                alt="Mervox Dynamic Logo"
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
            <h3 className="text-xl font-heading font-black tracking-wider text-slate-800 dark:text-white uppercase">
              Mervox Academy
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-[200px] mx-auto">
              Empower your future with high-yield digital craftsmanship.
            </p>
          </div>

          <div className="relative w-full aspect-square max-w-[220px] my-auto">
            <Image
              src="/academy-hero-v3.webp"
              alt="Mervox Academy Platform Illustration"
              fill
              sizes="220px"
              className="object-contain"
              priority
            />
          </div>

          <div className="relative z-10 text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-wider uppercase">
            © 2026 MERVOX DYNAMICS
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-12 flex flex-col justify-center">
          
          {/* Header */}
          <div className="space-y-1.5 mb-8 text-left">
            <h1 className="text-2xl font-heading font-black text-slate-900 dark:text-white leading-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Continue your learning journey.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            
            {/* Display Error Message */}
            {error && (
              <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Mail className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Lock className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between py-1 select-none">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#0055ff] border-card-border rounded-sm focus:ring-[#0055ff] cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 cursor-pointer">
                  Remember Me
                </label>
              </div>
              <button
                type="button"
                onClick={() => alert("Simulated Forgot Password workflow. Please register a new account if you forgot your credentials.")}
                className="text-[11px] font-bold text-[#0055ff] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 font-bold text-white bg-[#0055ff] hover:bg-[#0044dd] disabled:bg-[#0055ff]/50 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/15 hover:-translate-y-[1px] transition-all cursor-pointer text-xs"
            >
              <span>{loading ? "Logging in..." : "Login"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Bottom Link */}
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-8 text-center">
            Don't have an account?{" "}
            <Link href="/academy/signup" className="text-[#0055ff] hover:underline font-bold">
              Create Account
            </Link>
          </p>

        </div>

      </div>

    </main>
  );
}
