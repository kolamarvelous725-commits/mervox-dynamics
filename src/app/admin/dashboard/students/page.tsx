"use client";

import { AcademyDB } from "@/utils/academyDb";
import { useState, useEffect } from "react";
import { Search, UserX, Trash2, ShieldAlert, Award, FileText, CheckCircle, Clock, BookOpen, X, Info } from "lucide-react";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  // Load students list
  const loadData = () => {
    setStudents(AcademyDB.getStudents());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleSuspend = (id: string, currentlySuspended: boolean) => {
    const actStr = currentlySuspended ? "unsuspend" : "suspend";
    const confirmAct = confirm(`Are you sure you want to ${actStr} this student account?`);
    if (confirmAct) {
      AcademyDB.suspendStudent(id, !currentlySuspended);
      loadData();
      if (selectedStudent && selectedStudent.id === id) {
        setSelectedStudent((prev: any) => ({ ...prev, suspended: !currentlySuspended }));
      }
    }
  };

  const handleDeleteStudent = (id: string, name: string) => {
    const confirmAct = confirm(`WARNING: Are you sure you want to permanently DELETE student "${name}"?\nThis action cannot be undone.`);
    if (confirmAct) {
      AcademyDB.deleteStudent(id);
      loadData();
      if (selectedStudent && selectedStudent.id === id) {
        setSelectedStudent(null);
      }
    }
  };

  const filteredStudents = students.filter((st) =>
    `${st.firstName} ${st.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    st.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (st.country && st.country.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getInitials = (first = "", last = "") => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Audits Panel</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Student Management</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2 md:mt-0 leading-relaxed font-semibold">
          Review student profiles, enrollments progress, toggle account suspensions, or delete database profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Left Column: Students List */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Search bar */}
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Search students by name, email, or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white dark:bg-[#18181c] border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
            />
          </div>

          <div className="rounded-2xl border border-card-border bg-white dark:bg-[#18181c] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-card-border/40 text-[9px] font-black uppercase text-slate-400 tracking-wider text-left select-none">
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Country</th>
                    <th className="px-6 py-4">Registered</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border/40 text-xs">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-450 font-semibold">
                        No registered students found.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st) => {
                      const isSuspended = st.suspended || false;
                      const initials = getInitials(st.firstName, st.lastName);

                      return (
                        <tr
                          key={st.id}
                          onClick={() => setSelectedStudent(st)}
                          className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/30 cursor-pointer transition-colors ${
                            selectedStudent?.id === st.id ? "bg-blue-50/20 dark:bg-blue-950/5" : ""
                          }`}
                        >
                          <td className="px-6 py-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-900 border border-card-border/60 text-[#0055ff] flex items-center justify-center font-heading font-black text-xs shrink-0 select-none">
                              {initials}
                            </div>
                            <div className="truncate">
                              <h4 className="font-bold text-slate-800 dark:text-white leading-none">
                                {st.firstName} {st.lastName}
                              </h4>
                              <span className="text-[9px] text-slate-400 mt-1 block truncate leading-none">
                                {st.email}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">
                            {st.country || "Not set"}
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-semibold">
                            {st.memberSince}
                          </td>
                          <td className="px-6 py-4 select-none">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                              isSuspended
                                ? "bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                            }`}>
                              {isSuspended ? "Suspended" : "Active"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right select-none" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleToggleSuspend(st.id, isSuspended)}
                                className={`p-2 rounded-lg border border-transparent transition-all cursor-pointer ${
                                  isSuspended
                                    ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                                    : "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                                }`}
                                title={isSuspended ? "Unsuspend account" : "Suspend account"}
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => handleDeleteStudent(st.id, `${st.firstName} ${st.lastName}`)}
                                className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                                title="Delete student profile"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Student Details Profile */}
        <div className="lg:col-span-4">
          {selectedStudent ? (
            <div className="p-6 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs space-y-5">
              {/* Header card details */}
              <div className="flex justify-between items-start pb-4 border-b border-card-border/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-900 border border-card-border/60 text-[#0055ff] flex items-center justify-center font-heading font-black text-sm shrink-0">
                    {getInitials(selectedStudent.firstName, selectedStudent.lastName)}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-800 dark:text-white leading-none">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </h3>
                    <span className="text-[9px] text-slate-400 mt-1 block leading-none">{selectedStudent.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-1 rounded-lg text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Bio details list */}
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Phone:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{selectedStudent.phone || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Country:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{selectedStudent.country || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Occupation:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{selectedStudent.occupation || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">DOB:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{selectedStudent.dob || "N/A"}</span>
                </div>
                <div className="border-t border-card-border/40 pt-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Biography</span>
                  <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-semibold italic">
                    {selectedStudent.bio || "No biography provided."}
                  </p>
                </div>
              </div>

              {/* Enrolled courses progress */}
              <div className="border-t border-card-border/40 pt-4 space-y-3">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4 text-[#0055ff]" />
                  <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    Enrolled Programs Progress
                  </span>
                </div>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                  {(!selectedStudent.progress || selectedStudent.progress.length === 0) ? (
                    <p className="text-[10px] text-slate-450 font-semibold py-2 text-center">Not enrolled in any course yet.</p>
                  ) : (
                    selectedStudent.progress.map((prog: any) => (
                      <div key={prog.courseId} className="p-3 rounded-xl border border-card-border space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-[10px] font-black text-slate-800 dark:text-white leading-tight">
                            {prog.courseId === "forex-trading" 
                              ? "Forex Trading Masterclass" 
                              : prog.courseId === "ai-automation" 
                                ? "AI & Business Automation" 
                                : prog.courseId === "web-dev" 
                                  ? "Web & Software Development" 
                                  : "YouTube Algorithm Monetization"}
                          </h4>
                          <span className="text-[8px] px-1.5 py-0.5 rounded font-black uppercase bg-blue-50 text-[#0055ff] shrink-0 leading-none">
                            {prog.progress}%
                          </span>
                        </div>
                        
                        <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-1.5">
                          <div
                            className="bg-[#0055ff] h-1.5 rounded-full"
                            style={{ width: `${prog.progress}%` }}
                          />
                        </div>
                        
                        <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wide">
                          <span>{prog.lessonsCompleted} / {prog.totalLessons} Lessons</span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {prog.studyMinutes || 0} mins
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-card-border/60 bg-white dark:bg-[#18181c] rounded-2xl text-slate-400 py-16 space-y-2">
              <Info className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold">Select a student row in the checklist to review comprehensive course progress details.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
