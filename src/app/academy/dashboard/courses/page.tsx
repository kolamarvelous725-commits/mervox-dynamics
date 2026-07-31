"use client";

import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { AcademyDB } from "@/utils/academyDb";
import { Course, UserCourseProgress, QuizAttempt } from "@/types/academy";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/utils/supabaseClient";
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

interface ExtendedCourse extends Course {
  progressData?: UserCourseProgress;
  quizData?: QuizAttempt;
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

  const quizQuestions = AcademyDB.getQuizQuestions();

  const refreshData = async () => {
    if (!userId) return;
    try {
      const { data: progress } = await supabase
        .from("progress")
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

      if (progress) {
        setStudentProgress(
          progress.map((p: any) => ({
            courseId: p.course_id,
            progress: p.progress_percent,
            lessonsCompleted: p.lessons_completed?.completed_lessons?.length || 0,
            status: p.status || "In Progress",
            completedLessons: p.lessons_completed?.completed_lessons || [],
            totalLessons: 20,
            studyMinutes: (p.lessons_completed?.completed_lessons?.length || 0) * 25,
          }))
        );
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

      if (courseData) {
        setCourses(courseData);
      }
    } catch (err) {
      console.error("Failed to load student courses database state:", err);
    }
  };

  useEffect(() => {
    refreshData();
  }, [userId]);

  const handleEnroll = async (courseId: string, courseTitle: string) => {
    const enrollmentPayload = {
      user_id: userId,
      course_id: courseId,
      status: "In Progress",
    };
    console.log("Enrollment payload:", enrollmentPayload);

    try {
      const { data: enrollRes, error: enrollError } = await supabase
        .from("enrollments")
        .insert(enrollmentPayload);

      if (enrollError) {
        console.error("Supabase enrollments table INSERT error:", enrollError);
        alert(`Failed to enroll: ${enrollError.message}`);
        return;
      }

      const progressPayload = {
        user_id: userId,
        course_id: courseId,
        progress_percent: 0,
        lessons_completed: {
          completed_lessons: [],
        },
      };
      console.log("Progress initialization payload:", progressPayload);

      const { error: progressError } = await supabase
        .from("progress")
        .insert(progressPayload);

      if (progressError) {
        console.error("Supabase progress table INSERT error:", progressError);
        alert(`Failed to initialize progress table row: ${progressError.message}`);
        return;
      }

      alert("Enrolled successfully in the course program!");
      refreshData();
    } catch (err) {
      console.error("Exception during course enrollment flow:", err);
      alert(`Enrollment operation exception: ${err}`);
    }
  };

  const handleLessonToggle = async (courseId: string, courseTitle: string, lessonIndex: number, lessonTitle: string) => {
    try {
      const { data: currentProg } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .single();

      if (currentProg) {
        const completed = currentProg.lessons_completed?.completed_lessons || [];
        let nextCompleted = [...completed];
        if (nextCompleted.includes(lessonTitle)) {
          nextCompleted = nextCompleted.filter((l) => l !== lessonTitle);
        } else {
          nextCompleted.push(lessonTitle);
        }

        const nextPercent = Math.round((nextCompleted.length / 20) * 100);
        await supabase
          .from("progress")
          .update({
            progress_percent: nextPercent,
            lessons_completed: {
              ...currentProg.lessons_completed,
              completed_lessons: nextCompleted,
            },
          })
          .eq("id", currentProg.id);

        refreshData();
      }
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

  // Merge templates with user database progress
  const coursesList: ExtendedCourse[] = courses.map((tpl) => {
    const progressData = studentProgress.find((p) => p.courseId === tpl.id);
    const quizData = studentQuizzes.find((q) => q.courseId === tpl.id);
    return {
      ...tpl,
      progress: progressData ? progressData.progress : 0,
      status: progressData ? progressData.status : "Not Started",
      lessonsCompleted: progressData ? progressData.lessonsCompleted : 0,
      progressData,
      quizData,
    };
  });

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
                        <span>Each completed lesson adds **25 minutes** to study logs and **5%** to progress.</span>
                      </div>
                                           {/* List of lessons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
                        {((course.lessons && course.lessons.length > 0)
                          ? course.lessons
                          : Array.from({ length: 20 }).map((_, idx) => `Lesson ${idx + 1}: Advanced Concepts & Overview Part ${idx + 1}`)
                        ).map((title, idx) => {
                          const lessonIndex = idx + 1;
                          const lessonTitle = title;
                          const isDone = course.progressData?.completedLessons.includes(lessonIndex) || false;
 
                          return (
                            <div
                              key={lessonIndex}
                              onClick={() => handleLessonToggle(course.id, course.title, lessonIndex, lessonTitle)}
                              className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all hover:-translate-y-[1px] select-none ${
                                isDone
                                  ? "bg-blue-50/40 dark:bg-blue-950/10 border-blue-100/50 dark:border-blue-900/10 text-slate-700 dark:text-slate-300"
                                  : "border-card-border bg-white dark:bg-[#18181c] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-800"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                <Play className={`w-3.5 h-3.5 shrink-0 ${isDone ? "text-[#0055ff]" : "text-slate-400"}`} />
                                <span className={`text-xs truncate ${isDone ? "font-bold" : "font-medium"}`}>
                                  {lessonTitle}
                                </span>
                              </div>
                              <input
                                type="checkbox"
                                checked={isDone}
                                readOnly
                                className="w-4 h-4 text-[#0055ff] border-card-border rounded-sm cursor-pointer shrink-0"
                              />
                            </div>
                          );
                        })}
                      </div>
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
