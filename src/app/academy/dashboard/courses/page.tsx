"use client";

import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { AcademyDB } from "@/utils/academyDb";
import { Course, UserCourseProgress, QuizAttempt } from "@/types/academy";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { supabase, isSupabaseConfigured } from "@/utils/supabaseClient";
import {
  BookOpen,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  Award,
  Clock,
  Play,
  CheckCircle,
  HelpCircle,
  Download,
  AlertCircle
} from "lucide-react";

interface ExtendedCourse extends Omit<Course, "lessons"> {
  progressData?: UserCourseProgress;
  quizData?: QuizAttempt;
  video_url?: string;
  pdf_url?: string;
  lessons?: any[];
}

export default function CoursesPage() {
  const { student } = useAcademyAuth();
  const userId = student?.id || "";

  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [studentProgress, setStudentProgress] = useState<UserCourseProgress[]>([]);
  const [studentQuizzes, setStudentQuizzes] = useState<QuizAttempt[]>([]);
  const [studentCertificates, setStudentCertificates] = useState<string[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);

  const quizQuestions = AcademyDB.getQuizQuestions();

  const refreshData = async () => {
    if (!userId) return;
    try {
      if (!isSupabaseConfigured) {
        const list = AcademyDB.getCourses();
        setCourses(list);
        
        const defaultLessons: any[] = [];
        list.forEach((c) => {
          const key = `mervox_academy_lessons_${c.id}`;
          const stored = localStorage.getItem(key);
          if (stored) {
            defaultLessons.push(...JSON.parse(stored));
          } else {
            const courseLessons = c.lessons?.map((lesTitle: string, idx: number) => ({
              id: `les-${c.id}-${idx}`,
              course_id: c.id,
              title: lesTitle,
              description: "Sandbox Course Lesson. Master high-yield digital skills step-by-step.",
              video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              pdf_url: "",
              duration: "15:00",
              sort_order: idx + 1,
            })) || [];
            defaultLessons.push(...courseLessons);
          }
        });
        setLessons(defaultLessons);
        
        const quizzes = AcademyDB.getQuizzes(userId);
        setStudentQuizzes(quizzes);
        
        const certs = AcademyDB.getCertificates(userId);
        setStudentCertificates(certs);
        
        const progress = AcademyDB.getProgress(userId);
        setStudentProgress(progress);
        return;
      }

      const { data: enrollmentsData } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", userId);

      const { data: quizzes } = await supabase
        .from("quizzes")
        .select("*")
        .eq("user_id", userId);

      const { data: certificates } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", userId);

      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .eq("published", true);

      const { data: lessonsData } = await supabase
        .from("course_lessons")
        .select("*")
        .order("sort_order", { ascending: true });

      const { data: progressData } = await supabase
        .from("lesson_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("completed", true);

      const rawLessons = lessonsData && lessonsData.length > 0 ? lessonsData : [
        ...AcademyDB.getCourses().reduce((acc: any[], course: any) => {
          const list = course.lessons?.map((lesTitle: string, idx: number) => ({
            id: `les-${course.id}-${idx}`,
            course_id: course.id,
            title: lesTitle,
            description: "Sandbox Course Lesson. Master high-yield digital skills step-by-step.",
            video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            pdf_url: "",
            duration: "15:00",
            sort_order: idx + 1,
          })) || [];
          return [...acc, ...list];
        }, [])
      ];

      const mappedLessons = rawLessons.map((l: any) => {
        let vUrl = l.video_url || "https://www.youtube.com/embed/dQw4w9WgXcQ";
        let pUrl = l.pdf_url;
        if (!pUrl) {
          const handbookMap: Record<string, string> = {
            "forex-trading": "/downloads/forex_trading_masterclass.pdf",
            "ai-automation": "/downloads/ai_automation_funnels.pdf",
            "web-dev": "/downloads/software_development_blueprint.pdf",
            "youtube-monetization": "/downloads/youtube_algorithm_secrets.pdf",
          };
          pUrl = handbookMap[l.course_id] || "/downloads/forex_trading_masterclass.pdf";
        }
        return {
          ...l,
          video_url: vUrl,
          pdf_url: pUrl,
          description: l.description || "Sandbox Course Lesson. Master high-yield digital skills step-by-step.",
          duration: l.duration || "15:00",
        };
      });

      setLessons(mappedLessons);

      if (courseData) {
        setCourses(courseData);
      }

      if (quizzes) {
        setStudentQuizzes(
          quizzes.map((q: any) => ({
            id: q.id,
            courseId: q.course_id,
            score: q.score,
            passed: q.passed,
            attempts: 1,
            date: "Evaluated",
          }))
        );
      }

      if (certificates) {
        setStudentCertificates(certificates.map((c: any) => c.course_id));
      }

      const coursesArr = courseData || [];
      const enrollsArr = enrollmentsData || [];
      const lessonsArr = mappedLessons;
      const progressArr = progressData || [];

      const enrolledCourseIds = new Set(enrollsArr.map((e: any) => e.course_id));
      const completedLessonIds = new Set(progressArr.map((p: any) => p.lesson_id));

      const computedProgress: UserCourseProgress[] = coursesArr.map((c: any) => {
        const cLessons = lessonsArr.filter((l: any) => l.course_id === c.id);
        const total = cLessons.length;
        const isEnrolled = enrolledCourseIds.has(c.id);
        const completedCount = isEnrolled ? cLessons.filter((l: any) => completedLessonIds.has(l.id)).length : 0;
        const progressPercent = isEnrolled && total > 0 ? Math.round((completedCount / total) * 100) : 0;
        
        let status: 'Not Started' | 'In Progress' | 'Completed' = 'Not Started';
        if (isEnrolled) {
          status = progressPercent === 100 ? 'Completed' : 'In Progress';
        }

        return {
          courseId: c.id,
          progress: progressPercent,
          status,
          lessonsCompleted: completedCount,
          totalLessons: total,
          completedLessons: isEnrolled ? (cLessons.filter((l: any) => completedLessonIds.has(l.id)).map((l: any) => l.id) as any) : [],
          studyMinutes: isEnrolled ? completedCount * 25 : 0,
        };
      });

      setStudentProgress(computedProgress);
    } catch (err) {
      console.error("Failed to load student courses database state:", err);
    }
  };

  useEffect(() => {
    refreshData();

    // Read query params for payment notifications
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("payment") === "success") {
        alert("Thank you! Your payment was successful and you have been enrolled in the course program.");
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: cleanUrl }, "", cleanUrl);
      } else if (params.get("payment") === "failed") {
        const reason = params.get("reason") || "payment abandoned";
        alert(`Payment checkout failed or was cancelled. Reason: ${reason.replace(/_/g, " ")}`);
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: cleanUrl }, "", cleanUrl);
      }
    }

    if (isSupabaseConfigured && userId) {
      const channel = supabase
        .channel("student_courses_sync_" + userId)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "enrollments", filter: `user_id=eq.${userId}` },
          () => {
            refreshData();
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "lesson_progress", filter: `user_id=eq.${userId}` },
          () => {
            refreshData();
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "courses" },
          () => {
            refreshData();
          }
        )
        .subscribe();

      const handleStorageUpdate = (e: StorageEvent) => {
        if (e.key?.includes("mervox_academy")) {
          refreshData();
        }
      };
      window.addEventListener("storage", handleStorageUpdate);

      return () => {
        supabase.removeChannel(channel);
        window.removeEventListener("storage", handleStorageUpdate);
      };
    }
  }, [userId]);

  const handleEnroll = async (courseId: string, courseTitle: string) => {
    try {
      if (!userId) {
        alert("Authentication error: Please log in again to enroll.");
        return;
      }
      if (!isSupabaseConfigured) {
        AcademyDB.enroll(userId, courseId, courseTitle);
        refreshData();
        alert("Enrolled successfully in the course program!");
        return;
      }

      // Read existing enrollment first
      const { data: existingEnroll } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .maybeSingle();

      if (existingEnroll) {
        alert("You are already enrolled in this course program!");
        refreshData();
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        alert("Authentication session expired. Please log in again.");
        return;
      }

      // Initialize Paystack payment securely from the server
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to initialize payment.");
      }

      const { authorizationUrl } = await response.json();
      if (authorizationUrl) {
        window.location.href = authorizationUrl;
      } else {
        throw new Error("No checkout URL returned from payment server.");
      }
    } catch (err: any) {
      console.error("Exception during course enrollment flow:", err);
      alert(`Checkout failed: ${err.message || err}`);
    }
  };

  const handleLessonToggle = async (courseId: string, lessonId: string, isCurrentlyDone: boolean) => {
    if (!userId) return;

    // Optimistic UI Update: update studentProgress state instantly for snappy UI feedback!
    setStudentProgress((prevProgress) => {
      return prevProgress.map((p) => {
        if (p.courseId === courseId) {
          const completedList = (p.completedLessons as any[]) || [];
          const newCompleted = isCurrentlyDone
            ? completedList.filter((id) => id !== lessonId)
            : [...completedList, lessonId];
          const total = p.totalLessons;
          const completedCount = newCompleted.length;
          const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
          return {
            ...p,
            completedLessons: newCompleted as any,
            lessonsCompleted: completedCount,
            progress: progressPercent,
            studyMinutes: completedCount * 25,
            status: progressPercent === 100 ? "Completed" : progressPercent > 0 ? "In Progress" : "Not Started"
          } as any;
        }
        return p;
      });
    });

    try {
      if (!isSupabaseConfigured) {
        const courseLessons = lessons.filter((l: any) => l.course_id === courseId);
        const idx = courseLessons.findIndex((l: any) => l.id === lessonId);
        const lessonTitle = courseLessons[idx]?.title || "Course Lesson";
        const course = courses.find((c: any) => c.id === courseId);
        const courseTitle = course?.title || "Academy Course";
        
        AcademyDB.completeLesson(userId, courseId, courseTitle, idx, lessonTitle);
        return;
      }

      if (isCurrentlyDone) {
        const { error } = await supabase
          .from("lesson_progress")
          .delete()
          .eq("user_id", userId)
          .eq("lesson_id", lessonId);
        
        if (error) console.error("Error toggling progress:", error);
      } else {
        const { error } = await supabase
          .from("lesson_progress")
          .upsert({
            user_id: userId,
            lesson_id: lessonId,
            completed: true,
            completed_at: new Date().toISOString()
          }, {
            onConflict: "user_id,lesson_id"
          });

        if (error) console.error("Error toggling progress:", error);
      }

      // Sync state with database in background
      refreshData();
    } catch (err) {
      console.error("Failed to toggle lesson:", err);
    }
  };

  const handleQuizSubmit = async (courseId: string, courseTitle: string) => {
    const questions = quizQuestions[courseId] || [];
    let correctCount = 0;
    
    questions.forEach((q, idx) => {
      const selected = quizAnswers[idx];
      const correctText = q.options[q.answer];
      if (selected === correctText) {
        correctCount++;
      }
    });

    const passed = questions.length > 0 && correctCount === questions.length;
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    try {
      if (!isSupabaseConfigured) {
        AcademyDB.saveQuizAttempt(userId, courseId, courseTitle, correctCount, passed);
        setQuizResult({ score: correctCount, passed });
        refreshData();
        return;
      }

      await supabase.from("quizzes").upsert({
        user_id: userId,
        course_id: courseId,
        score: correctCount,
        passed,
        date: dateStr,
      });

      if (passed) {
        const certId = "cert-" + Math.random().toString(36).substring(2, 9);
        await supabase.from("certificates").insert({
          id: certId,
          user_id: userId,
          course_id: courseId,
          course_title: courseTitle,
          issue_date: dateStr,
        });
      }

      setQuizResult({ score: correctCount, passed });
      refreshData();
    } catch (err) {
      console.error("Failed to submit quiz:", err);
    }
  };

  const startQuiz = (courseId: string) => {
    setActiveQuizId(courseId);
    setQuizAnswers({});
    setQuizResult(null);
  };

  const downloadCertMock = (courseTitle: string) => {
    alert(`Certificate Unlocked!\nStudent: ${student?.firstName} ${student?.lastName}\nCourse: ${courseTitle}\n\nThis would generate a downloadable PDF in production.`);
  };

  // Merge templates with user database progress using useMemo to optimize re-render performance
  const coursesList: ExtendedCourse[] = useMemo(() => {
    return courses.map((tpl) => {
      const progressData = studentProgress.find((p) => p.courseId === tpl.id);
      const quizData = studentQuizzes.find((q) => q.courseId === tpl.id);
      
      // Filter lessons belonging to this course from lessons state
      const courseLessons = lessons.filter((l: any) => l.course_id === tpl.id);

      return {
        ...tpl,
        progress: progressData ? progressData.progress : 0,
        status: progressData ? progressData.status : "Not Started",
        lessonsCompleted: progressData ? progressData.lessonsCompleted : 0,
        totalLessons: courseLessons.length,
        progressData,
        quizData,
        video_url: tpl.video_url || (courseLessons.length > 0 ? courseLessons[0].video_url : undefined),
        pdf_url: tpl.pdf_url || (courseLessons.length > 0 ? courseLessons[0].pdf_url : undefined),
        lessons: courseLessons,
      };
    });
  }, [courses, studentProgress, studentQuizzes, studentCertificates, lessons]);

  // Automatically resume from the first unfinished lesson on load
  useEffect(() => {
    if (coursesList.length > 0 && !activeCourseId) {
      const courseToResume = coursesList.find((c) => {
        const hasLessons = c.lessons && c.lessons.length > 0;
        const incompleteCount = (c.lessons as any[])?.filter((l: any) => !c.progressData?.completedLessons.includes(l.id)).length || 0;
        return c.status === "In Progress" && hasLessons && incompleteCount > 0;
      });

      if (courseToResume) {
        setActiveCourseId(courseToResume.id);
      }
    }
  }, [coursesList, activeCourseId]);

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Course Catalog</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Explore Programs & Track Progress</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2 md:mt-0 leading-relaxed font-semibold">
          Enroll in new programs, view your checklists, complete lessons, and submit your qualification quizzes.
        </p>
      </div>

      {/* Courses Grid */}
      <div className="space-y-6">
        {coursesList.map((course) => {
          const isEnrolled = course.status !== "Not Started";
          const isExpanded = activeCourseId === course.id;
          const isQuizActive = activeQuizId === course.id;
          const hasPassedQuiz = course.quizData?.passed;
          const hasCertificate = studentCertificates.includes(course.id);

          return (
            <div
              key={course.id}
              className={`rounded-[24px] border bg-white dark:bg-[#18181c] transition-all duration-300 ${
                isExpanded ? "border-[#0055ff]/40 shadow-md" : "border-card-border/60 shadow-xs hover:border-slate-350 dark:hover:border-slate-700"
              }`}
            >
              
              {/* Top Summary Row */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-left">
                
                {/* Thumbnail Column */}
                <div className="md:col-span-3 relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-card-border/40 shrink-0">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 240px"
                    className="object-cover"
                  />
                </div>

                {/* Info and Progress Column */}
                <div className="md:col-span-6 space-y-3">
                  <div className="space-y-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      isEnrolled ? "bg-blue-100 text-[#0055ff] dark:bg-blue-950/30 dark:text-blue-400" : "bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-500"
                    }`}>
                      {course.status}
                    </span>
                    <h3 className="text-base font-heading font-black text-slate-800 dark:text-white leading-tight">
                      {course.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    {course.description}
                  </p>

                  {/* Progress Indicator */}
                  {isEnrolled && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                        <span>Progress ({course.progress}%)</span>
                        <span>{course.lessonsCompleted}/{course.totalLessons} Lessons</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0055ff] rounded-full transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions Button Column */}
                <div className="md:col-span-3 flex flex-col gap-2 w-full justify-center md:items-end">
                  {!isEnrolled ? (
                    <button
                      onClick={() => handleEnroll(course.id, course.title)}
                      className="px-6 py-3 w-full text-center text-xs font-bold text-white bg-[#0055ff] hover:bg-[#0044dd] rounded-xl shadow-xs hover:shadow-md cursor-pointer transition-all hover:-translate-y-[1px]"
                    >
                      Enroll Now
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setActiveCourseId(isExpanded ? null : course.id);
                          setActiveQuizId(null);
                        }}
                        className="px-5 py-3 w-full flex items-center justify-center gap-1 text-xs font-bold rounded-xl border border-card-border/60 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer transition-all"
                      >
                        <span>{isExpanded ? "Close Panel" : "Continue Learning"}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {hasCertificate ? (
                        <button
                          onClick={() => downloadCertMock(course.title)}
                          className="px-5 py-2.5 w-full flex items-center justify-center gap-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-xs cursor-pointer transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Get Certificate</span>
                        </button>
                      ) : (
                        course.progress === 100 && (
                          <button
                            onClick={() => startQuiz(course.id)}
                            className="px-5 py-2.5 w-full flex items-center justify-center gap-1.5 text-xs font-bold bg-[#0055ff] text-white rounded-xl shadow-xs cursor-pointer transition-all"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Unlock Certificate</span>
                          </button>
                        )
                      )}
                    </>
                  )}
                </div>

              </div>

              {/* Collapsible Panel for Lessons / Quizzes */}
              {isExpanded && (
                <div className="border-t border-card-border/40 p-6 bg-slate-50/30 dark:bg-slate-900/10 space-y-6">
                  
                  {/* Sub-navigation bar inside card */}
                  <div className="flex gap-4 border-b border-card-border/40 pb-3">
                    <button
                      onClick={() => setActiveQuizId(null)}
                      className={`text-xs font-bold pb-1 cursor-pointer transition-all border-b-2 ${
                        !isQuizActive ? "text-[#0055ff] border-[#0055ff]" : "text-slate-400 border-transparent hover:text-slate-600"
                      }`}
                    >
                      Lessons Tracker
                    </button>
                    <button
                      onClick={() => startQuiz(course.id)}
                      className={`text-xs font-bold pb-1 cursor-pointer transition-all border-b-2 ${
                        isQuizActive ? "text-[#0055ff] border-[#0055ff]" : "text-slate-400 border-transparent hover:text-slate-600"
                      }`}
                    >
                      Course Quiz {hasPassedQuiz && "✓"}
                    </button>
                  </div>

                  {/* Active Lessons Tracker view */}
                  {!isQuizActive ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 text-left">
                        <Clock className="w-4 h-4" />
                        <span>Toggle lesson checkboxes to mark completeness. Each completed lesson adds **25 minutes** to study logs.</span>
                      </div>

                      {/* List of lessons */}
                      {(!course.lessons || course.lessons.length === 0) ? (
                        <p className="text-xs text-slate-400 font-semibold italic pt-2 text-left">No lessons available.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-left">
                          {course.lessons.map((lesson: any, idx: number) => {
                            const isDone = course.progressData?.completedLessons.includes(lesson.id) || false;
                            
                            // Highlight the first incomplete lesson to allow automatic resume
                            const firstIncomplete = (course.lessons || []).find((l: any) => !course.progressData?.completedLessons.includes(l.id));
                            const isResumeHighlight = firstIncomplete?.id === lesson.id;

                            return (
                              <div
                                key={lesson.id}
                                className={`p-4 rounded-xl border flex flex-col gap-2.5 transition-all select-none ${
                                  isDone
                                    ? "bg-blue-50/45 dark:bg-blue-950/10 border-blue-150/50 dark:border-blue-900/10 text-slate-700 dark:text-slate-350"
                                    : isResumeHighlight
                                      ? "border-[#0055ff] bg-blue-50/10 dark:bg-blue-950/5 shadow-xs ring-1 ring-[#0055ff]/10 text-slate-800 dark:text-slate-200"
                                      : "border-card-border bg-white dark:bg-[#18181c] text-slate-600 dark:text-slate-455 hover:border-slate-300 dark:hover:border-slate-800"
                                }`}
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2 truncate">
                                    <Play className={`w-3.5 h-3.5 shrink-0 ${isDone ? "text-[#0055ff]" : "text-slate-400"}`} />
                                    <span className="text-xs truncate font-bold">
                                      {idx + 1}. {lesson.title}
                                    </span>
                                    {isResumeHighlight && !isDone && (
                                      <span className="px-1.5 py-0.5 rounded bg-blue-100 text-[#0055ff] dark:bg-blue-950 dark:text-blue-400 text-[8px] font-black uppercase tracking-wider shrink-0">
                                        Resume
                                      </span>
                                    )}
                                  </div>
                                  <input
                                    type="checkbox"
                                    checked={isDone}
                                    onChange={() => handleLessonToggle(course.id, lesson.id, isDone)}
                                    className="w-4 h-4 text-[#0055ff] border-card-border rounded-sm cursor-pointer shrink-0"
                                  />
                                </div>

                                {lesson.description && (
                                  <p className="text-[10px] text-slate-450 dark:text-slate-500 leading-relaxed text-left pl-6 font-semibold">
                                    {lesson.description}
                                  </p>
                                )}

                                {/* Lesson Video & PDF attachments */}
                                {(lesson.video_url || lesson.pdf_url) && (
                                  <div className="flex items-center gap-2 pl-6 pt-1">
                                    {lesson.video_url ? (
                                      <a
                                        href={lesson.video_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#0055ff] hover:bg-[#0044dd] text-white text-[9px] font-bold rounded-lg transition-all"
                                      >
                                        <Play className="w-2.5 h-2.5" />
                                        <span>Watch Video</span>
                                      </a>
                                    ) : (
                                      <span className="text-[9px] text-slate-400 font-semibold italic">No video available.</span>
                                    )}

                                    {lesson.pdf_url ? (
                                      <a
                                        href={lesson.pdf_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[9px] font-bold rounded-lg border border-card-border/40 transition-all"
                                      >
                                        <Download className="w-2.5 h-2.5" />
                                        <span>Download PDF</span>
                                      </a>
                                    ) : (
                                      <span className="text-[9px] text-slate-400 font-semibold italic">No PDF available.</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Active Quiz view */
                    <div className="max-w-xl mx-auto space-y-6 text-left">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Qualification Quiz</h4>
                          {course.quizData && (
                            <span className="text-[10px] font-semibold text-slate-400">
                              Highest score: {course.quizData.score}/3 ({course.quizData.attempts} attempts)
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                          You must answer all 3 questions correctly to pass this quiz and unlock the program certificate.
                        </p>
                      </div>

                      {/* Display Quiz Result banner */}
                      {quizResult && (
                        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                          quizResult.passed
                            ? "bg-emerald-50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/20 text-emerald-800 dark:text-emerald-400"
                            : "bg-red-50 dark:bg-red-950/10 border-red-100 dark:border-red-900/20 text-red-800 dark:text-red-400"
                        }`}>
                          {quizResult.passed ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold">{quizResult.passed ? "Quiz Passed! 🎉" : "Quiz Failed"}</h5>
                            <p className="text-[10px] leading-relaxed font-medium">
                              {quizResult.passed
                                ? `Excellent score of ${quizResult.score}/3. Your certificate is unlocked and available on the dashboard.`
                                : `Score: ${quizResult.score}/3. You need 3/3 correct answers. Review course materials and try again.`}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Quiz Form Questions */}
                      <div className="space-y-5">
                        {((quizQuestions[course.id] as any[]) || []).map((qObj: any, qIdx: number) => (
                          <div key={qIdx} className="space-y-2 p-4 rounded-xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs">
                            <p className="text-xs font-bold text-slate-800 dark:text-white leading-relaxed">
                              {qIdx + 1}. {qObj.q}
                            </p>
                            <div className="space-y-2 pl-1">
                              {(qObj.options as string[]).map((opt: string, oIdx: number) => (
                                <label
                                  key={oIdx}
                                  className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-350 cursor-pointer select-none font-semibold"
                                >
                                  <input
                                    type="radio"
                                    name={`question-${qIdx}`}
                                    value={opt}
                                    checked={quizAnswers[qIdx] === opt}
                                    onChange={(e) => setQuizAnswers((prev) => ({ ...prev, [qIdx]: e.target.value }))}
                                    disabled={hasPassedQuiz}
                                    className="w-4 h-4 text-[#0055ff] border-card-border cursor-pointer focus:ring-0"
                                  />
                                  <span>{opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Submit button */}
                      {!hasPassedQuiz ? (
                        <button
                          type="button"
                          onClick={() => handleQuizSubmit(course.id, course.title)}
                          className="w-full flex items-center justify-center py-3 text-xs font-bold bg-[#0055ff] hover:bg-[#0044dd] text-white rounded-xl transition-all cursor-pointer shadow-xs"
                        >
                          Submit Answers
                        </button>
                      ) : (
                        <div className="p-3 text-center border border-emerald-100 dark:border-emerald-900/30 rounded-xl bg-emerald-50/20 text-xs font-semibold text-emerald-600">
                          ✓ Quiz Passed. Check Dashboard or My Certificates to download your document.
                        </div>
                      )}

                    </div>
                  )}

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
