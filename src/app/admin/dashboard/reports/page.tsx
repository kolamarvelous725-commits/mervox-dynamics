"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, DollarSign, Award, BookOpen, Users, ArrowUpRight, GraduationCap, RefreshCw } from "lucide-react";
import { adminSupabase, isSupabaseConfigured } from "@/utils/supabaseClient";
import AcademyDB from "@/utils/academyDb";

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
  const [studentProgressList, setStudentProgressList] = useState<any[]>([]);
  const [monthlyGrowth, setMonthlyGrowth] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadReportData = async () => {
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        const students = AcademyDB.getStudents();
        const courses = AcademyDB.getCourses();
        let totalRevenue = 0;
        let totalEnrollments = 0;
        let totalCompletions = 0;
        const progressList: any[] = [];

        const popular = courses.map((c) => {
          let cEnrolled = 0;
          let cCompleted = 0;
          const courseLessons = c.lessons || [];

          students.forEach((s) => {
            const userProg = AcademyDB.getProgress(s.id);
            const matching = userProg.find((p) => p.courseId === c.id);
            if (matching) {
              cEnrolled++;
              totalEnrollments++;
              const completedCount = matching.completedLessons?.length || 0;
              const totalCount = courseLessons.length || 20;
              const pct = Math.round((completedCount / totalCount) * 100);
              if (pct >= 100) {
                cCompleted++;
                totalCompletions++;
              }
              progressList.push({
                studentName: `${s.firstName} ${s.lastName}`,
                studentEmail: s.email,
                courseTitle: c.title,
                completedLessons: completedCount,
                totalLessons: totalCount,
                progressPercent: pct,
              });
            }
          });

          let price = 199;
          if (c.id === "forex-trading") price = 299;
          if (c.id === "ai-automation") price = 249;
          const cRev = cEnrolled * price;
          totalRevenue += cRev;

          return {
            title: c.title,
            enrollments: cEnrolled,
            completions: cCompleted,
            revenue: cRev,
          };
        });

        popular.sort((a, b) => b.enrollments - a.enrollments);
        setPopularCourses(popular);
        setReportData({
          totalStudents: students.length,
          totalRevenue,
          activeEnrollments: totalEnrollments,
          completionsCount: totalCompletions,
        });
        setStudentProgressList(progressList);
        setMonthlyGrowth([
          { month: "May", count: Math.max(0, students.length - 2) },
          { month: "Jun", count: Math.max(0, students.length - 1) },
          { month: "Jul", count: students.length },
        ]);
        setLoading(false);
        return;
      }

      // 1. Fetch real student profiles (filter out admin)
      const { data: allProfiles } = await adminSupabase
        .from("profiles")
        .select("*");

      const studentProfiles = (allProfiles || []).filter(
        (p: any) => p.role === "student" && p.email !== "marvelousotugalu012@gmail.com" && p.email !== "kolamarvelous725@gmail.com"
      );

      // 2. Fetch courses
      const { data: coursesData } = await adminSupabase
        .from("courses")
        .select("*");
      const courses = coursesData && coursesData.length > 0 ? coursesData : AcademyDB.getCourses();

      // 3. Fetch lessons
      const { data: lessonsData } = await adminSupabase
        .from("course_lessons")
        .select("*");
      const lessons = lessonsData || [];

      // 4. Fetch enrollments
      const { data: enrollmentsData } = await adminSupabase
        .from("enrollments")
        .select("*, profiles(*)");
      const enrollments = (enrollmentsData || []).filter((e: any) =>
        studentProfiles.some((s: any) => s.id === e.user_id)
      );

      // 5. Fetch lesson progress
      const { data: lessonProgressData } = await adminSupabase
        .from("lesson_progress")
        .select("*")
        .eq("completed", true);
      const lessonProgress = lessonProgressData || [];

      // 6. Fetch payments for actual dollar figures
      const { data: paymentsData } = await adminSupabase
        .from("payments")
        .select("*");

      const totalStudents = studentProfiles.length;
      const activeEnrollments = enrollments.length;

      const lessonsByCourse: Record<string, any[]> = {};
      lessons.forEach((l: any) => {
        if (!lessonsByCourse[l.course_id]) lessonsByCourse[l.course_id] = [];
        lessonsByCourse[l.course_id].push(l);
      });

      const studentProgressListMapped = enrollments.map((e: any) => {
        const profile = e.profiles || studentProfiles.find((sp: any) => sp.id === e.user_id);
        const courseObj = courses.find((c: any) => c.id === e.course_id);
        const cLessons = lessonsByCourse[e.course_id] || [];
        const total = cLessons.length > 0 ? cLessons.length : 20;

        const completedCount = cLessons.length > 0
          ? cLessons.filter((l: any) =>
              lessonProgress.some((lp: any) => lp.user_id === e.user_id && lp.lesson_id === l.id && lp.completed)
            ).length
          : (lessonProgress.filter((lp: any) => lp.user_id === e.user_id).length);

        const progressPercent = total > 0 ? Math.min(100, Math.round((completedCount / total) * 100)) : 0;

        return {
          studentName: profile ? (profile.full_name || profile.email) : "Student Account",
          courseTitle: courseObj ? courseObj.title : e.course_id,
          completedLessons: completedCount,
          totalLessons: total,
          progressPercent,
        };
      });

      const completionsCount = studentProgressListMapped.filter((sp) => sp.progressPercent === 100).length;

      // Revenue: use payments table sum if available, else standard tuition tier calculation
      let totalRevenue = 0;
      if (paymentsData && paymentsData.length > 0) {
        totalRevenue = paymentsData.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);
      } else {
        enrollments.forEach((e: any) => {
          let price = 199;
          if (e.course_id === "forex-trading") price = 299;
          if (e.course_id === "ai-automation") price = 249;
          totalRevenue += price;
        });
      }

      const popular: PopularCourse[] = courses.map((c: any) => {
        const cEnrollments = enrollments.filter((e: any) => e.course_id === c.id);
        const cProgress = studentProgressListMapped.filter((sp) => sp.courseTitle === c.title);
        const cCompletions = cProgress.filter((sp) => sp.progressPercent === 100).length;

        let price = 199;
        if (c.id === "forex-trading") price = 299;
        if (c.id === "ai-automation") price = 249;

        return {
          title: c.title,
          enrollments: cEnrollments.length,
          completions: cCompletions,
          revenue: cEnrollments.length * price,
        };
      });

      popular.sort((a, b) => b.enrollments - a.enrollments);

      setPopularCourses(popular);
      setReportData({
        totalStudents,
        totalRevenue,
        activeEnrollments,
        completionsCount,
      });
      setStudentProgressList(studentProgressListMapped);

      setMonthlyGrowth([
        { month: "May", count: Math.max(0, totalStudents - 3) },
        { month: "Jun", count: Math.max(0, totalStudents - 1) },
        { month: "Jul", count: totalStudents },
      ]);
    } catch (err) {
      console.error("Error loading reports data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();

    if (isSupabaseConfigured) {
      const channel = adminSupabase
        .channel("admin_reports_sync")
        .on("postgres_changes", { event: "*", schema: "public", table: "enrollments" }, () => loadReportData())
        .on("postgres_changes", { event: "*", schema: "public", table: "lesson_progress" }, () => loadReportData())
        .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => loadReportData())
        .on("postgres_changes", { event: "*", schema: "public", table: "payments" }, () => loadReportData())
        .subscribe();

      return () => {
        adminSupabase.removeChannel(channel);
      };
    }
  }, []);

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

      {/* Student Progress Ledger */}
      <div className="p-6 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider pb-2 border-b border-card-border/40">
          Student Progress Ledger
        </h3>

        <div className="rounded-xl border border-card-border overflow-hidden bg-slate-50/50 dark:bg-transparent">
          <div className="divide-y divide-card-border/30 text-xs font-semibold">
            <div className="p-3 bg-slate-100/50 dark:bg-slate-900/30 grid grid-cols-12 text-[9px] uppercase tracking-wider font-black text-slate-450 select-none">
              <span className="col-span-4">Student Name</span>
              <span className="col-span-4">Learning Program</span>
              <span className="col-span-2 text-center">Lessons completed</span>
              <span className="col-span-2 text-right">Progress ratio</span>
            </div>

            {studentProgressList.length === 0 ? (
              <div className="p-4 text-center text-slate-400 font-medium">No enrollments tracked.</div>
            ) : (
              studentProgressList.map((sp, idx) => (
                <div key={idx} className="p-3 grid grid-cols-12 text-slate-655 dark:text-slate-350 items-center">
                  <span className="col-span-4 font-bold text-slate-800 dark:text-white">{sp.studentName}</span>
                  <span className="col-span-4 font-medium">{sp.courseTitle}</span>
                  <span className="col-span-2 text-center font-bold">{sp.completedLessons} / {sp.totalLessons}</span>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <div className="w-16 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden shrink-0">
                      <div
                        className="bg-[#0055ff] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${sp.progressPercent}%` }}
                      />
                    </div>
                    <span className="font-black text-slate-800 dark:text-white w-8 text-right">{sp.progressPercent}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
