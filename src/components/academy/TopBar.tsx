"use client";

import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { AcademyDB } from "@/utils/academyDb";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Notification } from "@/types/academy";
import { Search, Bell, Menu, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { student, logout } = useAcademyAuth();
  const userId = student?.id || "";
  const router = useRouter();
  
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  // Load notifications from local storage database
  useEffect(() => {
    if (userId) {
      setNotifications(AcademyDB.getNotifications(userId));
    }
  }, [userId]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setShowNotificationDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/academy/login");
  };

  const handleMarkAllRead = () => {
    if (userId) {
      AcademyDB.markNotificationsRead(userId);
      setNotifications(AcademyDB.getNotifications(userId));
    }
  };

  const getInitials = (first = "", last = "") => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-6 bg-white dark:bg-[#18181c] border-b border-card-border/60 shrink-0">
      
      {/* Left side: Hamburger and Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search Bar UI */}
        <div className="relative w-full max-w-xs md:max-w-md hidden sm:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search courses, lessons, resources..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
            onKeyDown={(e) => {
              // Simulate quick action alert on search submit
              if (e.key === "Enter") {
                alert("Search is simulated in this MVP portal.");
              }
            }}
          />
        </div>
      </div>

      {/* Right side: Actions & User Profile */}
      <div className="flex items-center gap-4">
        
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notification Hub */}
        <div className="relative" ref={notificationDropdownRef}>
          <button
            onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
            className="p-2 rounded-xl border border-card-border/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer relative transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#0055ff] ring-2 ring-white dark:ring-[#18181c]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotificationDropdown && (
            <div className="absolute right-0 mt-2.5 w-80 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-2xl p-4 space-y-3 z-50 text-left">
              <div className="flex justify-between items-center pb-2 border-b border-card-border/40">
                <span className="text-xs font-bold text-slate-800 dark:text-white">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-bold text-[#0055ff] cursor-pointer hover:underline border-none bg-transparent"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
                {notifications.length === 0 ? (
                  <p className="text-[10px] text-slate-400 font-medium py-3 text-center">No new notifications.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl text-left border border-transparent transition-all ${
                        n.unread
                          ? "bg-blue-50/40 dark:bg-blue-950/10 border-blue-100/50 dark:border-blue-900/10"
                          : "hover:bg-slate-50 dark:hover:bg-slate-900"
                      }`}
                    >
                      <p className={`text-xs leading-normal ${n.unread ? "font-bold text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
                        {n.title}
                      </p>
                      <span className="text-[9px] text-slate-400 font-semibold mt-1 block">{n.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown Container */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 p-1.5 rounded-xl border border-card-border/60 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            {/* Avatar Frame - Base64 Image or Dynamic Initials */}
            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-blue-50/70 dark:bg-slate-800 flex items-center justify-center border border-card-border/60 font-heading font-black text-xs text-[#0055ff]">
              {student?.avatarUrl ? (
                <Image
                  src={student.avatarUrl}
                  alt="Student Avatar"
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              ) : (
                getInitials(student?.firstName, student?.lastName)
              )}
            </div>
            
            <div className="flex-col items-start hidden md:flex text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-white leading-none">
                {student ? `${student.firstName} ${student.lastName}` : "Guest Student"}
              </span>
              <span className="text-[9px] font-semibold text-slate-400 leading-none mt-1">
                Student Portal
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2.5 w-52 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-2xl py-2.5 z-50 text-left">
              <div className="px-4 py-2 border-b border-card-border/40 mb-1.5 md:hidden">
                <span className="text-xs font-bold text-slate-800 dark:text-white block truncate">
                  {student ? `${student.firstName} ${student.lastName}` : "Guest Student"}
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5 truncate">{student?.email}</span>
              </div>
              <button
                onClick={() => {
                  setShowProfileDropdown(false);
                  router.push("/academy/dashboard/profile");
                }}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer text-left font-semibold"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => {
                  setShowProfileDropdown(false);
                  router.push("/academy/dashboard/profile");
                }}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer text-left font-semibold"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Settings</span>
              </button>
              <div className="border-t border-card-border/40 my-1.5" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer text-left font-semibold"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
