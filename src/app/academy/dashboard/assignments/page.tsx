"use client";

import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { AcademyDB } from "@/utils/academyDb";
import { useState, useEffect } from "react";
import { FileText, Calendar, Upload, CheckCircle2, ChevronRight, BookOpen, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/utils/supabaseClient";

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
  const [progressRows, setProgressRows] = useState<any[]>([]);

  useEffect(() => {
    if (userId) {
      const loadAssignments = async () => {
        try {
          if (!isSupabaseConfigured) {
            const progress = AcademyDB.getProgress(userId);
            setCoursesEnrolled(progress.length);

            const subKey = `mervox_academy_submissions_${userId}`;
            const storedSubs = localStorage.getItem(subKey);
            const submissions = storedSubs ? JSON.parse(storedSubs) : {};

            const mockAssignments: Assignment[] = [];
            progress.forEach((p) => {
              const course = AcademyDB.getCourses().find((c) => c.id === p.courseId);
              const courseTitle = course?.title || "Academy Program";
              const a1Id = `asg-${p.courseId}-1`;
              const a2Id = `asg-${p.courseId}-2`;

              mockAssignments.push({
                id: a1Id,
                courseId: p.courseId,
                courseTitle,
                title: `${courseTitle} - Milestone Checkpoint 1`,
                dueDate: "Next Sunday",
                status: (submissions[a1Id]?.status || "Pending") as "Pending" | "Submitted" | "Graded",
                grade: submissions[a1Id]?.grade || "",
                feedback: submissions[a1Id]?.feedback || "",
              });

              mockAssignments.push({
                id: a2Id,
                courseId: p.courseId,
                courseTitle,
                title: `${courseTitle} - Capstone Project`,
                dueDate: "End of Month",
                status: (submissions[a2Id]?.status || "Pending") as "Pending" | "Submitted" | "Graded",
                grade: submissions[a2Id]?.grade || "",
                feedback: submissions[a2Id]?.feedback || "",
              });
            });

            setAssignments(mockAssignments);

            const viewedAsgKey = `mervox_academy_viewed_asg_${userId}`;
            const activeIds = mockAssignments.map((a: any) => a.id);
            localStorage.setItem(viewedAsgKey, JSON.stringify(activeIds));
            return;
          }

          // 1. Fetch student's progress rows
          const { data: userProgress } = await supabase
            .from("progress")
            .select("*")
            .eq("user_id", userId);

          const progress = userProgress || [];
          setProgressRows(progress);
          setCoursesEnrolled(progress.length);

          const enrolledCourseIds = progress.map((p: any) => p.course_id);

          // 2. Fetch all assignments
          const { data: allAsgs } = await supabase
            .from("assignments")
            .select("*");

          if (allAsgs) {
            // Filter assignments matching enrolled course IDs
            const filteredAsgs = allAsgs.filter((a: any) => enrolledCourseIds.includes(a.course_id));

            // Map and attach submissions from lessons_completed JSON
            const mapped = filteredAsgs.map((a: any) => {
              const courseProg = progress.find((p: any) => p.course_id === a.course_id);
              const submissionObj = courseProg?.lessons_completed?.assignments?.find((sub: any) => sub.id === a.id);

              return {
                id: a.id,
                courseId: a.course_id,
                courseTitle: a.course_title,
                title: a.title,
                dueDate: a.due_date,
                status: (submissionObj?.status || "Pending") as "Pending" | "Submitted" | "Graded",
                grade: submissionObj?.grade || "",
                feedback: submissionObj?.feedback || "",
              };
            });

            setAssignments(mapped);

            const viewedAsgKey = `mervox_academy_viewed_asg_${userId}`;
            const activeIds = mapped.map((a: any) => a.id);
            localStorage.setItem(viewedAsgKey, JSON.stringify(activeIds));
          }
        } catch (err) {
          console.error("Failed to load assignments:", err);
        }
      };

      loadAssignments();
    }
  }, [userId]);

  const handleUpload = async (id: string, title: string, courseTitle: string) => {
    const confirmUpload = confirm(`Simulate file checkpoint upload for:\n"${title}"?\n\nClick OK to confirm submission.`);
    if (confirmUpload) {
      try {
        if (!isSupabaseConfigured) {
          const subKey = `mervox_academy_submissions_${userId}`;
          const storedSubs = localStorage.getItem(subKey);
          const submissions = storedSubs ? JSON.parse(storedSubs) : {};
          
          submissions[id] = {
            status: "Submitted",
            grade: "",
            feedback: "",
          };
          localStorage.setItem(subKey, JSON.stringify(submissions));

          // Reload mock list
          const progress = AcademyDB.getProgress(userId);
          const mockAssignments: Assignment[] = [];
          progress.forEach((p) => {
            const course = AcademyDB.getCourses().find((c) => c.id === p.courseId);
            const titleMeta = course?.title || "Academy Program";
            const a1Id = `asg-${p.courseId}-1`;
            const a2Id = `asg-${p.courseId}-2`;

            mockAssignments.push({
              id: a1Id,
              courseId: p.courseId,
              courseTitle: titleMeta,
              title: `${titleMeta} - Milestone Checkpoint 1`,
              dueDate: "Next Sunday",
              status: (submissions[a1Id]?.status || "Pending") as "Pending" | "Submitted" | "Graded",
              grade: submissions[a1Id]?.grade || "",
              feedback: submissions[a1Id]?.feedback || "",
            });

            mockAssignments.push({
              id: a2Id,
              courseId: p.courseId,
              courseTitle: titleMeta,
              title: `${titleMeta} - Capstone Project`,
              dueDate: "End of Month",
              status: (submissions[a2Id]?.status || "Pending") as "Pending" | "Submitted" | "Graded",
              grade: submissions[a2Id]?.grade || "",
              feedback: submissions[a2Id]?.feedback || "",
            });
          });

          setAssignments(mockAssignments);
          alert("Submission successful! Mentor feedback will render here upon evaluation.");
          return;
        }

        const asgItem = assignments.find((a) => a.id === id);
        if (!asgItem) return;

        const matchingProg = progressRows.find((p) => p.course_id === asgItem.courseId);
        if (!matchingProg) return;

        const currentLessonsCompleted = matchingProg.lessons_completed || {};
        const currentAsgs = currentLessonsCompleted.assignments || [];

        const updatedAsgs = [
          ...currentAsgs.filter((a: any) => a.id !== id),
          {
            id,
            status: "Submitted",
            fileName: `${title.replace(/\s+/g, "_")}.pdf`,
            dateSubmitted: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            grade: "",
            feedback: "",
          },
        ];

        const updatedLessonsCompleted = {
          ...currentLessonsCompleted,
          assignments: updatedAsgs,
        };

        const { error } = await supabase
          .from("progress")
          .update({
            lessons_completed: updatedLessonsCompleted,
          })
          .eq("id", matchingProg.id);

        if (error) {
          alert(`Failed to submit assignment: ${error.message}`);
        } else {
          // Trigger reload
          setProgressRows((prev) =>
            prev.map((p) => {
              if (p.id === matchingProg.id) {
                return { ...p, lessons_completed: updatedLessonsCompleted };
              }
              return p;
            })
          );

          setAssignments((prev) =>
            prev.map((a) => {
              if (a.id === id) {
                return { ...a, status: "Submitted" };
              }
              return a;
            })
          );

          alert("Submission successful! Mentor feedback will render here upon evaluation.");
        }
      } catch (err) {
        console.error("Exception submitting assignment:", err);
      }
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
