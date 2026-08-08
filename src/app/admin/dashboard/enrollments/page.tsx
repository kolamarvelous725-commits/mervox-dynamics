"use client";

import { useState, useEffect } from "react";
import { UserCheck, BookOpen, Clock, Calendar, Search, Plus, X, Trash2 } from "lucide-react";
import { adminSupabase, isSupabaseConfigured } from "@/utils/supabaseClient";
import { AcademyDB } from "@/utils/academyDb";

interface EnrollmentItem {
  id: string;
  userId: string;
  courseId: string;
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
  const [showModal, setShowModal] = useState(false);

  // Lists for modal selections
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);
  
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [loadingModalSubmit, setLoadingModalSubmit] = useState(false);

  const loadEnrollmentsData = async () => {
    try {
      if (!isSupabaseConfigured) {
        // Sandbox fallback loading from local storage
        const usersJson = localStorage.getItem("mervox_academy_users");
        const users = usersJson ? JSON.parse(usersJson) : [];
        const localCourses = AcademyDB.getCourses();
        const list: EnrollmentItem[] = [];

        users.forEach((user: any) => {
          const progressList = AcademyDB.getProgress(user.id);
          progressList.forEach((prog: any) => {
            const courseObj = localCourses.find((c) => c.id === prog.courseId);
            list.push({
              id: `${user.id}_${prog.courseId}`,
              userId: user.id,
              courseId: prog.courseId,
              studentName: `${user.firstName} ${user.lastName}`,
              studentEmail: user.email,
              courseTitle: courseObj ? courseObj.title : prog.courseId,
              progress: prog.progress,
              status: prog.status,
              studyMinutes: prog.studyMinutes,
            });
          });
        });
        
        setEnrollments(list);
        setStudentsList(users);
        setCoursesList(localCourses);
        return;
      }

      // Online Supabase loading
      const { data: enrollData } = await adminSupabase
        .from("enrollments")
        .select("*, profiles(id, full_name, email)")
        .order("enrolled_at", { ascending: false });

      const { data: lessonProgressData } = await adminSupabase
        .from("lesson_progress")
        .select("user_id, lesson_id");

      const { data: courseLessonsData } = await adminSupabase
        .from("course_lessons")
        .select("id, course_id");

      const { data: courseData } = await adminSupabase
        .from("courses")
        .select("*");

      const { data: studentsData } = await adminSupabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("role", "student");

      if (enrollData && courseLessonsData && lessonProgressData && courseData) {
        setCoursesList(courseData);
        if (studentsData) setStudentsList(studentsData);

        const list: EnrollmentItem[] = enrollData.map((e: any) => {
          const courseObj = courseData.find((c) => c.id === e.course_id);
          
          // Get total lessons for this course
          const cLessons = courseLessonsData.filter((l: any) => l.course_id === e.course_id);
          const totalLessons = cLessons.length;

          // Get completed lessons for this user in this course
          const userCompletedIds = new Set(
            lessonProgressData
              .filter((p: any) => p.user_id === e.user_id)
              .map((p: any) => p.lesson_id)
          );
          
          const completedCount = cLessons.filter((l: any) => userCompletedIds.has(l.id)).length;
          const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
          const studyMinutes = completedCount * 25;

          return {
            id: e.id,
            userId: e.user_id,
            courseId: e.course_id,
            studentName: e.profiles?.full_name || "Anonymous Student",
            studentEmail: e.profiles?.email || "",
            courseTitle: courseObj ? courseObj.title : e.course_id,
            progress: progressPercent,
            status: progressPercent === 100 ? "Completed" : progressPercent > 0 ? "In Progress" : "Not Started",
            studyMinutes: studyMinutes,
          };
        });
        setEnrollments(list);
      }
    } catch (err) {
      console.error("Failed to load enrollments data:", err);
    }
  };

  useEffect(() => {
    loadEnrollmentsData();
  }, []);

  const handleStopEnrollment = async (uId: string, cId: string) => {
    if (!confirm("Are you sure you want to stop/cancel this student's enrollment?")) return;
    try {
      // 1. Local / offline storage cleanup
      const progress = AcademyDB.getProgress(uId);
      const updated = progress.filter((p) => p.courseId !== cId);
      AcademyDB.saveProgress(uId, updated);

      if (isSupabaseConfigured) {
        // 2. Delete from enrollments table
        const { error: enrollErr } = await adminSupabase
          .from("enrollments")
          .delete()
          .eq("user_id", uId)
          .eq("course_id", cId);
        
        if (enrollErr) {
          console.error("Failed to delete enrollment row:", enrollErr);
        }

        // 3. Delete from progress table
        await adminSupabase
          .from("progress")
          .delete()
          .eq("user_id", uId)
          .eq("course_id", cId);

        // 4. Delete all completed lesson ticks from lesson_progress for this course
        const { data: cLessons } = await adminSupabase
          .from("course_lessons")
          .select("id")
          .eq("course_id", cId);

        if (cLessons && cLessons.length > 0) {
          const lIds = cLessons.map((l: any) => l.id);
          await adminSupabase
            .from("lesson_progress")
            .delete()
            .eq("user_id", uId)
            .in("lesson_id", lIds);
        }

        // 5. Delete certificates issued for this course if any
        await adminSupabase
          .from("certificates")
          .delete()
          .eq("user_id", uId)
          .eq("course_id", cId);
      }

      alert("Enrollment stopped and course progress purged successfully.");
      loadEnrollmentsData();
    } catch (err) {
      console.error(err);
      alert("Error stopping enrollment.");
    }
  };

  const handleOfferFreeEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedCourseId) {
      alert("Please select both a student and a course.");
      return;
    }

    setLoadingModalSubmit(true);
    try {
      const courseObj = coursesList.find((c) => c.id === selectedCourseId);
      const courseTitle = courseObj?.title || "Academy Program";

      if (!isSupabaseConfigured) {
        // Sandbox: Add course to local storage progress array
        AcademyDB.enroll(selectedStudentId, selectedCourseId, courseTitle);
        alert("Free enrollment granted successfully!");
        setShowModal(false);
        setSelectedStudentId("");
        setSelectedCourseId("");
        loadEnrollmentsData();
      } else {
        // Supabase: Check duplicate enrollment record
        const { data: existing } = await adminSupabase
          .from("enrollments")
          .select("*")
          .eq("user_id", selectedStudentId)
          .eq("course_id", selectedCourseId)
          .maybeSingle();

        if (existing) {
          alert("Student is already enrolled in this course program.");
          setLoadingModalSubmit(false);
          return;
        }

        // Insert enrollment record
        const { error: enrollError } = await adminSupabase
          .from("enrollments")
          .insert({
            user_id: selectedStudentId,
            course_id: selectedCourseId,
            status: "In Progress",
          });

        if (enrollError) {
          alert(`Failed to grant enrollment: ${enrollError.message}`);
          setLoadingModalSubmit(false);
          return;
        }

        // Insert initial progress record
        await adminSupabase
          .from("progress")
          .upsert({
            user_id: selectedStudentId,
            course_id: selectedCourseId,
            progress_percent: 0,
            lessons_completed: [],
            updated_at: new Date().toISOString()
          }, {
            onConflict: "user_id,course_id"
          });

        // Send notification to the student account
        await AcademyDB.addNotification(
          selectedStudentId,
          `🎉 The administrator has offered you free enrollment access to "${courseTitle}". Start learning now!`
        );

        alert("Free enrollment granted successfully!");
        setShowModal(false);
        setSelectedStudentId("");
        setSelectedCourseId("");
        loadEnrollmentsData();
      }
    } catch (err) {
      console.error(err);
      alert(`Enrollment operation error: ${err}`);
    } finally {
      setLoadingModalSubmit(false);
    }
  };

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
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Enrollments Registry</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-[#0055ff] hover:bg-[#0044dd] text-white text-xs font-bold rounded-xl shadow-xs transition-all duration-200 cursor-pointer border-none mt-4 md:mt-0"
        >
          <Plus className="w-4 h-4" />
          <span>Offer Free Enrollment</span>
        </button>
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

        {/* Registry Table */}
        <div className="rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-card-border/40 text-[9px] font-black uppercase text-slate-455 tracking-wider text-left select-none">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Course Enrolled</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4">Study Logs</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border/40 text-xs font-semibold">
                {filteredEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-450">
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
                      <td className="px-6 py-4 text-slate-550 dark:text-slate-400 font-bold">
                        {item.studyMinutes} mins
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleStopEnrollment(item.userId, item.courseId)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all cursor-pointer bg-transparent border-none"
                          title="Stop/Cancel Student Enrollment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Offer Free Enrollment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#18181c] border border-card-border shadow-xl p-6 relative text-left">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer bg-transparent border-none"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <h3 className="text-base font-heading font-black text-slate-800 dark:text-white">Offer Free Enrollment</h3>
              
              <form onSubmit={handleOfferFreeEnrollment} className="space-y-4">
                {/* Select Student */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Select Student</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="">-- Choose a student --</option>
                    {studentsList.map((stud) => (
                      <option key={stud.id} value={stud.id}>
                        {stud.full_name || `${stud.firstName} ${stud.lastName}`} ({stud.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Course */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Select Course Program</label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="">-- Choose a course program --</option>
                    {coursesList.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loadingModalSubmit}
                  className="w-full py-3 text-xs font-bold text-white bg-[#0055ff] hover:bg-[#0044dd] rounded-xl shadow-xs transition-all cursor-pointer border-none block mt-2 text-center"
                >
                  {loadingModalSubmit ? "Granting access..." : "Grant Free Enrollment"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
