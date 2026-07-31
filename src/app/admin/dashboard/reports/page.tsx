"use client";

import { AcademyDB } from "@/utils/academyDb";
import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, DollarSign, Award, BookOpen, Users, ArrowUpRight, GraduationCap } from "lucide-react";

interface PopularCourse {
  title: string;
  enrollments: number;
  completions: number;
  revenue: number;
}

export default function AdminReportsPage() {
  const [reportData, setReportData] = useState({
    totalStudents: 0,
    totalRevenue: 0,
    activeEnrollments: 0,
    completionsCount: 0,
  });

  const [popularCourses, setPopularCourses] = useState<PopularCourse[]>([]);
  const [monthlyGrowth, setMonthlyGrowth] = useState<any[]>([]);

  useEffect(() => {
    const students = AcademyDB.getStudents();
    const courses = AcademyDB.getCourses();

    let enrollmentsTotal = 0;
    let completionsTotal = 0;
    let revenueTotal = 0;

    // Course tracking map
    const courseMap = new Map<string, { enrollments: number; completions: number; price: number }>();
    courses.forEach((c) => {
      let price = 199;
      if (c.id === "forex-trading") price = 299;
      if (c.id === "ai-automation") price = 249;
      courseMap.set(c.id, { enrollments: 0, completions: 0, price });
    });

    students.forEach((student: any) => {
      const progress = student.progress || [];
      progress.forEach((p: any) => {
        enrollmentsTotal++;
        if (p.status === "Completed") {
          completionsTotal++;
        }

        const current = courseMap.get(p.courseId);
        if (current) {
          courseMap.set(p.courseId, {
            enrollments: current.enrollments + 1,
            completions: p.status === "Completed" ? current.completions + 1 : current.completions,
            price: current.price,
          });
          revenueTotal += current.price;
        }
      });
    });

    // Compile popular courses
    const popular: PopularCourse[] = [];
    courseMap.forEach((val, key) => {
      const courseObj = courses.find((c) => c.id === key);
      popular.push({
        title: courseObj ? courseObj.title : key,
        enrollments: val.enrollments,
        completions: val.completions,
        revenue: val.enrollments * val.price,
      });
    });

    // Sort by popular enrollments
    popular.sort((a, b) => b.enrollments - a.enrollments);
    setPopularCourses(popular);

    setReportData({
      totalStudents: students.length,
      totalRevenue: revenueTotal,
      activeEnrollments: enrollmentsTotal,
      completionsCount: completionsTotal,
    });

    // Mock registrations monthly growth
    setMonthlyGrowth([
      { month: "May", count: 2 },
      { month: "Jun", count: 5 },
      { month: "Jul", count: students.length > 0 ? students.length : 8 },
    ]);

  }, []);

  // Compute maximum enrollments to scale bars proportionally
  const maxEnrollments = Math.max(...popularCourses.map((c) => c.enrollments), 1);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Performance Insights</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Analytical Reports</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2 md:mt-0 leading-relaxed font-semibold">
          Audit metrics dashboard covering user counts, revenue channels, completion performance, and course statistics.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        <div className="p-5 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gross Income</span>
            <span className="text-emerald-500 text-[10px] font-black uppercase flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +14%
            </span>
          </div>
          <h3 className="text-xl font-heading font-black text-slate-850 dark:text-white mt-2">
            ${reportData.totalRevenue.toLocaleString()}
          </h3>
          <span className="text-[9px] font-semibold text-slate-400 block mt-1.5">Accumulated tuition payouts</span>
        </div>

        <div className="p-5 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registrations</span>
            <span className="text-blue-500 text-[10px] font-black uppercase flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Active
            </span>
          </div>
          <h3 className="text-xl font-heading font-black text-slate-855 dark:text-white mt-2">
            {reportData.totalStudents} Students
          </h3>
          <span className="text-[9px] font-semibold text-slate-400 block mt-1.5">Registered academy accounts</span>
        </div>

        <div className="p-5 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Program Enrollments</span>
            <span className="text-purple-500 text-[10px] font-black uppercase">Direct</span>
          </div>
          <h3 className="text-xl font-heading font-black text-slate-855 dark:text-white mt-2">
            {reportData.activeEnrollments} Active
          </h3>
          <span className="text-[9px] font-semibold text-slate-400 block mt-1.5">Enrolled learning slots</span>
        </div>

        <div className="p-5 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Course Completions</span>
            <span className="text-rose-500 text-[10px] font-black uppercase">Graduated</span>
          </div>
          <h3 className="text-xl font-heading font-black text-slate-855 dark:text-white mt-2">
            {reportData.completionsCount} Awards
          </h3>
          <span className="text-[9px] font-semibold text-slate-400 block mt-1.5">Students completed 100% courses</span>
        </div>
      </div>

      {/* Main Graphs columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Popular Courses checklist bar graph */}
        <div className="lg:col-span-7 p-6 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider pb-2 border-b border-card-border/40">
            Popular Learning Programs
          </h3>

          <div className="space-y-4 pt-1">
            {popularCourses.map((c, idx) => {
              const barWidth = `${Math.max((c.enrollments / maxEnrollments) * 100, 10)}%`;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300 font-bold truncate max-w-[280px]">
                      {c.title}
                    </span>
                    <span className="text-slate-450 uppercase tracking-wider text-[10px] font-bold">
                      {c.enrollments} Enrolled ({c.completions} graduates)
                    </span>
                  </div>
                  
                  {/* Dynamic Visual CSS bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-3.5 overflow-hidden">
                    <div
                      className="bg-[#0055ff] h-3.5 rounded-full transition-all duration-500 flex items-center justify-end pr-2 text-[8px] font-black text-white"
                      style={{ width: barWidth }}
                    >
                      {c.enrollments > 0 && `${c.enrollments}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Registration growth & Financial Ledger table */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs space-y-5">
          <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider pb-2 border-b border-card-border/40">
            Monthly Payout Ledger
          </h3>

          <div className="rounded-xl border border-card-border overflow-hidden bg-slate-50/50 dark:bg-transparent">
            <div className="divide-y divide-card-border/30 text-xs font-semibold">
              <div className="p-3 bg-slate-100/50 dark:bg-slate-900/30 flex justify-between text-[9px] uppercase tracking-wider font-black text-slate-450 select-none">
                <span>Month</span>
                <span>Enrollees count</span>
              </div>
              {monthlyGrowth.map((g, i) => (
                <div key={i} className="p-3 flex justify-between text-slate-655 dark:text-slate-350">
                  <span className="font-bold">{g.month} 2026</span>
                  <span className="font-black text-slate-800 dark:text-white">{g.count} signups</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-card-border/40 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Academy Monetization Ratio</span>
            <div className="flex gap-4">
              <div className="flex-1 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100/50 text-center">
                <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider block">Average Ticket</span>
                <span className="text-sm font-heading font-black text-blue-700 dark:text-blue-400 mt-1">$229</span>
              </div>
              <div className="flex-1 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/50 text-center">
                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider block">Conversion Rate</span>
                <span className="text-sm font-heading font-black text-emerald-700 dark:text-emerald-400 mt-1">100%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
