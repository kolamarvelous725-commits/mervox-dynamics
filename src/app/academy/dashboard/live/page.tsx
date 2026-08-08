"use client";

import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { AcademyDB } from "@/utils/academyDb";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Video, Calendar, Clock, ExternalLink, Play, ArrowRight, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LiveClassesPage() {
  const { student } = useAcademyAuth();
  const userId = student?.id || "";
  const router = useRouter();

  const [coursesEnrolled, setCoursesEnrolled] = useState(0);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [pastRecordings, setPastRecordings] = useState<any[]>([]);

  const getThumbnailForCourse = (courseId: string) => {
    if (courseId === "forex-trading") return "/course-forex-v3.webp";
    if (courseId === "ai-automation") return "/course-ai-v3.webp";
    if (courseId === "web-dev") return "/course-webdev-v3.webp";
    return "/course-youtube-v3.webp";
  };

  useEffect(() => {
    if (userId) {
      const progress = AcademyDB.getProgress(userId);
      setCoursesEnrolled(progress.length);
      
      const enrolledCourseIds = progress.map((p) => p.courseId);
      const allSessions = AcademyDB.getLiveClasses().filter((s: any) => {
        const cId = s.course_id || s.courseId;
        return enrolledCourseIds.includes(cId);
      });
      const now = new Date();
      
      const upcoming: any[] = [];
      const past: any[] = [];
      
      allSessions.forEach((s: any) => {
        let isPast = false;
        try {
          const cleanDateStr = s.date.replace(/BST|EST|GMT/i, "").trim();
          const sessionDate = new Date(cleanDateStr);
          if (sessionDate < now) {
            isPast = true;
          }
        } catch {
          // default false
        }

        const item = {
          id: s.id,
          title: s.title,
          courseId: s.course_id || s.courseId,
          instructor: s.instructor,
          date: s.date,
          time: s.time,
          link: s.link,
          thumbnail: getThumbnailForCourse(s.course_id || s.courseId),
          duration: "1h 30m"
        };

        if (isPast) {
          past.push(item);
        } else {
          upcoming.push(item);
        }
      });

      setUpcomingClasses(upcoming);
      setPastRecordings(past.length > 0 ? past : allSessions.map(s => ({
        id: s.id,
        title: s.title,
        courseId: s.course_id || s.courseId,
        instructor: s.instructor,
        date: s.date,
        time: s.time,
        link: s.link,
        thumbnail: getThumbnailForCourse(s.course_id || s.courseId),
        duration: "1h 30m"
      })));

      const viewedLiveKey = `mervox_academy_viewed_live_${userId}`;
      const activeIds = allSessions.map((s: any) => s.id);
      localStorage.setItem(viewedLiveKey, JSON.stringify(activeIds));
    }
  }, [userId]);

  const handleJoinClass = (title: string) => {
    alert(`Launching live mentoring session stream:\n"${title}"\n\nConnecting to Zoom portal...`);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Mentorship Portal</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Live Mentoring Sessions</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2 md:mt-0 leading-relaxed font-semibold">
          Join active live mentoring streams, interact with industry professionals, and watch past recordings.
        </p>
      </div>

      {coursesEnrolled === 0 ? (
        /* Empty State */
        <div className="p-8 text-center bg-white dark:bg-[#18181c] border border-card-border/60 rounded-3xl space-y-4 max-w-xl mx-auto my-12">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-card-border flex items-center justify-center mx-auto">
            <Video className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-heading font-bold text-slate-800 dark:text-white">No Enrolled Courses</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              You must enroll in at least one program to view and unlock live classes.
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
        /* Mentorship Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
          
          {/* Left Column: Live sessions roster */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-sm font-heading font-black text-slate-800 dark:text-white uppercase tracking-wider">
              Upcoming Mentoring Streams
            </h3>

            <div className="space-y-4">
              {upcomingClasses.length === 0 ? (
                <div className="p-6 text-center border border-card-border/60 bg-white dark:bg-[#18181c] rounded-2xl text-xs text-slate-500 font-semibold select-none">
                  No upcoming mentoring streams scheduled.
                </div>
              ) : (
                upcomingClasses.map((session) => (
                  <div
                    key={session.id}
                    className="p-5 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] flex flex-col md:flex-row items-start md:items-center gap-5 shadow-xs transition-all hover:border-slate-350 dark:hover:border-slate-800"
                  >
                    <div className="relative w-full md:w-36 aspect-video rounded-xl overflow-hidden shrink-0 border border-card-border/40 bg-slate-100 dark:bg-slate-900">
                      <Image src={session.thumbnail} alt={session.title} fill className="object-cover" />
                    </div>
                    
                    <div className="space-y-2 flex-grow">
                      <div className="flex gap-2 items-center">
                        <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-955/20 dark:text-red-400 animate-pulse">
                          Upcoming
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{session.instructor}</span>
                      </div>
                      <h4 className="text-sm font-heading font-black text-slate-800 dark:text-white leading-snug">
                        {session.title}
                      </h4>
                      <div className="flex flex-wrap gap-4 text-[10px] text-slate-450 dark:text-slate-450 font-bold uppercase tracking-wide">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {session.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {session.time}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleJoinClass(session.title)}
                      className="w-full md:w-auto px-5 py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all cursor-pointer shadow-xs shrink-0 self-stretch md:self-auto"
                    >
                      <span>Join Session</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Past Recordings */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <h3 className="text-sm font-heading font-black text-slate-800 dark:text-white uppercase tracking-wider">
              Past Recordings
            </h3>

            <div className="space-y-4">
              {pastRecordings.length === 0 ? (
                <div className="p-6 text-center border border-card-border/60 bg-white dark:bg-[#18181c] rounded-2xl text-xs text-slate-500 font-semibold select-none">
                  No past recordings available.
                </div>
              ) : (
                pastRecordings.map((rec) => (
                  <div
                    key={rec.id}
                    className="rounded-2xl border border-card-border bg-white dark:bg-[#18181c] overflow-hidden flex flex-col shadow-xs"
                  >
                    <div className="relative w-full aspect-video bg-slate-100 dark:bg-slate-900 border-b border-card-border/40 overflow-hidden flex items-center justify-center group">
                      <Image src={rec.thumbnail} alt={rec.title} fill className="object-cover" />
                      <button
                        onClick={() => handleJoinClass(rec.title)}
                        className="absolute w-12 h-12 rounded-full bg-white/90 text-blue-600 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 active:scale-95 cursor-pointer border-none"
                      >
                        <Play className="w-5 h-5 fill-blue-600 text-blue-600 translate-x-0.5" />
                      </button>
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-900/80 text-white">
                        {rec.duration}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-snug line-clamp-2">
                        {rec.title}
                      </h4>
                      <span className="text-[9px] text-slate-400 font-semibold block">{rec.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
