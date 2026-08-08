"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Megaphone, Save, Calendar, Tag, X, Info } from "lucide-react";
import { adminSupabase, isSupabaseConfigured } from "@/utils/supabaseClient";
import AcademyDB from "@/utils/academyDb";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  tag: "academic" | "event" | "alert";
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  
  // Creation form toggle
  const [isCreating, setIsCreating] = useState(false);

  // Form inputs states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<"academic" | "event" | "alert">("academic");

  const loadData = async () => {
    try {
      if (!isSupabaseConfigured) {
        const list = AcademyDB.getAnnouncements();
        setAnnouncements(
          list.map((ann: any) => ({
            id: ann.id,
            title: ann.title,
            content: ann.content,
            date: ann.date,
            tag: (ann.category || "academic") as "academic" | "event" | "alert",
          }))
        );
        return;
      }

      const { data, error } = await adminSupabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load announcements:", error);
      } else if (data) {
        setAnnouncements(
          data.map((ann: any) => ({
            id: ann.id,
            title: ann.title,
            content: ann.content,
            date: ann.date,
            tag: (ann.category || "academic") as "academic" | "event" | "alert",
          }))
        );
      }
    } catch (err) {
      console.error("Exception loading announcements:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newId = "ann-" + Math.random().toString(36).substring(2, 9);
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    try {
      if (!isSupabaseConfigured) {
        const list = AcademyDB.getAnnouncements();
        const newAnn = {
          id: newId,
          title: title.trim(),
          content: content.trim(),
          category: tag,
          date: dateStr,
        };
        list.unshift(newAnn);
        localStorage.setItem("mervox_academy_announcements", JSON.stringify(list));
        loadData();
        setTitle("");
        setContent("");
        setTag("academic");
        setIsCreating(false);
        return;
      }

      const { error } = await adminSupabase.from("announcements").insert({
        id: newId,
        title: title.trim(),
        content: content.trim(),
        category: tag,
        date: dateStr,
      });

      if (error) {
        console.error("Supabase Announcements INSERT error:", error);
        alert(`Failed to broadcast announcement (INSERT error): ${error.message}`);
      } else {
        loadData();
        // Reset and close
        setTitle("");
        setContent("");
        setTag("academic");
        setIsCreating(false);
      }
    } catch (err) {
      console.error("Exception creating announcement:", err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedAnnouncement) return;

    try {
      if (!isSupabaseConfigured) {
        const list = AcademyDB.getAnnouncements();
        const updated = list.map((ann) => {
          if (ann.id === selectedAnnouncement.id) {
            return {
              ...ann,
              title: selectedAnnouncement.title.trim(),
              content: selectedAnnouncement.content.trim(),
              category: selectedAnnouncement.tag,
            };
          }
          return ann;
        });
        localStorage.setItem("mervox_academy_announcements", JSON.stringify(updated));
        loadData();
        alert("Announcement updated successfully!");
        return;
      }

      const { error } = await adminSupabase
        .from("announcements")
        .update({
          title: selectedAnnouncement.title.trim(),
          content: selectedAnnouncement.content.trim(),
          category: selectedAnnouncement.tag,
        })
        .eq("id", selectedAnnouncement.id);

      if (error) {
        console.error("Supabase Announcements UPDATE error:", error);
        alert(`Failed to update announcement (UPDATE error): ${error.message}`);
      } else {
        loadData();
        alert("Announcement updated successfully!");
      }
    } catch (err) {
      console.error("Exception updating announcement:", err);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmAct = confirm("Are you sure you want to permanently delete this broadcast announcement?");
    if (confirmAct) {
      try {
        if (!isSupabaseConfigured) {
          const list = AcademyDB.getAnnouncements();
          const filtered = list.filter((ann) => ann.id !== id);
          localStorage.setItem("mervox_academy_announcements", JSON.stringify(filtered));
          loadData();
          if (selectedAnnouncement?.id === id) {
            setSelectedAnnouncement(null);
          }
          return;
        }

        const { error } = await adminSupabase
          .from("announcements")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Supabase Announcements DELETE error:", error);
          alert(`Failed to delete announcement (DELETE error): ${error.message}`);
        } else {
          loadData();
          if (selectedAnnouncement?.id === id) {
            setSelectedAnnouncement(null);
          }
        }
      } catch (err) {
        console.error("Exception deleting announcement:", err);
      }
    }
  };

  const tagColors = {
    academic: "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400",
    event: "bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400",
    alert: "bg-red-50 text-red-700 dark:bg-red-955/20 dark:text-red-400",
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Communication Portal</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Announcements</h2>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-5 py-2.5 bg-[#0055ff] hover:bg-[#0044dd] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 self-start md:self-auto mt-3 md:mt-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Broadcast</span>
        </button>
      </div>

      {/* Creation Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#18181c] w-full max-w-md rounded-[24px] border border-card-border/60 shadow-2xl p-6 space-y-4 text-left">
            <h3 className="text-base font-heading font-black text-slate-850 dark:text-white">Publish Announcement</h3>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Broadcast Title</label>
                <input
                  type="text"
                  placeholder="e.g. Schedule Updates: August Term"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Category Tag</label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value as any)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="academic">Academic (Blue)</option>
                  <option value="event">Event (Purple)</option>
                  <option value="alert">Critical Alert (Red)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Body Content</label>
                <textarea
                  placeholder="Write the announcement description..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none resize-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0055ff] hover:bg-[#0044dd] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Broadcast
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

      {/* Main Grid display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Left Column: Announcements list */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Active Broadcast Feed</h3>

          <div className="space-y-3">
            {announcements.length === 0 ? (
              <p className="text-xs text-slate-450 font-semibold py-8 text-center bg-white dark:bg-[#18181c] border border-card-border/60 rounded-2xl select-none">
                No active announcements broadcasted yet.
              </p>
            ) : (
              announcements.map((ann) => (
                <div
                  key={ann.id}
                  onClick={() => setSelectedAnnouncement(ann)}
                  className={`p-4 rounded-2xl border bg-white dark:bg-[#18181c] flex items-center justify-between gap-4 cursor-pointer transition-all hover:border-slate-350 dark:hover:border-slate-800 shadow-xs ${
                    selectedAnnouncement?.id === ann.id ? "border-[#0055ff]" : "border-card-border"
                  }`}
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${tagColors[ann.tag] || tagColors.academic}`}>
                        {ann.tag}
                      </span>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase">{ann.date}</span>
                    </div>
                    <h4 className="text-xs font-black text-slate-850 dark:text-white truncate">
                      {ann.title}
                    </h4>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(ann.id);
                    }}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer shrink-0 border-none bg-transparent"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Broadcast details editor */}
        <div className="lg:col-span-6">
          {selectedAnnouncement ? (
            <div className="p-6 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs space-y-5">
              <div className="flex justify-between items-start pb-3 border-b border-card-border/40">
                <div>
                  <h3 className="text-xs font-black text-slate-850 dark:text-white uppercase leading-none">
                    Broadcast Inspector
                  </h3>
                  <p className="text-[9px] text-slate-400 mt-1.5 leading-none">ID: {selectedAnnouncement.id}</p>
                </div>
                
                <button
                  onClick={handleUpdate}
                  className="p-2 bg-[#0055ff] hover:bg-[#0044dd] text-white rounded-lg cursor-pointer shadow-sm"
                  title="Save updates"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>

              {/* Edit inputs form */}
              <div className="space-y-4 text-xs">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Broadcast Title</label>
                  <input
                    type="text"
                    value={selectedAnnouncement.title}
                    onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Category Tag</label>
                  <select
                    value={selectedAnnouncement.tag}
                    onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, tag: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="academic">Academic (Blue)</option>
                    <option value="event">Event (Purple)</option>
                    <option value="alert">Critical Alert (Red)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Content Body</label>
                  <textarea
                    value={selectedAnnouncement.content}
                    onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, content: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none resize-none"
                  />
                </div>

              </div>
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-card-border/60 bg-white dark:bg-[#18181c] rounded-2xl text-slate-400 py-16 space-y-2 select-none">
              <Megaphone className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold">Select an active broadcast card from the left feed to modify alert properties.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
