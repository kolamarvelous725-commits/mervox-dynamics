"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Play, FileText, Upload, Save, ArrowRight, Eye, EyeOff, X, HelpCircle, Layers } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/utils/supabaseClient";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  lessons: string[];
  published: boolean;
  videos?: string[];
  pdfs?: string[];
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Creation form states
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newThumb, setNewThumb] = useState("/course-forex-v3.webp");

  // Lesson form state
  const [newLessonName, setNewLessonName] = useState("");
  // Media uploads states
  const [uploadedVideo, setUploadedVideo] = useState("");
  const [uploadedPdf, setUploadedPdf] = useState("");

  const loadData = async () => {
    try {
      const { data, error } = await supabase
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
            lessons: c.lessons || [],
            published: c.published,
            videos: c.videos || [],
            pdfs: c.pdfs || [],
          }))
        );
      }
    } catch (err) {
      console.error("Exception loading courses:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newId = newTitle.toLowerCase().replace(/\s+/g, "-");
    try {
      const { error } = await supabase.from("courses").insert({
        id: newId,
        title: newTitle.trim(),
        description: newDesc.trim(),
        thumbnail: newThumb,
        lessons: ["Lesson 1: Introduction to Program Foundations"],
        published: false,
        total_lessons: 1,
        videos: [],
        pdfs: [],
      });

      if (error) {
        alert(`Failed to create course: ${error.message}`);
      } else {
        loadData();
        // Reset fields
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
      const { error } = await supabase
        .from("courses")
        .update({
          title: selectedCourse.title.trim(),
          description: selectedCourse.description.trim(),
          thumbnail: selectedCourse.thumbnail,
          lessons: selectedCourse.lessons,
          published: selectedCourse.published,
          total_lessons: selectedCourse.lessons?.length || 0,
          videos: selectedCourse.videos || [],
          pdfs: selectedCourse.pdfs || [],
        })
        .eq("id", selectedCourse.id);

      if (error) {
        alert(`Failed to save course updates: ${error.message}`);
      } else {
        loadData();
        alert("Course updates saved and synced successfully!");
      }
    } catch (err) {
      console.error("Exception updating course:", err);
    }
  };

  const handleDeleteCourse = async (id: string, name: string) => {
    const confirmAct = confirm(`WARNING: Are you sure you want to permanently DELETE course "${name}"?\nAll student enrollments progress will be affected.`);
    if (confirmAct) {
      try {
        const { error } = await supabase
          .from("courses")
          .delete()
          .eq("id", id);

        if (error) {
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

  const handleAddLesson = () => {
    if (!selectedCourse || !newLessonName.trim()) return;

    const lessons = [...(selectedCourse.lessons || [])];
    lessons.push(newLessonName.trim());

    setSelectedCourse({
      ...selectedCourse,
      lessons,
    });
    setNewLessonName("");
  };

  const handleDeleteLesson = (index: number) => {
    if (!selectedCourse) return;

    const lessons = (selectedCourse.lessons || []).filter((_, idx) => idx !== index);
    setSelectedCourse({
      ...selectedCourse,
      lessons,
    });
  };

  const handleUploadVideo = () => {
    if (!selectedCourse || !uploadedVideo.trim()) return;
    const videos = [...(selectedCourse.videos || [])];
    videos.push(uploadedVideo.trim());
    setSelectedCourse({ ...selectedCourse, videos });
    setUploadedVideo("");
  };

  const handleUploadPdf = () => {
    if (!selectedCourse || !uploadedPdf.trim()) return;
    const pdfs = [...(selectedCourse.pdfs || [])];
    pdfs.push(uploadedPdf.trim());
    setSelectedCourse({ ...selectedCourse, pdfs });
    setUploadedPdf("");
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
                  setNewLessonName("");
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

              {/* Lesson checklists manager */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Lessons List</span>
                
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter lesson title..."
                    value={newLessonName}
                    onChange={(e) => setNewLessonName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                  <button
                    onClick={handleAddLesson}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer shrink-0"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin divide-y divide-card-border/30">
                  {(!selectedCourse.lessons || selectedCourse.lessons.length === 0) ? (
                    <p className="text-[10px] text-slate-400 font-semibold py-4 text-center">No lessons added yet.</p>
                  ) : (
                    selectedCourse.lessons.map((lesson, idx) => (
                      <div key={idx} className="py-2.5 flex justify-between items-center gap-3 first:pt-0">
                        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-350 truncate">
                          {lesson}
                        </span>
                        <button
                          onClick={() => handleDeleteLesson(idx)}
                          className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer shrink-0 border-none bg-transparent"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Simulated media uploads: Videos and PDFs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-card-border/40 pt-4">
                
                {/* Videos */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Videos List</span>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Video URL or Name"
                      value={uploadedVideo}
                      onChange={(e) => setUploadedVideo(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-[10px] rounded-lg bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-850 dark:text-slate-200 focus:outline-none"
                    />
                    <button
                      onClick={handleUploadVideo}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-655 cursor-pointer shrink-0 border-none"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1 text-[10px] max-h-24 overflow-y-auto scrollbar-thin">
                    {selectedCourse.videos?.map((v, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-semibold py-1">
                        <Play className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{v}</span>
                      </div>
                    )) || <p className="text-[9px] text-slate-400 py-1 font-semibold">No videos loaded.</p>}
                  </div>
                </div>

                {/* PDFs */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">PDF Resources</span>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="PDF Guide URL/Name"
                      value={uploadedPdf}
                      onChange={(e) => setUploadedPdf(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-[10px] rounded-lg bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-855 dark:text-slate-200 focus:outline-none"
                    />
                    <button
                      onClick={handleUploadPdf}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-655 cursor-pointer shrink-0 border-none"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1 text-[10px] max-h-24 overflow-y-auto scrollbar-thin">
                    {selectedCourse.pdfs?.map((p, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-semibold py-1">
                        <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{p}</span>
                      </div>
                    )) || <p className="text-[9px] text-slate-400 py-1 font-semibold">No PDFs loaded.</p>}
                  </div>
                </div>

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
