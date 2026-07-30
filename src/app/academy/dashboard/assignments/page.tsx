"use client";

import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { AcademyDB } from "@/utils/academyDb";
import { useState, useEffect } from "react";
import { FileText, Calendar, Upload, CheckCircle2, ChevronRight, BookOpen, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Assignment {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  dueDate: string;
  status: "Pending" | "Submitted" | "Graded";
  grade?: string;
  feedback?: string;
}

export default function AssignmentsPage() {
  const { student } = useAcademyAuth();
  const userId = student?.id || "";
  const router = useRouter();

  const [coursesEnrolled, setCoursesEnrolled] = useState(0);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  // Simulated assignments template list
  const templates: Omit<Assignment, "status">[] = [
    {
      id: "asg-forex",
      courseId: "forex-trading",
      courseTitle: "Forex Trading Masterclass",
      title: "Support & Resistance Area Marking Practice",
      dueDate: "August 10, 2026",
    },
    {
      id: "asg-ai",
      courseId: "ai-automation",
      courseTitle: "AI & Business Automation",
      title: "ChatGPT Lead-Gen Workflow Make.com Setup Blueprint",
      dueDate: "August 15, 2026",
    },
    {
      id: "asg-web",
      courseId: "web-dev",
      courseTitle: "Web & Software Development",
      title: "React Modular Dashboard Layout Build",
      dueDate: "August 20, 2026",
    },
  ];

  useEffect(() => {
    if (userId) {
      const progress = AcademyDB.getProgress(userId);
      setCoursesEnrolled(progress.length);

      // Load or initialize assignments list
      const savedKey = `mervox_academy_assignments_${userId}`;
      const savedData = localStorage.getItem(savedKey);
      if (savedData) {
        setAssignments(JSON.parse(savedData));
      } else {
        // Filter templates by enrolled courseIds
        const activeIds = progress.map((p) => p.courseId);
        const filtered = templates
          .filter((t) => activeIds.includes(t.courseId))
          .map((t) => ({ ...t, status: "Pending" as const }));
        
        localStorage.setItem(savedKey, JSON.stringify(filtered));
        setAssignments(filtered);
      }
    }
  }, [userId]);

  const handleUpload = (id: string, title: string, courseTitle: string) => {
    // Simulated upload file picker
    const confirmUpload = confirm(`Simulate file checkpoint upload for:\n"${title}"?\n\nClick OK to confirm submission.`);
    if (confirmUpload) {
      const savedKey = `mervox_academy_assignments_${userId}`;
      const updated = assignments.map((asg) => {
        if (asg.id === id) {
          return { ...asg, status: "Submitted" as const };
        }
        return asg;
      });

      localStorage.setItem(savedKey, JSON.stringify(updated));
      setAssignments(updated);

      // Log activity
      AcademyDB.logActivity(userId, "lesson", `Submitted Assignment: ${title}`);
      // Notify
      AcademyDB.addNotification(userId, `Assignment successfully submitted for review: ${courseTitle}.`);
      alert("Submission successful! Mentor feedback will render here upon evaluation.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Course Deliverables</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Assignments Checkpoints</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2 md:mt-0 leading-relaxed font-semibold">
          Review program checklists, upload deliverables, and track evaluation scores from mentors.
        </p>
      </div>

      {coursesEnrolled === 0 ? (
        /* Empty State */
        <div className="p-8 text-center bg-white dark:bg-[#18181c] border border-card-border/60 rounded-3xl space-y-4 max-w-xl mx-auto my-12">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-card-border flex items-center justify-center mx-auto">
            <FileText className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-heading font-bold text-slate-800 dark:text-white">No Enrolled Courses</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              You must enroll in courses to view pending program assignments.
            </p>
          </div>
          <button
            onClick={() => router.push("/academy/dashboard/courses")}
            className="px-6 py-2.5 bg-[#0055ff] hover:bg-[#0044dd] text-white text-xs font-bold rounded-xl shadow-xs transition-all duration-200 cursor-pointer"
          >
            Browse Courses
          </button>
        </div>
      ) : assignments.length === 0 ? (
        /* No assignments yet state */
        <div className="p-8 text-center bg-white dark:bg-[#18181c] border border-card-border/60 rounded-3xl space-y-4 max-w-xl mx-auto my-12">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-card-border flex items-center justify-center mx-auto">
            <AlertCircle className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-heading font-bold text-slate-800 dark:text-white">No active tasks</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              No assignments are currently posted for your active course enrollments.
            </p>
          </div>
        </div>
      ) : (
        /* List */
        <div className="max-w-4xl mx-auto space-y-4 text-left">
          {assignments.map((asg) => {
            const isPending = asg.status === "Pending";
            const isSubmitted = asg.status === "Submitted";
            const isGraded = asg.status === "Graded";

            return (
              <div
                key={asg.id}
                className="p-6 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs hover:border-slate-350 dark:hover:border-slate-800 transition-all"
              >
                <div className="space-y-2 flex-grow">
                  <div className="flex gap-2 items-center">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      {asg.courseTitle}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      isPending 
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' 
                        : isSubmitted 
                          ? 'bg-blue-100 text-[#0055ff] dark:bg-blue-950/20 dark:text-blue-400' 
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                    }`}>
                      {asg.status}
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-heading font-black text-slate-800 dark:text-white leading-snug">
                    {asg.title}
                  </h4>
                  
                  <div className="flex items-center gap-1 text-[10px] text-slate-450 dark:text-slate-450 font-bold uppercase tracking-wide">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Due Date: {asg.dueDate}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-stretch justify-center gap-2 shrink-0">
                  {isPending && (
                    <button
                      onClick={() => handleUpload(asg.id, asg.title, asg.courseTitle)}
                      className="px-5 py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-[#0055ff] hover:bg-[#0044dd] rounded-xl transition-all cursor-pointer shadow-xs"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Submit Project</span>
                    </button>
                  )}
                  {isSubmitted && (
                    <div className="px-5 py-2.5 rounded-xl border border-blue-100/40 bg-blue-50/20 text-xs font-bold text-[#0055ff] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Awaiting Grade</span>
                    </div>
                  )}
                  {isGraded && (
                    <div className="text-right">
                      <span className="text-xl font-heading font-black text-emerald-600 leading-none">
                        {asg.grade}
                      </span>
                      <p className="text-[10px] text-slate-400 font-semibold leading-none mt-1">Grade Earned</p>
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
