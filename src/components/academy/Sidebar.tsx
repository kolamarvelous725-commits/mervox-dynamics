"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { useState, useEffect } from "react";
import { AcademyDB } from "@/utils/academyDb";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  FileText,
  CheckSquare,
  Award,
  Download,
  Users,
  MessageCircle,
  CreditCard,
  User,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Globe
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { student } = useAcademyAuth();
  const userId = student?.id || "";
  const { logout } = useAcademyAuth();

  const [unreadLiveCount, setUnreadLiveCount] = useState(0);
  const [unreadAsgCount, setUnreadAsgCount] = useState(0);
  const [unreadCommCount, setUnreadCommCount] = useState(0);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);
  const [unreadTicketCount, setUnreadTicketCount] = useState(0);

  const calculateBadges = async () => {
    if (!userId) return;

    try {
      // 1. Unread Messages from Mentor
      if (pathname === "/academy/dashboard/messages") {
        setUnreadMsgCount(0);
      } else {
        let viewedMsgIds: string[] = [];
        try {
          const stored = localStorage.getItem(`mervox_academy_viewed_msg_${userId}`);
          viewedMsgIds = stored ? JSON.parse(stored) : [];
        } catch {}

        if (AcademyDB && typeof window !== "undefined") {
          // If supabase configured, check unread mentor messages
          import("@/utils/supabaseClient").then(async ({ supabase, isSupabaseConfigured }) => {
            if (isSupabaseConfigured) {
              const { data: mentorMsgs } = await supabase
                .from("messages")
                .select("id")
                .eq("user_id", userId)
                .eq("sender", "mentor");

              if (mentorMsgs) {
                const unread = mentorMsgs.filter((m: any) => !viewedMsgIds.includes(m.id)).length;
                setUnreadMsgCount(unread);
              }
            }
          });
        }
      }

      // 2. Live Classes unread count
      if (pathname === "/academy/dashboard/live") {
        setUnreadLiveCount(0);
      } else {
        const progress = AcademyDB.getProgress(userId);
        const enrolledCourseIds = progress.map((p) => p.courseId);
        const liveClasses = AcademyDB.getLiveClasses().filter((s: any) => {
          const cId = s.course_id || s.courseId;
          return enrolledCourseIds.includes(cId);
        });
        
        let viewedLiveIds: string[] = [];
        try {
          const stored = localStorage.getItem(`mervox_academy_viewed_live_${userId}`);
          viewedLiveIds = stored ? JSON.parse(stored) : [];
        } catch {}
        const unreadLive = liveClasses.filter((lc: any) => !viewedLiveIds.includes(lc.id)).length;
        setUnreadLiveCount(unreadLive);
      }

      // 3. Assignments unread count
      if (pathname === "/academy/dashboard/assignments") {
        setUnreadAsgCount(0);
      } else {
        const progress = AcademyDB.getProgress(userId);
        const enrolledCourseIds = progress.map((p) => p.courseId);
        let assignmentsList: any[] = [];
        try {
          const stored = localStorage.getItem("mervox_academy_assignments_list");
          if (stored) {
            assignmentsList = JSON.parse(stored);
          }
        } catch {}
        
        if (assignmentsList.length === 0) {
          progress.forEach((p) => {
            assignmentsList.push({ id: `asg-${p.courseId}-1`, courseId: p.courseId });
            assignmentsList.push({ id: `asg-${p.courseId}-2`, courseId: p.courseId });
          });
        }
        
        const filteredAsgs = assignmentsList.filter((a) => enrolledCourseIds.includes(a.courseId || a.course_id));
        let viewedAsgIds: string[] = [];
        try {
          const stored = localStorage.getItem(`mervox_academy_viewed_asg_${userId}`);
          viewedAsgIds = stored ? JSON.parse(stored) : [];
        } catch {}
        const unreadAsg = filteredAsgs.filter((a: any) => !viewedAsgIds.includes(a.id)).length;
        setUnreadAsgCount(unreadAsg);
      }

      // 4. Community forum unread count
      if (pathname === "/academy/dashboard/community") {
        setUnreadCommCount(0);
      } else {
        let forumPosts: any[] = [];
        try {
          const stored = localStorage.getItem("mervox_academy_posts");
          forumPosts = stored ? JSON.parse(stored) : [];
        } catch {}
        
        let viewedPostIds: string[] = [];
        try {
          const stored = localStorage.getItem(`mervox_academy_viewed_post_${userId}`);
          viewedPostIds = stored ? JSON.parse(stored) : [];
        } catch {}
        const unreadComm = forumPosts.filter((post: any) => !viewedPostIds.includes(post.id)).length;
        setUnreadCommCount(unreadComm);
      }

      // 5. Help & Support Ticket Updates
      if (pathname === "/academy/dashboard/help") {
        setUnreadTicketCount(0);
      }
    } catch (err) {
      console.error("Error calculating student navigation badges:", err);
    }
  };

  useEffect(() => {
    calculateBadges();

    // Mark current page items as viewed in localStorage
    if (userId) {
      if (pathname === "/academy/dashboard/messages") {
        import("@/utils/supabaseClient").then(async ({ supabase, isSupabaseConfigured }) => {
          if (isSupabaseConfigured) {
            const { data } = await supabase.from("messages").select("id").eq("user_id", userId);
            if (data) {
              const allIds = data.map((m: any) => m.id);
              localStorage.setItem(`mervox_academy_viewed_msg_${userId}`, JSON.stringify(allIds));
              setUnreadMsgCount(0);
            }
          }
        });
      }
    }
  }, [userId, pathname]);

  const menuItems = [
    { name: "Dashboard", href: "/academy/dashboard", icon: LayoutDashboard },
    { name: "My Courses", href: "/academy/dashboard/courses", icon: BookOpen },
    { name: "Live Classes", href: "/academy/dashboard/live", icon: Video },
    { name: "Assignments", href: "/academy/dashboard/assignments", icon: FileText },
    { name: "Quizzes", href: "/academy/dashboard/quizzes", icon: CheckSquare },
    { name: "Certificates", href: "/academy/dashboard/certificates", icon: Award },
    { name: "Downloads", href: "/academy/dashboard/downloads", icon: Download },
    { name: "Community", href: "/academy/dashboard/community", icon: Users },
    { name: "Messages", href: "/academy/dashboard/messages", icon: MessageCircle },
    { name: "Wallet & Payments", href: "/academy/dashboard/wallet", icon: CreditCard },
    { name: "Profile", href: "/academy/dashboard/profile", icon: User },
    { name: "Settings", href: "/academy/dashboard/settings", icon: Settings },
    { name: "Help & Support", href: "/academy/dashboard/help", icon: HelpCircle },
    { name: "Main Website", href: "/", icon: Globe },
  ];

  const handleLogout = () => {
    logout();
    router.push("/academy/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 h-screen bg-white dark:bg-[#18181c] border-r border-card-border/60 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:h-full ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header/Logo */}
        <div className="flex items-center justify-between p-6 border-b border-card-border/40 shrink-0">
          <Link href="/academy/dashboard" className="flex items-center gap-2" onClick={onClose}>
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
                Academy
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin select-none">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Exact path match or starting subpaths
            const isActive = pathname === item.href;

            let badgeCount = 0;
            if (item.name === "Messages") badgeCount = unreadMsgCount;
            if (item.name === "Live Classes") badgeCount = unreadLiveCount;
            if (item.name === "Assignments") badgeCount = unreadAsgCount;
            if (item.name === "Community") badgeCount = unreadCommCount;
            if (item.name === "Help & Support") badgeCount = unreadTicketCount;

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
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-400"}`} />
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
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4 text-red-500 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
