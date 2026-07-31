"use client";

import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { AcademyDB } from "@/utils/academyDb";
import { Course, UserCourseProgress, RecentActivity, Notification } from "@/types/academy";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  Award,
  Clock,
  Play,
  Video,
  ArrowRight,
  TrendingUp,
  FileText,
  User,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Calendar as CalendarIcon,
  ChevronRight as ChevronRightIcon
} from "lucide-react";

export default function DashboardPage() {
  const { student } = useAcademyAuth();
  const router = useRouter();
  const userId = student?.id || "";

  const [studentProgress, setStudentProgress] = useState<UserCourseProgress[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [certificates, setCertificates] = useState<string[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  // Load user data on mount / session load
  useEffect(() => {
    if (userId) {
      setStudentProgress(AcademyDB.getProgress(userId));
      setActivities(AcademyDB.getActivities(userId));
      setNotifications(AcademyDB.getNotifications(userId));
      setCertificates(AcademyDB.getCertificates(userId));
      setAnnouncements(AcademyDB.getAnnouncements());
      setCourses(AcademyDB.getCourses());
    }
  }, [userId]);

  // Simulated live classes
  const liveClasses = [
    {
      id: "live-1",
      title: "Live Forex Market Review",
      instructor: "JPForex Mentor",
      date: "July 31, 2026",
      time: "16:00 BST",
    },
    {
      id: "live-2",
      title: "ChatGPT Prompts Deep Dive",
      instructor: "AI Specialist",
      date: "August 2, 2026",
      time: "18:00 BST",
    },
  ];

  // Dynamic statistics calculations
  const coursesEnrolled = studentProgress.length;
  const lessonsCompleted = studentProgress.reduce((acc, c) => acc + c.lessonsCompleted, 0);
  const certificatesEarned = certificates.length;
  
  // Accumulated Study Hours calculation (25 minutes per completed lesson)
  const totalMinutes = studentProgress.reduce((acc, c) => acc + c.studyMinutes, 0);
  const studyHours = Math.round(totalMinutes / 60);

  // Overall average progress percentage
  const averageProgress = coursesEnrolled > 0 
    ? Math.round(studentProgress.reduce((acc, c) => acc + c.progress, 0) / coursesEnrolled)
    : 0;

  // Filter dynamic enrolled courses metadata
  const enrolledCoursesList = studentProgress.map((prog) => {
    const meta = courses.find((t) => t.id === prog.courseId);
    return {
      id: prog.courseId,
      title: meta?.title || "Course Program",
      description: meta?.description || "",
      thumbnail: meta?.thumbnail || "/logo.png",
      progress: prog.progress,
      status: prog.status,
      lessonsCompleted: prog.lessonsCompleted,
      totalLessons: prog.totalLessons,
    };
  });

  const getInitials = (first = "", last = "") => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  const handleActionClick = (msg: string) => {
    alert(`${msg} is simulated in this MVP and will be fully implemented in the next release.`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none">
      
      {/* Left/Center Main Column */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-[24px] bg-gradient-to-r from-blue-600/90 to-indigo-600/95 text-white relative overflow-hidden shadow-lg border border-blue-500/10">
          <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
          <div className="absolute right-[5%] bottom-[-20%] w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-3 max-w-xl text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Portal Live</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight leading-tight">
              Welcome back, {student?.firstName} 👋
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-lg">
              Keep learning. Keep growing. Every lesson moves you closer to your goals.
            </p>
            <div className="pt-2">
              <button
                onClick={() => router.push("/academy/dashboard/courses")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 font-bold rounded-xl shadow-md text-xs hover:-translate-y-[1px] active:scale-98 transition-all duration-200 cursor-pointer"
              >
                <span>Continue Learning</span>
                <Play className="w-3 h-3 fill-blue-600 text-blue-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          {/* Card 1: Enrolled */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#18181c] border border-card-border/60 shadow-xs flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Enrolled</p>
              <h4 className="text-lg font-heading font-black text-slate-800 dark:text-white leading-none mt-1">{coursesEnrolled}</h4>
            </div>
          </div>

          {/* Card 2: Completed */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#18181c] border border-card-border/60 shadow-xs flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Lessons</p>
              <h4 className="text-lg font-heading font-black text-slate-800 dark:text-white leading-none mt-1">{lessonsCompleted}</h4>
            </div>
          </div>

          {/* Card 3: Certificates */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#18181c] border border-card-border/60 shadow-xs flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Certificates</p>
              <h4 className="text-lg font-heading font-black text-slate-800 dark:text-white leading-none mt-1">{certificatesEarned}</h4>
            </div>
          </div>

          {/* Card 4: Study Hours */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#18181c] border border-card-border/60 shadow-xs flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Hours Spent</p>
              <h4 className="text-lg font-heading font-black text-slate-800 dark:text-white leading-none mt-1">{studyHours}h</h4>
            </div>
          </div>

        </div>

        {/* My Enrolled Active Courses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-heading font-black text-slate-800 dark:text-white">My Active Courses</h3>
            <button
              onClick={() => router.push("/academy/dashboard/courses")}
              className="text-xs font-bold text-[#0055ff] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Catalog</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zero Enrolled Course Empty State */}
          {coursesEnrolled === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#18181c] border border-card-border/60 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-card-border flex items-center justify-center mx-auto">
                <BookOpen className="w-5 h-5 text-slate-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-heading font-bold text-slate-800 dark:text-white">No courses enrolled yet</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">You haven't enrolled in any course yet.</p>
              </div>
              <button
                onClick={() => router.push("/academy/dashboard/courses")}
                className="px-6 py-2.5 bg-[#0055ff] hover:bg-[#0044dd] text-white text-xs font-bold rounded-xl shadow-xs transition-all duration-200 cursor-pointer"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            /* Courses List */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {enrolledCoursesList.map((course) => (
                <div
                  key={course.id}
                  className="group rounded-2xl border border-card-border/60 bg-white dark:bg-[#18181c] hover:border-slate-350 dark:hover:border-slate-700 transition-all duration-300 overflow-hidden flex flex-col h-full shadow-xs hover:shadow-md"
                >
                  <div className="relative w-full aspect-video bg-slate-100 dark:bg-slate-900 border-b border-card-border/40 overflow-hidden flex items-center justify-center">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 360px"
                      className="object-cover transition-transform duration-300 group-hover:scale-103"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#0055ff] text-white uppercase tracking-wider">
                      {course.progress}% done
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-grow items-start text-left justify-between space-y-4">
                    <div className="space-y-1.5 w-full">
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                        {course.status}
                      </span>
                      <h4 className="text-sm font-heading font-black text-slate-800 dark:text-white leading-snug">
                        {course.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    <div className="w-full space-y-4">
                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                          <span>Progress</span>
                          <span>{course.lessonsCompleted}/{course.totalLessons} Lessons</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#0055ff] rounded-full transition-all duration-500"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => router.push("/academy/dashboard/courses")}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold rounded-xl bg-slate-50 hover:bg-[#0055ff] dark:bg-slate-900 dark:hover:bg-[#0055ff] text-slate-700 hover:text-white dark:text-slate-200 hover:shadow-xs border border-card-border/60 hover:border-[#0055ff] transition-all cursor-pointer"
                      >
                        <span>Continue Learning</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Classes & Recent Activity Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Live Classes */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#18181c] border border-card-border/60 text-left space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-card-border/40">
              <Video className="w-4 h-4 text-red-500 animate-pulse" />
              <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Upcoming Live Classes</h3>
            </div>
            <div className="space-y-3">
              {liveClasses.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-card-border/60 bg-slate-50/40 dark:bg-slate-900/30 flex items-center justify-between gap-3 hover:-translate-y-[1px] transition-all"
                >
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-tight">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">{item.instructor} • {item.date} at {item.time}</p>
                  </div>
                  <button
                    onClick={() => handleActionClick(`Join ${item.title}`)}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold text-[9px] uppercase tracking-wider cursor-pointer"
                  >
                    <span>Join</span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#18181c] border border-card-border/60 text-left space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-card-border/40">
              <Zap className="w-4 h-4 text-[#0055ff]" />
              <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Announcements</h3>
            </div>
            <div className="space-y-3">
              {announcements.length === 0 ? (
                <p className="text-[10px] text-slate-400 font-semibold py-3 text-center">
                  No announcements at this time.
                </p>
              ) : (
                announcements.map((item) => (
                  <div
                    key={item.id}
                    className="space-y-1 p-3.5 rounded-xl border border-card-border/40 hover:bg-slate-50/40 dark:hover:bg-slate-900/20 transition-all text-left"
                  >
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                        item.tag === 'event' 
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400' 
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                      }`}>
                        {item.tag}
                      </span>
                      <span className="text-[9px] text-slate-400 font-semibold">{item.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-tight">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Right widget panel */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Dynamic Profile Card Summary */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#18181c] border border-card-border/60 text-center space-y-4 shadow-xs">
          
          {/* Avatar Photo Frame */}
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-blue-500/10 text-[#0055ff] border border-card-border/60 flex items-center justify-center mx-auto text-xl font-heading font-black">
            {student?.avatarUrl ? (
              <Image src={student.avatarUrl} alt="Avatar" fill className="object-cover" />
            ) : (
              getInitials(student?.firstName, student?.lastName)
            )}
          </div>

          <div className="space-y-1">
            <h4 className="text-base font-heading font-black text-slate-800 dark:text-white leading-tight">
              {student ? `${student.firstName} ${student.lastName}` : "Guest Student"}
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">
              {student?.email}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-card-border/40 text-left">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Member Since</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{student?.memberSince}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Country</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{student?.country}</span>
            </div>
          </div>

          <button
            onClick={() => router.push("/academy/dashboard/profile")}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl border border-card-border bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
          >
            <User className="w-4 h-4 text-slate-400" />
            <span>Manage Profile</span>
          </button>
        </div>

        {/* Overall dynamic progress circular circle */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#18181c] border border-card-border/60 text-left space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-1.5 border-b border-card-border/40">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Overall Progress</h3>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative flex items-center justify-center w-16 h-16 shrink-0 select-none">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="6" fill="transparent" />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  className="stroke-[#0055ff]"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={175.9}
                  strokeDashoffset={175.9 - (175.9 * averageProgress) / 100}
                />
              </svg>
              <span className="absolute text-xs font-heading font-black text-slate-800 dark:text-white">{averageProgress}%</span>
            </div>
            
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
                {averageProgress > 0 ? "Excellent progress!" : "Start your path"}
              </h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">
                {averageProgress > 0 
                  ? "You are on track to completing your enrolled certifications. Keep up the dedication."
                  : "Enroll in programs from the catalog to build practical digital skills and earn certificates."}
              </p>
            </div>
          </div>
        </div>

        {/* Recent dynamic activity list */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#18181c] border border-card-border/60 text-left space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-1.5 border-b border-card-border/40">
            <FileText className="w-4 h-4 text-[#0055ff]" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Recent Activity</h3>
          </div>
          
          <div className="space-y-3.5 max-h-48 overflow-y-auto scrollbar-thin">
            {activities.length === 0 ? (
              <p className="text-[10px] text-slate-400 font-medium py-2">No activities recorded yet.</p>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="flex items-start gap-2.5 text-left">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0055ff] mt-1.5 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold leading-tight">
                      {act.description}
                    </p>
                    <span className="text-[9px] text-slate-400 font-semibold block">{act.date}</span>
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
