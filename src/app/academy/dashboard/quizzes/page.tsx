"use client";

import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { AcademyDB } from "@/utils/academyDb";
import { QuizAttempt, UserCourseProgress } from "@/types/academy";
import { useState, useEffect } from "react";
import { CheckSquare, Lock, CheckCircle, ChevronRight, HelpCircle, AlertCircle, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

interface ExtendedQuiz {
  id: string;
  title: string;
  courseId: string;
  progress: number;
  attempt?: QuizAttempt;
}

export default function QuizzesPage() {
  const { student } = useAcademyAuth();
  const userId = student?.id || "";
  const router = useRouter();

  const [coursesEnrolled, setCoursesEnrolled] = useState(0);
  const [quizzesList, setQuizzesList] = useState<ExtendedQuiz[]>([]);

  const quizTemplates = [
    { id: "q-forex", courseId: "forex-trading", title: "Forex Trading Qualification Quiz" },
    { id: "q-ai", courseId: "ai-automation", title: "AI & Business Automation Qualification Quiz" },
    { id: "q-web", courseId: "web-dev", title: "Web & Software Development Qualification Quiz" },
    { id: "q-youtube", courseId: "youtube-monetization", title: "YouTube Algorithm Qualification Quiz" },
  ];

  useEffect(() => {
    if (userId) {
      const progressList = AcademyDB.getProgress(userId);
      const quizAttempts = AcademyDB.getQuizzes(userId);
      setCoursesEnrolled(progressList.length);

      // Merge templates with student progress and scores
      const merged = quizTemplates
        .filter((tpl) => progressList.some((p) => p.courseId === tpl.courseId))
        .map((tpl) => {
          const prog = progressList.find((p) => p.courseId === tpl.courseId);
          const attempt = quizAttempts.find((q) => q.courseId === tpl.courseId);
          return {
            id: tpl.id,
            title: tpl.title,
            courseId: tpl.courseId,
            progress: prog ? prog.progress : 0,
            attempt,
          };
        });

      setQuizzesList(merged);
    }
  }, [userId]);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Course Evaluation</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Qualification Quizzes</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2 md:mt-0 leading-relaxed font-semibold">
          Complete 100% of your course lessons to unlock qualification quizzes and earn certifications.
        </p>
      </div>

      {coursesEnrolled === 0 ? (
        /* Empty State */
        <div className="p-8 text-center bg-white dark:bg-[#18181c] border border-card-border/60 rounded-3xl space-y-4 max-w-xl mx-auto my-12">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-card-border flex items-center justify-center mx-auto">
            <CheckSquare className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-heading font-bold text-slate-800 dark:text-white">No Enrolled Courses</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              You must enroll in courses to unlock course qualification quizzes.
            </p>
          </div>
          <button
            onClick={() => router.push("/academy/dashboard/courses")}
            className="px-6 py-2.5 bg-[#0055ff] hover:bg-[#0044dd] text-white text-xs font-bold rounded-xl shadow-xs transition-all duration-200 cursor-pointer"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        /* Content catalog */
        <div className="max-w-4xl mx-auto space-y-4 text-left">
          {quizzesList.map((quiz) => {
            const isUnlocked = quiz.progress === 100;
            const isPassed = quiz.attempt?.passed || false;
            const score = quiz.attempt?.score || 0;
            const attemptsCount = quiz.attempt?.attempts || 0;

            return (
              <div
                key={quiz.id}
                className={`p-6 rounded-2xl border bg-white dark:bg-[#18181c] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs transition-all ${
                  isPassed
                    ? "border-emerald-100 dark:border-emerald-900/30"
                    : isUnlocked
                      ? "hover:border-slate-350 dark:hover:border-slate-800 border-card-border"
                      : "border-card-border/40 opacity-75"
                }`}
              >
                
                {/* Quiz Info */}
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">
                      Evaluation Checkpoint
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      isPassed 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                        : isUnlocked 
                          ? 'bg-blue-100 text-[#0055ff] dark:bg-blue-950/20 dark:text-blue-400 animate-pulse' 
                          : 'bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-500'
                    }`}>
                      {isPassed ? "Passed" : isUnlocked ? "Unlocked" : "Locked"}
                    </span>
                  </div>

                  <h4 className="text-sm font-heading font-black text-slate-800 dark:text-white leading-snug">
                    {quiz.title}
                  </h4>

                  {!isUnlocked ? (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-450 dark:text-slate-500 font-semibold leading-none">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked — Complete all 20 lessons to unlock ({quiz.progress}% done)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold leading-none">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>3 Multiple Choice Questions • Score 3/3 to pass</span>
                    </div>
                  )}
                </div>

                {/* Score or Action */}
                <div className="flex sm:flex-col items-stretch justify-center gap-2 shrink-0 select-none">
                  {isPassed ? (
                    <div className="text-right">
                      <span className="text-xl font-heading font-black text-emerald-600 flex items-center justify-end gap-1 leading-none">
                        <CheckCircle className="w-5 h-5" />
                        {score}/3
                      </span>
                      <p className="text-[9px] text-slate-400 font-semibold leading-none mt-1">{attemptsCount} attempts</p>
                    </div>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => router.push("/academy/dashboard/courses")}
                      className="px-5 py-2.5 flex items-center justify-center gap-1 text-xs font-bold text-white bg-[#0055ff] hover:bg-[#0044dd] rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      <span>Take Quiz</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="px-5 py-2.5 rounded-xl border border-card-border/40 bg-slate-50 dark:bg-slate-900/40 text-xs font-bold text-slate-400 flex items-center gap-1.5">
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>Locked</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
