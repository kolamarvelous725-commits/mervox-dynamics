"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useState, useEffect } from "react";
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

  const [unreadMsgCount, setUnreadMsgCount] = useState(0);
  const [unreadEnrollCount, setUnreadEnrollCount] = useState(0);
  const [openTicketCount, setOpenTicketCount] = useState(0);

  const calculateAdminBadges = async () => {
    try {
      const { adminSupabase, isSupabaseConfigured } = await import("@/utils/supabaseClient");
      if (!isSupabaseConfigured) return;

      // 1. Unread student messages count
      if (pathname === "/admin/dashboard/messages") {
        setUnreadMsgCount(0);
      } else {
        let viewedMsgIds: string[] = [];
        try {
          const stored = localStorage.getItem("mervox_admin_viewed_msgs");
          viewedMsgIds = stored ? JSON.parse(stored) : [];
        } catch {}

        const { data: studentMsgs } = await adminSupabase
          .from("messages")
          .select("id")
          .eq("sender", "student");

        if (studentMsgs) {
          const unread = studentMsgs.filter((m: any) => !viewedMsgIds.includes(m.id)).length;
          setUnreadMsgCount(unread);
        }
      }

      // 2. Unread enrollments count
      if (pathname === "/admin/dashboard/enrollments") {
        setUnreadEnrollCount(0);
      } else {
        let viewedEnrollIds: string[] = [];
        try {
          const stored = localStorage.getItem("mervox_admin_viewed_enrollments");
          viewedEnrollIds = stored ? JSON.parse(stored) : [];
        } catch {}

        const { data: enrollData } = await adminSupabase
          .from("enrollments")
          .select("id");

        if (enrollData) {
          const unread = enrollData.filter((e: any) => !viewedEnrollIds.includes(e.id)).length;
          setUnreadEnrollCount(unread);
        }
      }

      // 3. Open Support Tickets count
      const { data: ticketsData } = await adminSupabase
        .from("support_tickets")
        .select("id")
        .eq("status", "active");

      if (ticketsData) {
        setOpenTicketCount(ticketsData.length);
      }
    } catch (err) {
      console.error("Error calculating admin badges:", err);
    }
  };

  useEffect(() => {
    calculateAdminBadges();

    // Mark current viewed pages in admin localStorage
    if (pathname === "/admin/dashboard/messages") {
      import("@/utils/supabaseClient").then(async ({ adminSupabase, isSupabaseConfigured }) => {
        if (isSupabaseConfigured) {
          const { data } = await adminSupabase.from("messages").select("id").eq("sender", "student");
          if (data) {
            const allIds = data.map((m: any) => m.id);
            localStorage.setItem("mervox_admin_viewed_msgs", JSON.stringify(allIds));
            setUnreadMsgCount(0);
          }
        }
      });
    }

    if (pathname === "/admin/dashboard/enrollments") {
      import("@/utils/supabaseClient").then(async ({ adminSupabase, isSupabaseConfigured }) => {
        if (isSupabaseConfigured) {
          const { data } = await adminSupabase.from("enrollments").select("id");
          if (data) {
            const allIds = data.map((e: any) => e.id);
            localStorage.setItem("mervox_admin_viewed_enrollments", JSON.stringify(allIds));
            setUnreadEnrollCount(0);
          }
        }
      });
    }
  }, [pathname]);

  // Mount-only Realtime listener for incoming messages, enrollments, and tickets
  useEffect(() => {
    let channel: any;
    import("@/utils/supabaseClient").then(({ adminSupabase, isSupabaseConfigured }) => {
      if (isSupabaseConfigured) {
        channel = adminSupabase
          .channel("admin_sidebar_badges_sync")
          .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => calculateAdminBadges())
          .on("postgres_changes", { event: "*", schema: "public", table: "enrollments" }, () => calculateAdminBadges())
          .on("postgres_changes", { event: "*", schema: "public", table: "support_tickets" }, () => calculateAdminBadges())
          .subscribe();
      }
    });

    return () => {
      if (channel) {
        import("@/utils/supabaseClient").then(({ adminSupabase }) => {
          adminSupabase.removeChannel(channel);
        });
      }
    };
  }, []);

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
    { name: "Community Forum", href: "/admin/dashboard/community", icon: Users },
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

            let badgeCount = 0;
            if (item.name === "Messages") badgeCount = unreadMsgCount + openTicketCount;
            if (item.name === "Enrollments") badgeCount = unreadEnrollCount;

            const displayBadge = badgeCount > 99 ? "99+" : badgeCount;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#0055ff] text-white shadow-xs shadow-blue-500/10"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-450 dark:text-slate-400"}`} />
                  <span>{item.name}</span>
                </div>
                {badgeCount > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none shrink-0 min-w-[16px] text-center shadow-xs">
                    {displayBadge}
                  </span>
                )}
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
