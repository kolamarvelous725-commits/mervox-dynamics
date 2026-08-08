"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Play, FileText, Upload, Save, ArrowRight, Eye, EyeOff, X, HelpCircle, Layers, ArrowUp, ArrowDown } from "lucide-react";
import Image from "next/image";
import { adminSupabase, isSupabaseConfigured } from "@/utils/supabaseClient";
import AcademyDB from "@/utils/academyDb";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  published: boolean;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  
  // Creation form states
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newThumb, setNewThumb] = useState("/course-forex-v3.webp");

  // Lesson CRUD states
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDesc, setLessonDesc] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonPdfUrl, setLessonPdfUrl] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");

  const loadData = async () => {
    try {
      if (!isSupabaseConfigured) {
        const list = AcademyDB.getCourses();
        setCourses(list);
        return;
      }

      const { data, error } = await adminSupabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to query courses:", error);
      } else if (data) {
        setCourses(
          data.map((c: any) => ({
            id: c.id,
            title: c.title,
            description: c.description || "",
            thumbnail: c.thumbnail || "/course-forex-v3.webp",
            published: c.published,
          }))
        );
      }
    } catch (err) {
      console.error("Exception loading courses:", err);
    }
  };

  const fetchLessons = async (courseId: string) => {
    try {
      if (!isSupabaseConfigured) {
        const key = `mervox_academy_lessons_${courseId}`;
        const stored = localStorage.getItem(key);
        if (stored) {
          setLessons(JSON.parse(stored));
        } else {
          const course = AcademyDB.getCourses().find((c) => c.id === courseId);
          const defaultLessons = course?.lessons?.map((lesTitle: string, idx: number) => ({
            id: `les-${courseId}-${idx}`,
            course_id: courseId,
            title: lesTitle,
            description: "Sandbox Course Lesson. Master high-yield digital skills step-by-step.",
            video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            pdf_url: "",
            duration: "15:00",
            sort_order: idx + 1,
          })) || [];
          localStorage.setItem(key, JSON.stringify(defaultLessons));
          setLessons(defaultLessons);
        }
        return;
      }

      const { data, error } = await adminSupabase
        .from("course_lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("sort_order", { ascending: true });

      if (error) {
        console.warn("Database course_lessons table not yet created in Supabase. Falling back to local templates.", error);
        const course = AcademyDB.getCourses().find((c) => c.id === courseId);
        const defaultLessons = course?.lessons?.map((lesTitle: string, idx: number) => ({
          id: `les-${courseId}-${idx}`,
          course_id: courseId,
          title: lesTitle,
          description: "Sandbox Course Lesson. Master high-yield digital skills step-by-step.",
          video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          pdf_url: "",
          duration: "15:00",
          sort_order: idx + 1,
        })) || [];
        setLessons(defaultLessons);
      } else {
        setLessons(data || []);
      }
    } catch (err) {
      console.error("Exception fetching lessons:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchLessons(selectedCourse.id);
    } else {
      setLessons([]);
    }
  }, [selectedCourse?.id]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newId = newTitle.toLowerCase().replace(/\s+/g, "-");
    try {
      if (!isSupabaseConfigured) {
        const list = AcademyDB.getCourses();
        const newCourse: Course = {
          id: newId,
          title: newTitle.trim(),
          description: newDesc.trim(),
          thumbnail: newThumb,
          published: false,
        };
        list.unshift(newCourse);
        localStorage.setItem("mervox_academy_courses", JSON.stringify(list));
        loadData();
        setNewTitle("");
        setNewDesc("");
        setIsCreating(false);
        return;
      }

      const { error } = await adminSupabase.from("courses").insert({
        id: newId,
        title: newTitle.trim(),
        description: newDesc.trim(),
        thumbnail: newThumb,
        published: false,
      });

      if (error) {
        console.error("Supabase Courses INSERT error:", error);
        alert(`Failed to create course: ${error.message}`);
      } else {
        loadData();
        setNewTitle("");
        setNewDesc("");
        setIsCreating(false);
      }
    } catch (err) {
      console.error("Exception creating course:", err);
    }
  };

  const handleUpdateCourse = async () => {
    if (!selectedCourse) return;

    try {
      if (!isSupabaseConfigured) {
        const list = AcademyDB.getCourses();
        const updated = list.map((c) => {
          if (c.id === selectedCourse.id) {
            return selectedCourse;
          }
          return c;
        });
        localStorage.setItem("mervox_academy_courses", JSON.stringify(updated));
        loadData();
        alert("Course updates saved successfully!");
        return;
      }

      const { error } = await adminSupabase
        .from("courses")
        .update({
          title: selectedCourse.title.trim(),
          description: selectedCourse.description.trim(),
          thumbnail: selectedCourse.thumbnail,
          published: selectedCourse.published,
        })
        .eq("id", selectedCourse.id);

      if (error) {
        console.error("Supabase Courses UPDATE error:", error);
        alert(`Failed to save course updates: ${error.message}`);
      } else {
        loadData();
        alert("Course updates saved successfully!");
      }
    } catch (err) {
      console.error("Exception updating course:", err);
    }
  };

  const handleDeleteCourse = async (id: string, name: string) => {
    const confirmAct = confirm(`WARNING: Are you sure you want to permanently DELETE course "${name}"?\nAll lessons and student enrollments will be deleted.`);
    if (confirmAct) {
      try {
        if (!isSupabaseConfigured) {
          const list = AcademyDB.getCourses();
          const filtered = list.filter((c) => c.id !== id);
          localStorage.setItem("mervox_academy_courses", JSON.stringify(filtered));
          loadData();
          if (selectedCourse?.id === id) {
            setSelectedCourse(null);
          }
          return;
        }

        const { error } = await adminSupabase
          .from("courses")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Supabase Courses DELETE error:", error);
          alert(`Failed to delete course: ${error.message}`);
        } else {
          loadData();
          if (selectedCourse?.id === id) {
            setSelectedCourse(null);
          }
        }
      } catch (err) {
        console.error("Exception deleting course:", err);
      }
    }
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !lessonTitle.trim()) return;

    const maxOrder = lessons.reduce((max, l) => Math.max(max, l.sort_order || 0), 0);
    try {
      if (!isSupabaseConfigured) {
        const key = `mervox_academy_lessons_${selectedCourse.id}`;
        const newLesson = {
          id: `les-${selectedCourse.id}-${Math.random().toString(36).substring(2, 9)}`,
          course_id: selectedCourse.id,
          title: lessonTitle.trim(),
          description: lessonDesc.trim() || null,
          video_url: lessonVideoUrl.trim() || null,
          pdf_url: lessonPdfUrl.trim() || null,
          duration: lessonDuration.trim() || null,
          sort_order: maxOrder + 1,
        };
        const updated = [...lessons, newLesson];
        localStorage.setItem(key, JSON.stringify(updated));
        fetchLessons(selectedCourse.id);
        setLessonTitle("");
        setLessonDesc("");
        setLessonVideoUrl("");
        setLessonPdfUrl("");
        setLessonDuration("");
        setIsCreatingLesson(false);
        return;
      }

      const { error } = await adminSupabase.from("course_lessons").insert({
        course_id: selectedCourse.id,
        title: lessonTitle.trim(),
        description: lessonDesc.trim() || null,
        video_url: lessonVideoUrl.trim() || null,
        pdf_url: lessonPdfUrl.trim() || null,
        duration: lessonDuration.trim() || null,
        sort_order: maxOrder + 1,
      });

      if (error) {
        console.error("Error creating lesson:", error);
        alert("Failed to add lesson: " + error.message);
      } else {
        fetchLessons(selectedCourse.id);
        setLessonTitle("");
        setLessonDesc("");
        setLessonVideoUrl("");
        setLessonPdfUrl("");
        setLessonDuration("");
        setIsCreatingLesson(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartEditLesson = (lesson: any) => {
    setEditingLessonId(lesson.id);
    setLessonTitle(lesson.title || "");
    setLessonDesc(lesson.description || "");
    setLessonVideoUrl(lesson.video_url || "");
    setLessonPdfUrl(lesson.pdf_url || "");
    setLessonDuration(lesson.duration || "");
    setIsEditingLesson(true);
    setIsCreatingLesson(false);
  };

  const handleSaveEditedLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !editingLessonId || !lessonTitle.trim()) return;

    try {
      if (!isSupabaseConfigured) {
        const key = `mervox_academy_lessons_${selectedCourse.id}`;
        const updated = lessons.map((l) => {
          if (l.id === editingLessonId) {
            return {
              ...l,
              title: lessonTitle.trim(),
              description: lessonDesc.trim() || null,
              video_url: lessonVideoUrl.trim() || null,
              pdf_url: lessonPdfUrl.trim() || null,
              duration: lessonDuration.trim() || null,
            };
          }
          return l;
        });
        localStorage.setItem(key, JSON.stringify(updated));
        fetchLessons(selectedCourse.id);
        setLessonTitle("");
        setLessonDesc("");
        setLessonVideoUrl("");
        setLessonPdfUrl("");
        setLessonDuration("");
        setEditingLessonId(null);
        setIsEditingLesson(false);
        return;
      }

      const { error } = await adminSupabase
        .from("course_lessons")
        .update({
          title: lessonTitle.trim(),
          description: lessonDesc.trim() || null,
          video_url: lessonVideoUrl.trim() || null,
          pdf_url: lessonPdfUrl.trim() || null,
          duration: lessonDuration.trim() || null,
        })
        .eq("id", editingLessonId);

      if (error) {
        console.error("Error updating lesson:", error);
        alert("Failed to save lesson details: " + error.message);
      } else {
        fetchLessons(selectedCourse.id);
        setLessonTitle("");
        setLessonDesc("");
        setLessonVideoUrl("");
        setLessonPdfUrl("");
        setLessonDuration("");
        setEditingLessonId(null);
        setIsEditingLesson(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    const confirmAct = confirm("Are you sure you want to permanently delete this lesson from the database?");
    if (confirmAct && selectedCourse) {
      try {
        if (!isSupabaseConfigured) {
          const key = `mervox_academy_lessons_${selectedCourse.id}`;
          const filtered = lessons.filter((l) => l.id !== lessonId);
          localStorage.setItem(key, JSON.stringify(filtered));
          fetchLessons(selectedCourse.id);
          return;
        }

        const { error } = await adminSupabase
          .from("course_lessons")
          .delete()
          .eq("id", lessonId);

        if (error) {
          console.error("Error deleting lesson:", error);
          alert("Failed to delete lesson: " + error.message);
        } else {
          fetchLessons(selectedCourse.id);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMoveLesson = async (index: number, direction: "up" | "down") => {
    if (!selectedCourse) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= lessons.length) return;

    const currentLesson = lessons[index];
    const otherLesson = lessons[targetIndex];

    const currentOrder = currentLesson.sort_order;
    const otherOrder = otherLesson.sort_order;

    try {
      if (!isSupabaseConfigured) {
        const key = `mervox_academy_lessons_${selectedCourse.id}`;
        const reordered = [...lessons];
        reordered[index] = { ...currentLesson, sort_order: otherOrder };
        reordered[targetIndex] = { ...otherLesson, sort_order: currentOrder };
        reordered.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        localStorage.setItem(key, JSON.stringify(reordered));
        fetchLessons(selectedCourse.id);
        return;
      }

      const { error: err1 } = await supabase
        .from("course_lessons")
        .update({ sort_order: otherOrder })
        .eq("id", currentLesson.id);

      const { error: err2 } = await supabase
        .from("course_lessons")
        .update({ sort_order: currentOrder })
        .eq("id", otherLesson.id);

      if (err1 || err2) {
        console.error("Error reordering lessons:", err1 || err2);
      } else {
        fetchLessons(selectedCourse.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Curriculum Manager</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Course Management</h2>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-5 py-2.5 bg-[#0055ff] hover:bg-[#0044dd] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 self-start md:self-auto mt-3 md:mt-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Program</span>
        </button>
      </div>

      {/* Creation form modal wrapper */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#18181c] w-full max-w-md rounded-[24px] border border-card-border/60 shadow-2xl p-6 space-y-4 text-left">
            <h3 className="text-base font-heading font-black text-slate-850 dark:text-white">Create New Course</h3>
            
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Course Title</label>
                <input
                  type="text"
                  placeholder="e.g. Forex Technical Analysis"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-850 dark:text-slate-200 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Description</label>
                <textarea
                  placeholder="Summarize course goals..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-850 dark:text-slate-200 focus:outline-none resize-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Thumbnail Selection</label>
                <select
                  value={newThumb}
                  onChange={(e) => setNewThumb(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-850 dark:text-slate-200 focus:outline-none"
                >
                  <option value="/course-forex-v3.webp">Forex Trading Asset</option>
                  <option value="/course-ai-v3.webp">AI Automation Asset</option>
                  <option value="/course-webdev-v3.webp">Web Dev Asset</option>
                  <option value="/course-youtube-v3.webp">YouTube Asset</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0055ff] hover:bg-[#0044dd] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-2.5 border border-card-border hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-500 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Left Column: Programs Grid list */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Active Curriculum</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => {
                  setSelectedCourse(course);
                  setLessonTitle("");
                }}
                className={`p-4 rounded-2xl border bg-white dark:bg-[#18181c] flex gap-4 cursor-pointer transition-all hover:border-slate-350 dark:hover:border-slate-800 shadow-xs ${
                  selectedCourse?.id === course.id ? "border-[#0055ff] ring-1 ring-[#0055ff]/10" : "border-card-border"
                }`}
              >
                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-card-border/40">
                  <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                </div>

                <div className="flex-grow space-y-1.5 min-w-0">
                  <div className="flex justify-between items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      course.published 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                    }`}>
                      {course.published ? "Published" : "Draft"}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCourse(course.id, course.title);
                      }}
                      className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-xs font-black text-slate-800 dark:text-white truncate leading-none">
                    {course.title}
                  </h4>
                  <p className="text-[10px] text-slate-450 dark:text-slate-500 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Dynamic Lesson and Media Editor */}
        <div className="lg:col-span-6">
          {selectedCourse ? (
            <div className="p-6 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs space-y-6">
              
              {/* Header metadata */}
              <div className="flex justify-between items-start pb-4 border-b border-card-border/40">
                <div>
                  <h3 className="text-xs font-black text-slate-800 dark:text-white leading-none">
                    Edit: {selectedCourse.title}
                  </h3>
                  <p className="text-[9px] text-slate-400 mt-1">ID: {selectedCourse.id}</p>
                </div>
                <div className="flex items-center gap-1.5 select-none">
                  <button
                    onClick={() => setSelectedCourse({ ...selectedCourse, published: !selectedCourse.published })}
                    className={`px-3 py-1.5 flex items-center gap-1 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      selectedCourse.published
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                    }`}
                  >
                    {selectedCourse.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{selectedCourse.published ? "Published" : "Draft"}</span>
                  </button>

                  <button
                    onClick={handleUpdateCourse}
                    className="p-1.5 rounded-lg bg-[#0055ff] hover:bg-[#0044dd] text-white cursor-pointer"
                    title="Save all changes"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Course Info Fields */}
              <div className="space-y-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Edit Title</label>
                  <input
                    type="text"
                    value={selectedCourse.title}
                    onChange={(e) => setSelectedCourse({ ...selectedCourse, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Edit Description</label>
                  <textarea
                    value={selectedCourse.description}
                    onChange={(e) => setSelectedCourse({ ...selectedCourse, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Lesson checklists manager */}
              <div className="space-y-4 border-t border-card-border/40 pt-5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Course Curriculum</span>
                  {!isCreatingLesson && !isEditingLesson && (
                    <button
                      onClick={() => {
                        setLessonTitle("");
                        setLessonDesc("");
                        setLessonVideoUrl("");
                        setLessonPdfUrl("");
                        setLessonDuration("");
                        setIsCreatingLesson(true);
                      }}
                      className="px-3 py-1.5 bg-[#0055ff] hover:bg-[#0044dd] text-white text-[10px] font-bold rounded-lg cursor-pointer"
                    >
                      + Add New Lesson
                    </button>
                  )}
                </div>

                {/* Create/Edit Lesson form inline container */}
                {(isCreatingLesson || isEditingLesson) && (
                  <form onSubmit={isEditingLesson ? handleSaveEditedLesson : handleCreateLesson} className="p-4 rounded-xl border border-card-border/60 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
                    <h4 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-wider">
                      {isEditingLesson ? "Modify Lesson Details" : "Add New Course Lesson"}
                    </h4>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Lesson Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Lesson 1: Introduction to Mechanics"
                        value={lessonTitle}
                        onChange={(e) => setLessonTitle(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-[#18181c] border border-card-border text-slate-800 dark:text-slate-250 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Description (Optional)</label>
                      <textarea
                        placeholder="Provide details about what students will learn..."
                        value={lessonDesc}
                        onChange={(e) => setLessonDesc(e.target.value)}
                        rows={2}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-[#18181c] border border-card-border text-slate-800 dark:text-slate-250 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Video URL (YouTube/Vimeo/Loom/MP4)</label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={lessonVideoUrl}
                          onChange={(e) => setLessonVideoUrl(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-[#18181c] border border-card-border text-slate-800 dark:text-slate-250 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">PDF Slides / Guides Link</label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={lessonPdfUrl}
                          onChange={(e) => setLessonPdfUrl(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-[#18181c] border border-card-border text-slate-800 dark:text-slate-250 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Estimated Duration (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. 15 mins"
                        value={lessonDuration}
                        onChange={(e) => setLessonDuration(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-[#18181c] border border-card-border text-slate-800 dark:text-slate-250 focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#0055ff] hover:bg-[#0044dd] text-white text-[10px] font-bold rounded-lg cursor-pointer"
                      >
                        {isEditingLesson ? "Save Changes" : "Create Lesson"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingLesson(false);
                          setIsEditingLesson(false);
                          setEditingLessonId(null);
                        }}
                        className="px-4 py-2 border border-card-border hover:bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Lesson rows list */}
                {!isCreatingLesson && !isEditingLesson && (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1 scrollbar-thin divide-y divide-card-border/30">
                    {lessons.length === 0 ? (
                      <p className="text-[10px] text-slate-400 font-semibold py-8 text-center">No lessons added yet. Click &quot;+ Add New Lesson&quot; to begin building this course.</p>
                    ) : (
                      lessons.map((lesson, idx) => (
                        <div key={lesson.id} className="py-3 flex justify-between items-center gap-3 first:pt-0 text-left">
                          <div className="min-w-0 flex-grow">
                            <h5 className="text-xs font-bold text-slate-800 dark:text-white truncate">
                              {idx + 1}. {lesson.title}
                            </h5>
                            <div className="flex items-center gap-2 mt-1 text-[9px] font-medium text-slate-400">
                              {lesson.duration && <span>⏱ {lesson.duration}</span>}
                              {lesson.video_url && <span className="text-[#0055ff]">▶ Video loaded</span>}
                              {lesson.pdf_url && <span className="text-emerald-500">📄 PDF loaded</span>}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {/* Reordering buttons */}
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveLesson(idx, "up")}
                              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                              title="Move lesson up"
                            >
                              <ArrowUp className="w-3.5 h-3.5 text-slate-500" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === lessons.length - 1}
                              onClick={() => handleMoveLesson(idx, "down")}
                              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                              title="Move lesson down"
                            >
                              <ArrowDown className="w-3.5 h-3.5 text-slate-500" />
                            </button>

                            {/* Edit button */}
                            <button
                              type="button"
                              onClick={() => handleStartEditLesson(lesson)}
                              className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-950/20 text-[#0055ff] cursor-pointer"
                              title="Edit lesson details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 cursor-pointer"
                              title="Delete lesson"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-card-border/60 bg-white dark:bg-[#18181c] rounded-2xl text-slate-400 py-16 space-y-2">
              <Layers className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold">Select a course in the dynamic curriculum grid to edit module lessons, details, and attachments.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
