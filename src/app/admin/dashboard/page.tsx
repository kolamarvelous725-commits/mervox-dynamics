"use client";

import { supabase } from "@/utils/supabaseClient";
import { useState, useEffect } from "react";
import { Users, BookOpen, UserPlus, DollarSign, Award, Video, Megaphone, Calendar, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
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

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [
          { count: studentCount, data: recentStudentsData },
          { count: courseCount },
          { count: certCount },
          { count: liveCount },
          { count: annCount },
          { count: enrollCount },
          { data: paymentsData }
        ] = await Promise.all([
          supabase
            .from("profiles")
            .select("*", { count: "exact" })
            .eq("role", "student")
            .order("created_at", { ascending: false }),
          supabase
            .from("courses")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("certificates")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("live_classes")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("announcements")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("enrollments")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("payments")
            .select("amount")
            .eq("status", "Paid")
        ]);

        const totalRevenue = paymentsData?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

        setMetrics({
          totalStudents: studentCount || 0,
          totalCourses: courseCount || 0,
          onlineStudents: 0,
          revenue: totalRevenue,
          certificates: certCount || 0,
          liveClasses: liveCount || 0,
          announcements: annCount || 0,
          enrollments: enrollCount || 0,
        });

        if (recentStudentsData) {
          const formatted = recentStudentsData.slice(0, 4).map((p: any) => ({
            id: p.id,
            firstName: p.first_name,
            lastName: p.last_name,
            email: p.email,
            memberSince: p.member_since,
          }));
          setRecentStudents(formatted);
        }
      } catch (err) {
        console.error("Error fetching admin metrics:", err);
      }
    };

    fetchMetrics();
  }, []);

  const cardDetails = [
    { name: "Total Students", value: metrics.totalStudents, icon: Users, color: "text-[#0055ff] bg-blue-50/70 dark:bg-blue-950/20" },
    { name: "Total Courses", value: metrics.totalCourses, icon: BookOpen, color: "text-purple-600 bg-purple-50/70 dark:bg-purple-950/20" },
    { name: "Students Online", value: metrics.onlineStudents, icon: UserCheck, color: "text-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/20" },
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

      {/* Grid widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {cardDetails.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">
                  {card.name}
                </span>
                <span className="text-xl font-heading font-black text-slate-800 dark:text-white">
                  {card.value}
                </span>
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
            {recentStudents.length === 0 ? (
              <p className="text-xs text-slate-450 font-semibold py-4 text-center">No registered students yet.</p>
            ) : (
              recentStudents.map((st) => (
                <div key={st.id} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-900 border border-card-border/60 text-[#0055ff] flex items-center justify-center font-heading font-black text-xs">
                      {st.firstName.charAt(0)}{st.lastName.charAt(0)}
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
