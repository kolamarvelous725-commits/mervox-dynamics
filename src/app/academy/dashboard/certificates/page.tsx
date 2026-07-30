"use client";

import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { AcademyDB } from "@/utils/academyDb";
import { useState, useEffect } from "react";
import { Award, Download, Lock, CheckCircle2, BookOpen, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface CertificateItem {
  id: string;
  courseId: string;
  courseTitle: string;
  isUnlocked: boolean;
  dateEarned?: string;
}

export default function CertificatesPage() {
  const { student } = useAcademyAuth();
  const userId = student?.id || "";
  const router = useRouter();

  const [coursesEnrolled, setCoursesEnrolled] = useState(0);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);

  const certTemplates = [
    { id: "c-forex", courseId: "forex-trading", courseTitle: "Forex Trading Masterclass" },
    { id: "c-ai", courseId: "ai-automation", courseTitle: "AI & Business Automation" },
    { id: "c-web", courseId: "web-dev", courseTitle: "Web & Software Development" },
    { id: "c-youtube", courseId: "youtube-monetization", courseTitle: "YouTube Algorithm Monetization" },
  ];

  useEffect(() => {
    if (userId) {
      const progressList = AcademyDB.getProgress(userId);
      const earnedIds = AcademyDB.getCertificates(userId);
      const quizzesList = AcademyDB.getQuizzes(userId);
      setCoursesEnrolled(progressList.length);

      // Merge templates with dynamic certificate unlock states
      const merged = certTemplates
        .filter((tpl) => progressList.some((p) => p.courseId === tpl.courseId))
        .map((tpl) => {
          const unlocked = earnedIds.includes(tpl.courseId);
          const quizAttempt = quizzesList.find((q) => q.courseId === tpl.courseId);
          return {
            id: tpl.id,
            courseId: tpl.courseId,
            courseTitle: tpl.courseTitle,
            isUnlocked: unlocked,
            dateEarned: quizAttempt?.date || "July 2026",
          };
        });

      setCertificates(merged);
    }
  }, [userId]);

  const handleDownload = (courseTitle: string) => {
    alert(`Certificate Unlocked!\nStudent: ${student?.firstName} ${student?.lastName}\nCourse: ${courseTitle}\n\nThis would generate a downloadable PDF in production.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Credentials Portal</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">My Certificates</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2 md:mt-0 leading-relaxed font-semibold">
          Access and download your verified course credentials after completing lessons and passing quizzes.
        </p>
      </div>

      {coursesEnrolled === 0 ? (
        /* Empty State */
        <div className="p-8 text-center bg-white dark:bg-[#18181c] border border-card-border/60 rounded-3xl space-y-4 max-w-xl mx-auto my-12">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-card-border flex items-center justify-center mx-auto">
            <Award className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-heading font-bold text-slate-800 dark:text-white">No Enrolled Courses</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Enroll in a course to start your path toward earning certifications.
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
        /* Catalog Certificates List */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
          {certificates.map((cert) => {
            return (
              <div
                key={cert.id}
                className={`p-6 rounded-3xl border bg-white dark:bg-[#18181c] flex flex-col justify-between min-h-[220px] transition-all relative overflow-hidden shadow-xs ${
                  cert.isUnlocked
                    ? "border-emerald-100 dark:border-emerald-900/30 hover:shadow-md"
                    : "border-card-border/40 opacity-75"
                }`}
              >
                {/* Background glow for unlocked certificates */}
                {cert.isUnlocked && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                      Mervox Academy
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      cert.isUnlocked 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                        : 'bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-500'
                    }`}>
                      {cert.isUnlocked ? "Issued" : "Locked"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-heading font-black text-slate-800 dark:text-white leading-tight">
                      Certificate of Completion
                    </h4>
                    <p className="text-xs text-slate-550 dark:text-slate-400 font-semibold">
                      Course: {cert.courseTitle}
                    </p>
                  </div>
                </div>

                <div className="border-t border-card-border/40 pt-4 flex items-center justify-between gap-4 mt-4">
                  {cert.isUnlocked ? (
                    <>
                      <div className="space-y-0.5 text-left">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Date Earned</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{cert.dateEarned}</span>
                      </div>
                      
                      <button
                        onClick={() => handleDownload(cert.courseTitle)}
                        className="px-4 py-2.5 flex items-center gap-1.5 text-[11px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all cursor-pointer shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-[10px] text-slate-450 dark:text-slate-500 font-bold leading-normal text-left">
                        <Lock className="w-4 h-4 text-slate-400" />
                        <span>Requires 100% course progress & passed quiz</span>
                      </div>

                      <button
                        onClick={() => router.push("/academy/dashboard/courses")}
                        className="px-4 py-2.5 text-[11px] font-bold text-slate-400 border border-card-border bg-slate-50/50 dark:bg-slate-900/50 rounded-xl cursor-not-allowed select-none"
                        disabled
                      >
                        Download
                      </button>
                    </>
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
