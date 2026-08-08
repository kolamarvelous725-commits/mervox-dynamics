"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, FileText, Send, Save, CheckCircle, Clock, Calendar, User, BookOpen, AlertCircle, X, CheckSquare } from "lucide-react";
import { adminSupabase } from "@/utils/supabaseClient";

interface AssignmentTask {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  dueDate: string;
}

interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  assignmentId: string;
  courseTitle: string;
  assignmentTitle: string;
  fileName: string;
  dateSubmitted: string;
  status: "Pending" | "Graded";
  grade: string;
  feedback: string;
  progressRowId: string;
}

export default function AdminAssignmentsPage() {
  const [tasks, setTasks] = useState<AssignmentTask[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  
  // Selection states
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  
  // Modals / Dropdowns
  const [isCreating, setIsCreating] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);

  // Form states
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [courseId, setCourseId] = useState("");
  
  // Grading states
  const [gradeInput, setGradeInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");

  const loadData = async () => {
    try {
      // 1. Fetch assignment tasks from Supabase
      const { data: taskData, error: taskError } = await adminSupabase
        .from("assignments")
        .select("*")
        .order("created_at", { ascending: false });

      if (taskError) {
        console.error("Failed to load tasks:", taskError);
      } else if (taskData) {
        setTasks(
          taskData.map((t: any) => ({
            id: t.id,
            courseId: t.course_id,
            courseTitle: t.course_title,
            title: t.title,
            dueDate: t.due_date,
          }))
        );
      }

      // 2. Fetch student names map
      const { data: studentProfiles } = await adminSupabase
        .from("profiles")
        .select("id, full_name");
      const nameMap = new Map(studentProfiles?.map((s) => [s.id, s.full_name]) || []);

      // 3. Fetch submissions from progress table
      const { data: progressRows, error: progressError } = await adminSupabase
        .from("progress")
        .select("id, user_id, course_id, lessons_completed");

      if (progressError) {
        console.error("Failed to load student progress for assignments:", progressError);
      } else if (progressRows) {
        const subsList: Submission[] = [];
        progressRows.forEach((p: any) => {
          const assignmentsList = p.lessons_completed?.assignments || [];
          assignmentsList.forEach((sub: any) => {
            subsList.push({
              id: `${p.id}_${sub.id}`,
              studentId: p.user_id,
              studentName: nameMap.get(p.user_id) || "Anonymous Student",
              assignmentId: sub.id,
              courseTitle: p.course_id === "forex-trading" ? "Forex Trading Masterclass" : p.course_id === "ai-automation" ? "AI & Business Automation" : "Academy Course",
              assignmentTitle: sub.fileName || "Project Checkpoint",
              fileName: sub.fileName || "Project.pdf",
              dateSubmitted: sub.dateSubmitted || "Today",
              status: sub.status || "Pending",
              grade: sub.grade || "",
              feedback: sub.feedback || "",
              progressRowId: p.id,
            });
          });
        });
        setSubmissions(subsList);
      }

      // 4. Fetch courses
      const { data: courseData } = await adminSupabase.from("courses").select("*");
      if (courseData) {
        setCourses(courseData);
      }
    } catch (err) {
      console.error("Exception loading assignments admin data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate.trim()) return;

    const courseObj = courses.find((c) => c.id === courseId) || courses[0];
    const newId = "asg-" + Math.random().toString(36).substring(2, 9);

    try {
      const { error } = await adminSupabase.from("assignments").insert({
        id: newId,
        course_id: courseId || courses[0]?.id || "forex-trading",
        course_title: courseObj ? courseObj.title : "Academy Course",
        title: title.trim(),
        due_date: dueDate.trim(),
      });

      if (error) {
        alert(`Failed to create assignment: ${error.message}`);
      } else {
        loadData();
        // Reset and close
        setTitle("");
        setDueDate("");
        setIsCreating(false);
        alert("New assignment task broadcasted to all course enrollees!");
      }
    } catch (err) {
      console.error("Exception creating assignment:", err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    const confirmAct = confirm("Are you sure you want to delete this assignment task description?");
    if (confirmAct) {
      try {
        const { error } = await adminSupabase
          .from("assignments")
          .delete()
          .eq("id", id);

        if (error) {
          alert(`Failed to delete assignment: ${error.message}`);
        } else {
          loadData();
        }
      } catch (err) {
        console.error("Exception deleting assignment task:", err);
      }
    }
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission || !gradeInput.trim()) return;

    const progressRowId = selectedSubmission.progressRowId;

    try {
      const { data: progRow } = await adminSupabase
        .from("progress")
        .select("*")
        .eq("id", progressRowId)
        .single();

      if (progRow) {
        const currentLessonsCompleted = progRow.lessons_completed || {};
        const currentAsgs = currentLessonsCompleted.assignments || [];

        const updatedAsgs = currentAsgs.map((a: any) => {
          if (a.id === selectedSubmission.assignmentId) {
            return {
              ...a,
              status: "Graded",
              grade: gradeInput.trim(),
              feedback: feedbackInput.trim(),
            };
          }
          return a;
        });

        const updatedLessonsCompleted = {
          ...currentLessonsCompleted,
          assignments: updatedAsgs,
        };

        const { error } = await adminSupabase
          .from("progress")
          .update({
            lessons_completed: updatedLessonsCompleted,
          })
          .eq("id", progressRowId);

        if (error) {
          alert(`Failed to save grade: ${error.message}`);
        } else {
          loadData();
          setGradeInput("");
          setFeedbackInput("");
          setSelectedSubmission(null);
          alert("Grade and feedback saved! Student has been notified.");
        }
      }
    } catch (err) {
      console.error("Exception grading submission:", err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Checkpoints Portal</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Assignments Evaluation</h2>
        </div>
        <button
          onClick={() => {
            setCourseId(courses[0]?.id || "");
            setIsCreating(true);
          }}
          className="px-5 py-2.5 bg-[#0055ff] hover:bg-[#0044dd] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 self-start md:self-auto mt-3 md:mt-0"
        >
          <Plus className="w-4 h-4" />
          <span>Post Assignment</span>
        </button>
      </div>

      {/* Creation Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#18181c] w-full max-w-md rounded-[24px] border border-card-border/60 shadow-2xl p-6 space-y-4 text-left">
            <h3 className="text-base font-heading font-black text-slate-850 dark:text-white">Create Assignment Task</h3>
            
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Course Curriculum</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 focus:outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wide block">Assignment Title</label>
                <input
                  type="text"
                  placeholder="e.g. Live Trading Session Screenshot Submission"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wide block">Deadline Date</label>
                <input
                  type="text"
                  placeholder="e.g., August 15, 2026"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0055ff] hover:bg-[#0044dd] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Post Task
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-2.5 border border-card-border hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-550 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main double column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Left Column: Submissions Checklist list */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Pending & Graded Submissions</h3>
          
          <div className="rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-card-border/40 text-[9px] font-black uppercase text-slate-450 tracking-wider text-left">
                    <th className="px-6 py-4">Student Info</th>
                    <th className="px-6 py-4">Deliverable</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border/40 text-xs">
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-450 font-semibold">
                        No assignment submissions uploaded yet.
                      </td>
                    </tr>
                  ) : (
                    submissions.map((sub) => (
                      <tr
                        key={sub.id}
                        onClick={() => {
                          setSelectedSubmission(sub);
                          setGradeInput(sub.grade || "");
                          setFeedbackInput(sub.feedback || "");
                        }}
                        className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/30 cursor-pointer transition-colors ${
                          selectedSubmission?.id === sub.id ? "bg-blue-50/20 dark:bg-blue-950/5" : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <h4 className="font-bold text-slate-850 dark:text-white leading-none">
                            {sub.studentName}
                          </h4>
                          <span className="text-[9px] text-slate-400 mt-1 block truncate max-w-[150px] leading-none">
                            {sub.courseTitle}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 max-w-[180px] truncate">
                          {sub.assignmentTitle}
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-semibold">
                          {sub.dateSubmitted}
                        </td>
                        <td className="px-6 py-4 select-none">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                            sub.status === "Graded"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Grading Inspector panel */}
        <div className="lg:col-span-5 space-y-6">
          
          {selectedSubmission ? (
            <div className="p-6 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs space-y-5">
              <div className="flex justify-between items-start pb-3 border-b border-card-border/40">
                <div>
                  <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase leading-none">
                    Grading Desk
                  </h3>
                  <p className="text-[9px] text-slate-400 mt-1.5 leading-none">ID: {selectedSubmission.id}</p>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Student Deliverable details */}
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Student Name:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedSubmission.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Assignment:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-right max-w-[200px] truncate">
                    {selectedSubmission.assignmentTitle}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-card-border/40">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-[10px] text-slate-655 dark:text-slate-300 truncate max-w-[160px]">
                      {selectedSubmission.fileName}
                    </span>
                  </div>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert("File downloaded (Simulated Mock)."); }}
                    className="text-[9px] font-bold text-[#0055ff] hover:underline uppercase tracking-wide select-none"
                  >
                    View File
                  </a>
                </div>
              </div>

              {/* Grade entry form */}
              <form onSubmit={handleGradeSubmit} className="space-y-3 pt-3 border-t border-card-border/40 select-none">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wide block">Award Grade</label>
                  <input
                    type="text"
                    placeholder="e.g. A+, 95%, Passed"
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wide block">Feedback/Comments</label>
                  <textarea
                    placeholder="Provide constructive review guidelines..."
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0055ff] hover:bg-[#0044dd] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Evaluation</span>
                </button>
              </form>

            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-card-border/60 bg-white dark:bg-[#18181c] rounded-2xl text-slate-400 py-16 space-y-2 select-none">
              <CheckSquare className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold">Select a submitted project row from the registry table to enter grading marks.</p>
            </div>
          )}

          {/* Active Tasks Reference list */}
          <div className="p-6 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs space-y-4">
            <h3 className="text-xs font-black text-slate-850 dark:text-white uppercase tracking-wider pb-2 border-b border-card-border/40">
              Published Course Checkpoints
            </h3>
            
            <div className="divide-y divide-card-border/40 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
              {tasks.length === 0 ? (
                <p className="text-[10px] text-slate-450 font-semibold py-4 text-center">No assignments published.</p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="py-2.5 flex items-center justify-between gap-3 first:pt-0">
                    <div className="min-w-0">
                      <h4 className="text-[10px] font-bold text-slate-800 dark:text-white truncate">
                        {task.title}
                      </h4>
                      <span className="text-[8px] text-slate-400 font-bold uppercase block mt-0.5">
                        Due: {task.dueDate}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 cursor-pointer shrink-0 border-none bg-transparent"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
