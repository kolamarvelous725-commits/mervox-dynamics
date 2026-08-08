"use client";

import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { AcademyDB } from "@/utils/academyDb";
import { supabase, isSupabaseConfigured } from "@/utils/supabaseClient";
import { useState, useEffect } from "react";
import { Download, FileText, FileArchive, Search, BookOpen, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface DownloadItem {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  fileName: string;
  fileSize: string;
  fileType: "pdf" | "zip" | "sheet";
}

export default function DownloadsPage() {
  const { student } = useAcademyAuth();
  const userId = student?.id || "";
  const router = useRouter();

  const [coursesEnrolled, setCoursesEnrolled] = useState(0);
  const [downloadsList, setDownloadsList] = useState<DownloadItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const templates: DownloadItem[] = [
    {
      id: "dl-forex-pdf",
      courseId: "forex-trading",
      courseTitle: "Forex Trading Masterclass",
      title: "Forex Trading Complete Course Handbook",
      fileName: "Forex_Trading_Masterclass_Handbook.pdf",
      fileSize: "12.4 MB",
      fileType: "pdf",
    },
    {
      id: "dl-ai-pdf",
      courseId: "ai-automation",
      courseTitle: "AI & Business Automation",
      title: "AI & Business Automation Complete Integration Guide",
      fileName: "AI_Business_Automation_Integration_Guide.pdf",
      fileSize: "6.8 MB",
      fileType: "pdf",
    },
    {
      id: "dl-web-pdf",
      courseId: "web-dev",
      courseTitle: "Web & Software Development",
      title: "Fullstack Web & Software Development Complete Coursebook",
      fileName: "Web_Software_Development_Coursebook.pdf",
      fileSize: "18.2 MB",
      fileType: "pdf",
    },
    {
      id: "dl-youtube-pdf",
      courseId: "youtube-monetization",
      courseTitle: "YouTube Algorithm Monetization",
      title: "YouTube Algorithm Monetization Complete Strategy Bible",
      fileName: "YouTube_Monetization_Strategy_Bible.pdf",
      fileSize: "5.5 MB",
      fileType: "pdf",
    },
  ];

  const loadDownloads = async () => {
    if (!userId) return;

    try {
      if (!isSupabaseConfigured) {
        const progress = AcademyDB.getProgress(userId);
        setCoursesEnrolled(progress.length);
        const activeIds = progress.map((p) => p.courseId);
        const filtered = templates.filter((item) => activeIds.includes(item.courseId));
        setDownloadsList(filtered);
        return;
      }

      const { data: enrolls } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("user_id", userId);

      const activeIds = enrolls?.map((e: any) => e.course_id) || [];
      setCoursesEnrolled(activeIds.length);
      const filtered = templates.filter((item) => activeIds.includes(item.courseId));
      setDownloadsList(filtered);
    } catch (err) {
      console.error("Failed to load downloads:", err);
    }
  };

  useEffect(() => {
    loadDownloads();

    if (isSupabaseConfigured && userId) {
      const channel = supabase
        .channel("student_downloads_sync_" + userId)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "enrollments", filter: `user_id=eq.${userId}` },
          () => {
            loadDownloads();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userId]);

  const handleDownload = (fileName: string) => {
    alert(`Downloading "${fileName}"...\nYour handbook is being prepared.`);
  };

  const filteredDownloads = downloadsList.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Resource Vault</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Resource Downloads</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2 md:mt-0 leading-relaxed font-semibold">
          Access supplementary learning assets, guides, formulas, spreadsheets, and developer templates.
        </p>
      </div>

      {coursesEnrolled === 0 ? (
        /* Empty State */
        <div className="p-8 text-center bg-white dark:bg-[#18181c] border border-card-border/60 rounded-3xl space-y-4 max-w-xl mx-auto my-12">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-card-border flex items-center justify-center mx-auto">
            <Download className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-heading font-bold text-slate-800 dark:text-white">No Enrolled Courses</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              You must enroll in courses to access and download program study materials.
            </p>
          </div>
          <button
            onClick={() => router.push("/academy/dashboard/courses")}
            className="px-6 py-2.5 bg-[#0055ff] hover:bg-[#0044dd] text-white text-xs font-bold rounded-xl shadow-xs transition-all duration-200 cursor-pointer"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        /* Content List */
        <div className="max-w-4xl mx-auto space-y-4 text-left">
          
          {/* Search bar inside downloads */}
          <div className="relative w-full max-w-md pb-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Search downloads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white dark:bg-[#18181c] border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
            />
          </div>

          {filteredDownloads.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#18181c] border border-card-border/60 rounded-3xl space-y-2">
              <AlertCircle className="w-5 h-5 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">No resources found matching "{searchQuery}"</p>
            </div>
          ) : (
            filteredDownloads.map((item) => {
              const isPdf = item.fileType === "pdf";
              const isZip = item.fileType === "zip";

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xs hover:border-slate-350 dark:hover:border-slate-800 transition-all"
                >
                  <div className="flex items-center gap-4 flex-grow text-left">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      isPdf 
                        ? 'bg-red-50 text-red-500 dark:bg-red-950/20' 
                        : isZip 
                          ? 'bg-blue-50 text-blue-500 dark:bg-blue-950/20' 
                          : 'bg-emerald-50 text-emerald-500 dark:bg-emerald-950/20'
                    }`}>
                      {isZip ? <FileArchive className="w-5.5 h-5.5" /> : <FileText className="w-5.5 h-5.5" />}
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                        {item.courseTitle}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-450 font-semibold leading-none">
                        File: {item.fileName} • {item.fileSize}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(item.fileName)}
                    className="px-4 py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold rounded-xl border border-card-border bg-slate-50 hover:bg-[#0055ff] dark:bg-slate-900 dark:hover:bg-[#0055ff] text-slate-700 hover:text-white dark:text-slate-200 transition-all cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
}
