"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  UserCheck,
  Video,
  Megaphone,
  FileText,
  CheckSquare,
  Award,
  CreditCard,
  MessageCircle,
  BarChart3,
  Settings,
  LogOut,
  X,
  Globe
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAdminAuth();

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Students", href: "/admin/dashboard/students", icon: Users },
    { name: "Courses", href: "/admin/dashboard/courses", icon: BookOpen },
    { name: "Enrollments", href: "/admin/dashboard/enrollments", icon: UserCheck },
    { name: "Live Classes", href: "/admin/dashboard/live-classes", icon: Video },
    { name: "Announcements", href: "/admin/dashboard/announcements", icon: Megaphone },
    { name: "Assignments", href: "/admin/dashboard/assignments", icon: FileText },
    { name: "Quizzes", href: "/admin/dashboard/quizzes", icon: CheckSquare },
    { name: "Certificates", href: "/admin/dashboard/certificates", icon: Award },
    { name: "Payments", href: "/admin/dashboard/payments", icon: CreditCard },
    { name: "Messages", href: "/admin/dashboard/messages", icon: MessageCircle },
    { name: "Reports", href: "/admin/dashboard/reports", icon: BarChart3 },
    { name: "Settings", href: "/admin/dashboard/settings", icon: Settings },
    { name: "Main Website", href: "/", icon: Globe },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar aside */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col w-64 bg-white dark:bg-[#18181c] border-r border-card-border/60 transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen shrink-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header/Logo */}
        <div className="flex items-center justify-between p-6 border-b border-card-border/40 shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="relative w-8 h-8 shrink-0">
              <Image
                src="/logo.png"
                alt="Mervox Dynamic Logo"
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-heading font-black tracking-wider text-slate-900 dark:text-white uppercase leading-none">
                Mervox
              </span>
              <span className="text-[10px] font-bold text-[#0055ff] uppercase tracking-widest leading-none mt-0.5">
                Admin Area
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 lg:hidden cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin select-none">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#0055ff] text-white shadow-xs shadow-blue-500/10"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-450 dark:text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Footer */}
        <div className="p-4 border-t border-card-border/40 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-xs font-bold text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 cursor-pointer text-left border-none bg-transparent"
          >
            <LogOut className="w-4 h-4 text-red-550 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
