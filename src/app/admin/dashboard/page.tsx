"use client";

import { adminSupabase, isSupabaseConfigured } from "@/utils/supabaseClient";
import { useState, useEffect } from "react";
import { Users, BookOpen, UserPlus, DollarSign, Award, Video, Megaphone, Calendar, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";
import AcademyDB from "@/utils/academyDb";

export default function AdminDashboardPage() {
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [presenceOnlineStudents, setPresenceOnlineStudents] = useState<number>(0);
  const [presenceLoading, setPresenceLoading] = useState<boolean>(true);
  const [presenceError, setPresenceError] = useState<boolean>(false);

  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    totalCourses: 0,
    onlineStudents: 0,
    revenue: 0,
    certificates: 0,
    liveClasses: 0,
    announcements: 0,
    enrollments: 0,
  });

  const [recentStudents, setRecentStudents] = useState<any[]>([]);

  const fetchMetrics = async () => {
    setMetricsLoading(true);
    setMetricsError(null);
    try {
      if (!isSupabaseConfigured) {
        const students = AcademyDB.getStudents();
        const courses = AcademyDB.getCourses();
        const liveClasses = AcademyDB.getLiveClasses();
        const announcements = AcademyDB.getAnnouncements();
        const certificates = AcademyDB.getAllCertificates();
        
        const usersJson = typeof window !== "undefined" ? localStorage.getItem("mervox_academy_users") : null;
        const users = usersJson ? JSON.parse(usersJson) : [];
        let enrollCount = 0;
        users.forEach((u: any) => {
          if (u.progress) enrollCount += u.progress.length;
        });

        setMetrics({
          totalStudents: students.length,
          totalCourses: courses.length,
          onlineStudents: 0,
          revenue: enrollCount * 250 || 1250,
          certificates: certificates.length,
          liveClasses: liveClasses.length,
          announcements: announcements.length,
          enrollments: enrollCount || students.length * 2,
        });

        const formatted = students.slice(0, 4).map((p: any) => ({
          id: p.id,
          firstName: p.firstName,
          lastName: p.lastName,
          email: p.email,
          memberSince: p.memberSince || "Joined",
        }));
        setRecentStudents(formatted);
        setMetricsLoading(false);
        setPresenceLoading(false);
        return;
      }

      // Parallel execute all 7 independent metric queries simultaneously
      const [
        profilesRes,
        coursesRes,
        certsRes,
        liveRes,
        annRes,
        enrollRes,
        payRes,
      ] = await Promise.all([
        adminSupabase
          .from("profiles")
          .select("id, full_name, email, role, created_at")
          .order("created_at", { ascending: false }),
        adminSupabase
          .from("courses")
          .select("id", { count: "exact", head: true }),
        adminSupabase
          .from("certificates")
          .select("id", { count: "exact", head: true }),
        adminSupabase
          .from("live_classes")
          .select("id", { count: "exact", head: true }),
        adminSupabase
          .from("announcements")
          .select("id", { count: "exact", head: true }),
        adminSupabase
          .from("enrollments")
          .select("id, course_id", { count: "exact" }),
        adminSupabase
          .from("payments")
          .select("amount")
          .eq("status", "Paid"),
      ]);

      // 1. Process Student Profiles
      let studentCount = 0;
      let actualStudents: any[] = [];
      if (profilesRes.error) {
        console.error("Supabase profiles query error:", profilesRes.error);
        setMetricsError(profilesRes.error.message || "Failed to load profiles");
      } else if (profilesRes.data) {
        actualStudents = profilesRes.data.filter((p: any) => {
          const email = (p.email || "").toLowerCase().trim();
          const isAdmin = email === "marvelousotugalu012@gmail.com" || email === "kolamarvelous725@gmail.com" || p.role === "admin";
          return !isAdmin;
        });
        studentCount = actualStudents.length;
      }

      // 2. Process Courses
      const courseCount = coursesRes.count || 0;

      // 3. Process Certificates
      const certCount = certsRes.count || 0;

      // 4. Process Live Classes
      const liveCount = liveRes.count || 0;

      // 5. Process Announcements
      const annCount = annRes.count || 0;

      // 6. Process Enrollments
      const enrollCount = enrollRes.count ?? (enrollRes.data?.length || 0);
      const enrollmentsList = enrollRes.data || [];

      // 7. Process Payments & Revenue
      let totalRevenue = 0;
      if (payRes.data && payRes.data.length > 0) {
        totalRevenue = payRes.data.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      } else if (enrollmentsList.length > 0) {
        enrollmentsList.forEach((e: any) => {
          let price = 199;
          if (e.course_id === "forex-trading") price = 299;
          if (e.course_id === "ai-automation") price = 249;
          totalRevenue += price;
        });
      }

      setMetrics({
        totalStudents: studentCount,
        totalCourses: courseCount,
        onlineStudents: 0,
        revenue: totalRevenue,
        certificates: certCount,
        liveClasses: liveCount,
        announcements: annCount,
        enrollments: enrollCount,
      });

      const formatted = actualStudents.slice(0, 4).map((p: any) => {
        const parts = (p.full_name || "").trim().split(/\s+/);
        const firstName = parts[0] || (p.email ? p.email.split("@")[0] : "Student");
        const lastName = parts.slice(1).join(" ") || "";
        let memberSince = "Joined";
        if (p.created_at) {
          try {
            memberSince = new Date(p.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" });
          } catch {}
        }
        return {
          id: p.id,
          firstName,
          lastName,
          email: p.email,
          memberSince,
        };
      });
      setRecentStudents(formatted);
    } catch (err: any) {
      console.error("General error loading admin dashboard page metrics:", err);
      setMetricsError(err.message || "An unexpected error occurred loading metrics");
    } finally {
      setMetricsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    if (!isSupabaseConfigured) return;

    // Realtime Database Changes Listener
    const channel = adminSupabase
      .channel("admin_dashboard_metrics_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => fetchMetrics())
      .on("postgres_changes", { event: "*", schema: "public", table: "enrollments" }, () => fetchMetrics())
      .on("postgres_changes", { event: "*", schema: "public", table: "payments" }, () => fetchMetrics())
      .on("postgres_changes", { event: "*", schema: "public", table: "certificates" }, () => fetchMetrics())
      .on("postgres_changes", { event: "*", schema: "public", table: "live_classes" }, () => fetchMetrics())
      .on("postgres_changes", { event: "*", schema: "public", table: "announcements" }, () => fetchMetrics())
      .subscribe();

    // Supabase Realtime Presence Channel for tracking active online students
    const presenceChannel = adminSupabase.channel("mervox_academy_presence");

    const updatePresenceCount = () => {
      try {
        const state = presenceChannel.presenceState();
        const uniqueStudentIds = new Set<string>();

        Object.values(state).forEach((presences: any) => {
          if (Array.isArray(presences)) {
            presences.forEach((p: any) => {
              const email = (p.email || "").toLowerCase().trim();
              const isAdmin =
                email === "marvelousotugalu012@gmail.com" ||
                email === "kolamarvelous725@gmail.com" ||
                p.role === "admin";
              if (!isAdmin && p.userId) {
                uniqueStudentIds.add(p.userId);
              }
            });
          }
        });

        setPresenceOnlineStudents(uniqueStudentIds.size);
        setPresenceLoading(false);
        setPresenceError(false);
      } catch (pErr) {
        console.error("Error calculating presence count:", pErr);
        setPresenceError(true);
      }
    };

    presenceChannel
      .on("presence", { event: "sync" }, updatePresenceCount)
      .on("presence", { event: "join" }, updatePresenceCount)
      .on("presence", { event: "leave" }, updatePresenceCount)
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          updatePresenceCount();
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setPresenceError(true);
          setPresenceLoading(false);
        }
      });

    return () => {
      adminSupabase.removeChannel(channel);
      adminSupabase.removeChannel(presenceChannel);
    };
  }, []);

  const cardDetails = [
    { name: "Total Students", value: metrics.totalStudents, icon: Users, color: "text-[#0055ff] bg-blue-50/70 dark:bg-blue-950/20" },
    { name: "Total Courses", value: metrics.totalCourses, icon: BookOpen, color: "text-purple-600 bg-purple-50/70 dark:bg-purple-950/20" },
    { name: "Students Online", value: presenceLoading ? "..." : presenceError ? "Sync Error" : presenceOnlineStudents, icon: UserCheck, color: "text-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/20" },
    { name: "Total Revenue", value: `$${metrics.revenue.toLocaleString()}`, icon: DollarSign, color: "text-amber-600 bg-amber-50/70 dark:bg-amber-950/20" },
    { name: "Certificates Issued", value: metrics.certificates, icon: Award, color: "text-rose-600 bg-rose-50/70 dark:bg-rose-950/20" },
    { name: "Live Classes", value: metrics.liveClasses, icon: Video, color: "text-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/20" },
    { name: "Announcements", value: metrics.announcements, icon: Megaphone, color: "text-sky-600 bg-sky-50/70 dark:bg-sky-950/20" },
    { name: "Enrollments", value: metrics.enrollments, icon: UserPlus, color: "text-blue-600 bg-blue-50/70 dark:bg-blue-950/20" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Metrics Overview</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Admin Dashboard</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2 md:mt-0 leading-relaxed font-semibold">
          Analyze real-time learner registrations, payouts, class schedules, and issued course credentials.
        </p>
      </div>

      {/* Error state banner if Supabase query failed */}
      {metricsError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 flex items-center justify-between gap-4 text-left">
          <div>
            <h4 className="text-xs font-bold text-rose-800 dark:text-rose-300">Database Synchronization Notice</h4>
            <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">{metricsError}</p>
          </div>
          <button
            onClick={() => fetchMetrics()}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer shrink-0"
          >
            Retry Sync
          </button>
        </div>
      )}

      {/* Grid widgets — Permanently anchored */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {cardDetails.map((card, idx) => {
          const Icon = card.icon;
          const isStudentsOnlineCard = card.name === "Students Online";
          const isCardLoading = isStudentsOnlineCard ? presenceLoading : metricsLoading;
          const isCardError = isStudentsOnlineCard ? presenceError : (metricsError && card.name === "Total Students");

          return (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs flex items-center justify-between gap-4 transition-all"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">
                  {card.name}
                </span>
                {isCardLoading ? (
                  <div className="h-7 w-16 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md" />
                ) : isCardError ? (
                  <span className="text-xs font-bold text-rose-500 block">Sync Error</span>
                ) : (
                  <span className="text-xl font-heading font-black text-slate-800 dark:text-white">
                    {card.value}
                  </span>
                )}
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main content columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Left: Recent registrations */}
        <div className="lg:col-span-8 p-6 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-card-border/40">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Recent Student Registrations
            </h3>
            <Link
              href="/admin/dashboard/students"
              className="text-[10px] font-bold text-[#0055ff] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-card-border/40">
            {metricsLoading ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : recentStudents.length === 0 ? (
              <p className="text-xs text-slate-450 font-semibold py-4 text-center">No registered students yet.</p>
            ) : (
              recentStudents.map((st) => (
                <div key={st.id} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-900 border border-card-border/60 text-[#0055ff] flex items-center justify-center font-heading font-black text-xs">
                      {(st.firstName || "S").charAt(0)}{(st.lastName || "U").charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-none">
                        {st.firstName} {st.lastName}
                      </h4>
                      <span className="text-[9px] text-slate-400 mt-1 block leading-none">{st.email}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                    {st.memberSince}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Quick actions menu */}
        <div className="lg:col-span-4 p-6 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs space-y-4 select-none">
          <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider pb-2 border-b border-card-border/40">
            Quick Actions Panel
          </h3>
          
          <div className="grid grid-cols-1 gap-2.5">
            <Link
              href="/admin/dashboard/courses"
              className="p-3.5 rounded-xl border border-card-border hover:bg-slate-50 dark:hover:bg-slate-900/50 flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all hover:translate-x-0.5"
            >
              <BookOpen className="w-4 h-4 text-purple-500" />
              <span>Create Dynamic Program</span>
            </Link>

            <Link
              href="/admin/dashboard/live-classes"
              className="p-3.5 rounded-xl border border-card-border hover:bg-slate-50 dark:hover:bg-slate-900/50 flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all hover:translate-x-0.5"
            >
              <Video className="w-4 h-4 text-indigo-500" />
              <span>Schedule Live Stream</span>
            </Link>

            <Link
              href="/admin/dashboard/announcements"
              className="p-3.5 rounded-xl border border-card-border hover:bg-slate-50 dark:hover:bg-slate-900/50 flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all hover:translate-x-0.5"
            >
              <Megaphone className="w-4 h-4 text-sky-500" />
              <span>Broadcast Announcement</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
