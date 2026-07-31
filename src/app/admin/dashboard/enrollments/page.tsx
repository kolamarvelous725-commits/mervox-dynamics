"use client";

import { AcademyDB } from "@/utils/academyDb";
import { useState, useEffect } from "react";
import { UserCheck, BookOpen, Clock, Calendar, Search } from "lucide-react";

interface EnrollmentItem {
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  progress: number;
  status: string;
  studyMinutes: number;
}

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const students = AcademyDB.getStudents();
    const courseList = AcademyDB.getCourses();
    setCourses(courseList);

    const list: EnrollmentItem[] = [];
    students.forEach((student: any) => {
      const progress = student.progress || [];
      progress.forEach((p: any) => {
        const course = courseList.find((c) => c.id === p.courseId);
        list.push({
          studentName: `${student.firstName} ${student.lastName}`,
          studentEmail: student.email,
          courseTitle: course ? course.title : p.courseId,
          progress: p.progress,
          status: p.status,
          studyMinutes: p.studyMinutes || 0,
        });
      });
    });

    setEnrollments(list);
  }, []);

  const filteredEnrollments = enrollments.filter(
    (e) =>
      e.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Course Slots</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Enrollments registry</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2 md:mt-0 leading-relaxed font-semibold">
          Review active course enrollments, track progress percentages, and check study minutes logs.
        </p>
      </div>

      {/* Search and Registry */}
      <div className="space-y-4 text-left">
        
        {/* Search */}
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search enrollments by student name, email, or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white dark:bg-[#18181c] border border-card-border/60 text-slate-850 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
          />
        </div>

        {/* Registry table */}
        <div className="rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-card-border/40 text-[9px] font-black uppercase text-slate-455 tracking-wider text-left select-none">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Course Enrolled</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4 text-right">Study Minutes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border/40 text-xs font-semibold">
                {filteredEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-450">
                      No active program enrollments found matching search query.
                    </td>
                  </tr>
                ) : (
                  filteredEnrollments.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/20">
                      <td className="px-6 py-4">
                        <h4 className="font-bold text-slate-800 dark:text-white leading-none">
                          {item.studentName}
                        </h4>
                        <span className="text-[9px] text-slate-400 mt-1 block truncate max-w-[150px] leading-none">
                          {item.studentEmail}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-350">
                        {item.courseTitle}
                      </td>
                      <td className="px-6 py-4 select-none">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                          item.status === "Completed"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                            : item.status === "In Progress"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400"
                              : "bg-slate-100 text-slate-655 dark:bg-slate-900/30 dark:text-slate-400"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 select-none">
                          <span className="text-[10px] font-black">{item.progress}%</span>
                          <div className="w-16 bg-slate-100 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#0055ff] h-1.5 rounded-full" style={{ width: `${item.progress}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-500 font-bold">
                        {item.studyMinutes} mins
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
