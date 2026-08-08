"use client";

import { useState, useEffect } from "react";
import { Award, Trash2, RotateCcw, Plus, Calendar, User, BookOpen, X, ShieldAlert, CheckCircle } from "lucide-react";
import { adminSupabase } from "@/utils/supabaseClient";

interface CertificateItem {
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  dateIssued: string;
}

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState<CertificateItem[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  // Issue manually form
  const [isIssuing, setIsIssuing] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const loadData = async () => {
    try {
      // 1. Fetch student profiles (filter out admin)
      const { data: studentProfiles } = await adminSupabase
        .from("profiles")
        .select("id, full_name, email, role");

      if (studentProfiles) {
        const studentList = studentProfiles.filter((s: any) => s.email !== "marvelousotugalu012@gmail.com");
        setStudents(studentList);

        // 2. Fetch certificates list
        const { data: certData } = await adminSupabase.from("certificates").select("*");
        if (certData) {
          setCerts(
            certData.map((c: any) => {
              const studentObj = studentProfiles.find((s: any) => s.id === c.user_id);
              return {
                studentId: c.user_id,
                studentName: studentObj?.full_name || "Anonymous Student",
                studentEmail: studentObj?.email || "",
                courseId: c.course_id,
                dateIssued: c.issue_date,
              };
            })
          );
        }
      }

      // 3. Fetch courses
      const { data: courseData } = await adminSupabase.from("courses").select("*");
      if (courseData) {
        setCourses(courseData);
      }
    } catch (err) {
      console.error("Failed to load certificates:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRevoke = async (studentId: string, courseId: string, name: string) => {
    const confirmAct = confirm(`Are you sure you want to REVOKE the certificate for student "${name}"?\nThis removes download permissions on their profile.`);
    if (confirmAct) {
      try {
        const { error } = await adminSupabase
          .from("certificates")
          .delete()
          .eq("user_id", studentId)
          .eq("course_id", courseId);

        if (error) {
          alert(`Failed to revoke certificate: ${error.message}`);
        } else {
          loadData();
        }
      } catch (err) {
        console.error("Exception revoking certificate:", err);
      }
    }
  };

  const handleRegenerate = async (studentId: string, courseId: string, name: string) => {
    const confirmAct = confirm(`Regenerate and sign certificate credentials for student "${name}"?`);
    if (confirmAct) {
      const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      try {
        const { error } = await adminSupabase
          .from("certificates")
          .update({
            issue_date: dateStr,
          })
          .eq("user_id", studentId)
          .eq("course_id", courseId);

        if (error) {
          alert(`Failed to regenerate certificate: ${error.message}`);
        } else {
          loadData();
          alert("Certificate regenerated successfully!");
        }
      } catch (err) {
        console.error("Exception regenerating certificate:", err);
      }
    }
  };

  const handleManualIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedCourseId) return;

    const courseObj = courses.find((c) => c.id === selectedCourseId);
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const newId = "cert-" + Math.random().toString(36).substring(2, 9);

    try {
      const { error } = await adminSupabase.from("certificates").upsert({
        id: newId,
        user_id: selectedStudentId,
        course_id: selectedCourseId,
        course_title: courseObj ? courseObj.title : "Academy Program",
        issue_date: dateStr,
      });

      if (error) {
        alert(`Failed to issue manual certificate: ${error.message}`);
      } else {
        loadData();
        setIsIssuing(false);
        alert("Certificate manually issued and pushed to student profile.");
      }
    } catch (err) {
      console.error("Exception issuing manual certificate:", err);
    }
  };

  const getCourseTitle = (id: string) => {
    const course = courses.find((c) => c.id === id);
    return course ? course.title : id;
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Credentials Desk</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Certificate Management</h2>
        </div>
        <button
          onClick={() => {
            if (students.length > 0) setSelectedStudentId(students[0].id);
            if (courses.length > 0) setSelectedCourseId(courses[0].id);
            setIsIssuing(true);
          }}
          className="px-5 py-2.5 bg-[#0055ff] hover:bg-[#0044dd] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 self-start md:self-auto mt-3 md:mt-0"
        >
          <Plus className="w-4 h-4" />
          <span>Manual Issue Certificate</span>
        </button>
      </div>

      {/* Manual Issue Modal */}
      {isIssuing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#18181c] w-full max-w-md rounded-[24px] border border-card-border/60 shadow-2xl p-6 space-y-4 text-left">
            <h3 className="text-base font-heading font-black text-slate-850 dark:text-white">Issue Manual Certificate</h3>
            
            <form onSubmit={handleManualIssue} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 focus:outline-none"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.firstName} {st.lastName} ({st.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Select Course Program</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 focus:outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0055ff] hover:bg-[#0044dd] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Issue Certificate
                </button>
                <button
                  type="button"
                  onClick={() => setIsIssuing(false)}
                  className="px-5 py-2.5 border border-card-border hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-550 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Registry checklist */}
      <div className="rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs overflow-hidden text-left">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-card-border/40 text-[9px] font-black uppercase text-slate-450 tracking-wider text-left select-none">
                <th className="px-6 py-4">Student Recipient</th>
                <th className="px-6 py-4">Course Credentials</th>
                <th className="px-6 py-4">Date Signed</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/40 text-xs">
              {certs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-450 font-semibold">
                    No certificates have been issued yet.
                  </td>
                </tr>
              ) : (
                certs.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/20">
                    <td className="px-6 py-4 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/15 border border-red-100 dark:border-red-900/20 text-red-500 flex items-center justify-center font-heading font-black text-xs shrink-0 select-none">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-850 dark:text-white leading-none">
                          {c.studentName}
                        </h4>
                        <span className="text-[9px] text-slate-400 mt-1 block truncate max-w-[150px] leading-none">
                          {c.studentEmail}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-350">
                      {getCourseTitle(c.courseId)}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-semibold uppercase tracking-wide text-[10px]">
                      {c.dateIssued}
                    </td>
                    <td className="px-6 py-4 text-right select-none">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleRegenerate(c.studentId, c.courseId, c.studentName)}
                          className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all cursor-pointer"
                          title="Regenerate credentials signature"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleRevoke(c.studentId, c.courseId, c.studentName)}
                          className="p-2 rounded-lg text-red-550 hover:bg-red-55/10 transition-all cursor-pointer"
                          title="Revoke certificate"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
