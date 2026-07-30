"use client";

import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Phone, Globe, User, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const { student, signup } = useAcademyAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (student) {
      router.push("/academy/dashboard");
    }
  }, [student, router]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const countries = [
    "Nigeria", "United States", "United Kingdom", "Canada", 
    "South Africa", "Kenya", "Ghana", "Germany", "Australia", "Other"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation checks
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("Please enter your first and last name.");
      return;
    }
    if (!formData.email.trim() || !formData.phone.trim() || !formData.country) {
      setError("Please fill in email, phone number, and country.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!formData.agreeToTerms) {
      setError("You must agree to the Terms & Conditions.");
      return;
    }

    setLoading(true);
    try {
      await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        password: formData.password,
      });
      router.push("/academy/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0f0f11] flex items-center justify-center p-4 sm:p-6 lg:p-8 select-none transition-colors duration-300">
      
      {/* Container Box */}
      <div className="w-full max-w-5xl bg-white dark:bg-[#18181c] rounded-[32px] border border-card-border/60 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
        
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

          <div className="relative w-full aspect-square max-w-[240px] my-auto">
            <Image
              src="/academy-hero-v3.webp"
              alt="Mervox Academy Platform Illustration"
              fill
              sizes="240px"
              className="object-contain"
              priority
            />
          </div>

          <div className="relative z-10 text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-wider uppercase">
            © 2026 MERVOX DYNAMICS
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          
          {/* Header */}
          <div className="space-y-1.5 mb-8 text-left">
            <h1 className="text-2xl font-heading font-black text-slate-900 dark:text-white leading-tight">
              Create Your Mervox Academy Account
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Join thousands of learners building valuable digital skills.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            
            {/* Display Error Message */}
            {error && (
              <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl">
                {error}
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <User className="w-4 h-4 text-slate-400" />
                </span>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
                  required
                />
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <User className="w-4 h-4 text-slate-400" />
                </span>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
                  required
                />
              </div>
            </div>

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

            {/* Phone & Country Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Phone className="w-4 h-4 text-slate-400" />
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
                  required
                />
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Globe className="w-4 h-4 text-slate-400" />
                </span>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Select Country</option>
                  {countries.map((c) => (
                    <option key={c} value={c} className="text-slate-800 dark:text-slate-200">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400" />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="w-full pl-10 pr-10 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center gap-2 py-1 select-none">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#0055ff] border-card-border rounded-sm focus:ring-[#0055ff] cursor-pointer"
              />
              <label htmlFor="agreeToTerms" className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 cursor-pointer">
                I agree to the{" "}
                <span className="text-[#0055ff] hover:underline">Terms & Conditions</span>.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 font-bold text-white bg-[#0055ff] hover:bg-[#0044dd] disabled:bg-[#0055ff]/50 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/15 hover:-translate-y-[1px] transition-all cursor-pointer text-xs"
            >
              <span>{loading ? "Creating Account..." : "Create Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Bottom Link */}
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-6 text-center">
            Already have an account?{" "}
            <Link href="/academy/login" className="text-[#0055ff] hover:underline font-bold">
              Login
            </Link>
          </p>

        </div>

      </div>

    </main>
  );
}
