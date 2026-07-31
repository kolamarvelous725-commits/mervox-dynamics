"use client";

import { useAdminAuth } from "@/context/AdminAuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, User, LogOut, ShieldCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AdminTopBarProps {
  onMenuClick: () => void;
}

export function AdminTopBar({ onMenuClick }: AdminTopBarProps) {
  const { logout } = useAdminAuth();
  const router = useRouter();
  
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-6 bg-white dark:bg-[#18181c] border-b border-card-border/60 shrink-0">
      
      {/* Left side: Hamburger */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="p-1 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:inline-block">
          Mervox Control Desk
        </span>
      </div>

      {/* Right side: Actions & Admin Profile */}
      <div className="flex items-center gap-4">
        
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Profile Dropdown Container */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl border border-card-border/60 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer bg-transparent"
          >
            {/* Avatar Frame - Shield icon fallback */}
            <div className="relative w-8 h-8 rounded-lg bg-blue-50/70 dark:bg-slate-800 flex items-center justify-center border border-card-border/60 text-[#0055ff]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            
            <div className="flex-col items-start hidden md:flex text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-white leading-none">
                Academy Admin
              </span>
              <span className="text-[9px] font-semibold text-slate-400 leading-none mt-1">
                System Administrator
              </span>
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2.5 w-56 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-2xl py-2.5 z-50 text-left">
              <div className="px-4 py-2 border-b border-card-border/40 mb-1.5">
                <span className="text-xs font-bold text-slate-850 dark:text-white block truncate">
                  Admin Account
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5 truncate">
                  marvelousotugalu012@gmail.com
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-xs text-red-655 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer text-left font-semibold border-none bg-transparent"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Logout Session</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
