"use client";

import { AcademyDB } from "@/utils/academyDb";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, Calendar, Clock, Link as LinkIcon, User, X, Film, Video } from "lucide-react";

interface LiveClass {
  id: string;
  courseId: string;
  title: string;
  description: string;
  instructor: string;
  date: string;
  time: string;
  link: string;
}

export default function AdminLiveClassesPage() {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<LiveClass | null>(null);
  
  // Modal toggle states
  const [isCreating, setIsCreating] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);

  // Form states
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [instructor, setInstructor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [link, setLink] = useState("");
  const [courseId, setCourseId] = useState("");

  const loadData = () => {
    setClasses(AcademyDB.getLiveClasses());
    setCourses(AcademyDB.getCourses());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !instructor.trim() || !date.trim()) return;

    const newClass: LiveClass = {
      id: "live-" + Math.random().toString(36).substring(2, 9),
      courseId: courseId || "forex-trading",
      title: title.trim(),
      description: desc.trim(),
      instructor: instructor.trim(),
      date: date.trim(),
      time: time.trim() || "17:00 BST",
      link: link.trim() || "https://zoom.us/j/mock",
    };

    const updated = [...classes, newClass];
    AcademyDB.saveLiveClasses(updated);
    setClasses(updated);

    // Reset and close
    setTitle("");
    setDesc("");
    setInstructor("");
    setDate("");
    setTime("");
    setLink("");
    setIsCreating(false);
  };

  const handleUpdate = () => {
    if (!selectedClass) return;

    const updated = classes.map((c) => {
      if (c.id === selectedClass.id) {
        return selectedClass;
      }
      return c;
    });

    AcademyDB.saveLiveClasses(updated);
    setClasses(updated);
    alert("Live class details updated and broadcasted to students.");
  };

  const handleDelete = (id: string) => {
    const confirmAct = confirm("Are you sure you want to cancel this scheduled live class session?");
    if (confirmAct) {
      const updated = classes.filter((c) => c.id !== id);
      AcademyDB.saveLiveClasses(updated);
      setClasses(updated);
      if (selectedClass?.id === id) {
        setSelectedClass(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Broadcast Scheduler</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Live Classes</h2>
        </div>
        <button
          onClick={() => {
            setCourseId(courses[0]?.id || "");
            setIsCreating(true);
          }}
          className="px-5 py-2.5 bg-[#0055ff] hover:bg-[#0044dd] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 self-start md:self-auto mt-3 md:mt-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Live Session</span>
        </button>
      </div>

      {/* Creation Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#18181c] w-full max-w-md rounded-[24px] border border-card-border/60 shadow-2xl p-6 space-y-4 text-left">
            <h3 className="text-base font-heading font-black text-slate-850 dark:text-white">Schedule Live Session</h3>
            
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Course Tag</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wide block">Session Title</label>
                <input
                  type="text"
                  placeholder="e.g. Risk Management Analysis Review"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wide block">Session Description</label>
                <textarea
                  placeholder="Focus topics, prerequisite chapters..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wide block">Instructor</label>
                  <input
                    type="text"
                    placeholder="Instructor Name"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wide block">Date</label>
                  <input
                    type="text"
                    placeholder="e.g., August 12, 2026"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wide block">Time</label>
                  <input
                    type="text"
                    placeholder="e.g., 18:00 BST"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wide block">Meeting Link</label>
                  <input
                    type="text"
                    placeholder="https://zoom.us/j/..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0055ff] hover:bg-[#0044dd] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Create
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

      {/* Main grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Left Column: Scheduled Classes checklist */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Scheduled Sessions</h3>

          <div className="space-y-3">
            {classes.length === 0 ? (
              <p className="text-xs text-slate-450 font-semibold py-8 text-center bg-white dark:bg-[#18181c] border border-card-border/60 rounded-2xl">
                No active live sessions scheduled.
              </p>
            ) : (
              classes.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedClass(c)}
                  className={`p-4 rounded-2xl border bg-white dark:bg-[#18181c] flex items-center justify-between gap-4 cursor-pointer transition-all hover:border-slate-350 dark:hover:border-slate-800 shadow-xs ${
                    selectedClass?.id === c.id ? "border-[#0055ff]" : "border-card-border"
                  }`}
                >
                  <div className="space-y-1.5 min-w-0">
                    <h4 className="text-xs font-black text-slate-800 dark:text-white truncate">
                      {c.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-450 font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {c.instructor}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {c.date}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(c.id);
                    }}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 cursor-pointer shrink-0 border-none bg-transparent"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Form editor */}
        <div className="lg:col-span-6">
          {selectedClass ? (
            <div className="p-6 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs space-y-5">
              <div className="flex justify-between items-start pb-3 border-b border-card-border/40">
                <div>
                  <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase">
                    Session Audit
                  </h3>
                  <p className="text-[9px] text-slate-400 mt-1">ID: {selectedClass.id}</p>
                </div>
                
                <button
                  onClick={handleUpdate}
                  className="p-2 bg-[#0055ff] hover:bg-[#0044dd] text-white rounded-lg shadow-sm cursor-pointer"
                  title="Save updates"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>

              {/* Form editing details */}
              <div className="space-y-4 text-xs">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Session Title</label>
                  <input
                    type="text"
                    value={selectedClass.title}
                    onChange={(e) => setSelectedClass({ ...selectedClass, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Session Description</label>
                  <textarea
                    value={selectedClass.description || ""}
                    onChange={(e) => setSelectedClass({ ...selectedClass, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Instructor</label>
                    <input
                      type="text"
                      value={selectedClass.instructor}
                      onChange={(e) => setSelectedClass({ ...selectedClass, instructor: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Date</label>
                    <input
                      type="text"
                      value={selectedClass.date}
                      onChange={(e) => setSelectedClass({ ...selectedClass, date: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Time</label>
                    <input
                      type="text"
                      value={selectedClass.time}
                      onChange={(e) => setSelectedClass({ ...selectedClass, time: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Meeting Link</label>
                    <input
                      type="text"
                      value={selectedClass.link}
                      onChange={(e) => setSelectedClass({ ...selectedClass, link: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-850 dark:text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-card-border/60 bg-white dark:bg-[#18181c] rounded-2xl text-slate-400 py-16 space-y-2 select-none">
              <Film className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold">Select a live class session card from the roster to edit metadata schedules.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
