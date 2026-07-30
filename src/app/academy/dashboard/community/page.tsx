"use client";

import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { AcademyDB } from "@/utils/academyDb";
import { useState, useEffect } from "react";
import { Users, Send, Heart, MessageSquare, BookOpen, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CommunityPost {
  id: string;
  userName: string;
  userInitials: string;
  userAvatar?: string;
  courseTag?: string;
  content: string;
  date: string;
  likes: number;
  commentsCount: number;
  hasLiked?: boolean;
}

export default function CommunityPage() {
  const { student } = useAcademyAuth();
  const userId = student?.id || "";
  const router = useRouter();

  const [coursesEnrolled, setCoursesEnrolled] = useState(0);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPostContent, setNewPostContent] = useState("");

  const staticPosts: CommunityPost[] = [
    {
      id: "post-1",
      userName: "Marvelous Kolade",
      userInitials: "MK",
      courseTag: "AI Automation",
      content: "Just finalized my first lead-gen automation flow on Make.com connecting Google Sheets to ChatGPT! The productivity boost is absolutely insane. Highly recommend the automation blueprint download in resources.",
      date: "2 hours ago",
      likes: 12,
      commentsCount: 3,
    },
    {
      id: "post-2",
      userName: "Alice Smith",
      userInitials: "AS",
      courseTag: "Forex Trading",
      content: "Caught a beautiful 45 pip buy setup on GBP/USD this morning using support & resistance levels we marked in yesterday's live session! Risk management plan followed perfectly.",
      date: "5 hours ago",
      likes: 8,
      commentsCount: 1,
    },
    {
      id: "post-3",
      userName: "JPForex Mentor",
      userInitials: "JP",
      courseTag: "Mentor Update",
      content: "Great work to everyone who joined the live trading stream today. Remember to study your positions, watch the daily candles, and never trade with leverage beyond your limits.",
      date: "Yesterday",
      likes: 24,
      commentsCount: 5,
    },
  ];

  useEffect(() => {
    if (userId) {
      const progress = AcademyDB.getProgress(userId);
      setCoursesEnrolled(progress.length);

      // Load post databases
      const savedKey = "mervox_academy_posts";
      const saved = localStorage.getItem(savedKey);
      if (saved) {
        setPosts(JSON.parse(saved));
      } else {
        localStorage.setItem(savedKey, JSON.stringify(staticPosts));
        setPosts(staticPosts);
      }
    }
  }, [userId]);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const savedKey = "mervox_academy_posts";
    const newPost: CommunityPost = {
      id: Math.random().toString(36).substring(2, 9),
      userName: student ? `${student.firstName} ${student.lastName}` : "Guest Student",
      userInitials: `${student?.firstName.charAt(0)}${student?.lastName.charAt(0)}`.toUpperCase(),
      userAvatar: student?.avatarUrl || undefined,
      courseTag: "General Discussion",
      content: newPostContent.trim(),
      date: "Just now",
      likes: 0,
      commentsCount: 0,
    };

    const updated = [newPost, ...posts];
    localStorage.setItem(savedKey, JSON.stringify(updated));
    setPosts(updated);
    setNewPostContent("");

    // Log activity
    AcademyDB.logActivity(userId, "lesson", `Posted an update in community`);
  };

  const handleLike = (id: string) => {
    const savedKey = "mervox_academy_posts";
    const updated = posts.map((post) => {
      if (post.id === id) {
        const hasLiked = !post.hasLiked;
        return {
          ...post,
          hasLiked,
          likes: hasLiked ? post.likes + 1 : post.likes - 1,
        };
      }
      return post;
    });

    localStorage.setItem(savedKey, JSON.stringify(updated));
    setPosts(updated);
  };

  const getInitials = (first = "", last = "") => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Student Forum</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Academy Community</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2 md:mt-0 leading-relaxed font-semibold">
          Discuss coursework, exchange automation concepts, and pair program with classmates globally.
        </p>
      </div>

      {coursesEnrolled === 0 ? (
        /* Empty State */
        <div className="p-8 text-center bg-white dark:bg-[#18181c] border border-card-border/60 rounded-3xl space-y-4 max-w-xl mx-auto my-12">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-card-border flex items-center justify-center mx-auto">
            <Users className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-heading font-bold text-slate-800 dark:text-white">No Enrolled Courses</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              You must enroll in courses to join and engage with the student forum community.
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
        /* Content List Forum */
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Post Creation Form */}
          <div className="p-5 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs text-left">
            <form onSubmit={handlePostSubmit} className="space-y-4">
              <div className="flex gap-4">
                <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-blue-50/70 dark:bg-slate-800 flex items-center justify-center shrink-0 font-heading font-black text-[11px] text-[#0055ff] border border-card-border/60">
                  {student?.avatarUrl ? (
                    <Image src={student.avatarUrl} alt="Avatar" fill className="object-cover" />
                  ) : (
                    getInitials(student?.firstName, student?.lastName)
                  )}
                </div>
                
                <textarea
                  placeholder="Share what you are building or studying today..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={2}
                  className="w-full py-1 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-450 bg-transparent focus:outline-none resize-none"
                  required
                />
              </div>
              
              <div className="border-t border-card-border/40 pt-3 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-[#0055ff] hover:bg-[#0044dd] text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Update</span>
                </button>
              </div>
            </form>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-5 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs space-y-4 text-left"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-blue-50/70 dark:bg-slate-800 flex items-center justify-center font-heading font-black text-xs text-[#0055ff] border border-card-border/60">
                      {post.userAvatar ? (
                        <Image src={post.userAvatar} alt="Avatar" fill className="object-cover" />
                      ) : (
                        post.userInitials
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-none">
                        {post.userName}
                      </h4>
                      <span className="text-[9px] text-slate-400 font-semibold block mt-1.5">
                        {post.date}
                      </span>
                    </div>
                  </div>

                  {post.courseTag && (
                    <span className="px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-blue-50 text-[#0055ff] dark:bg-blue-950/20 dark:text-blue-400">
                      {post.courseTag}
                    </span>
                  )}
                </div>

                {/* Content */}
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                  {post.content}
                </p>

                {/* Actions */}
                <div className="border-t border-card-border/40 pt-3.5 flex items-center gap-6 text-[10px] text-slate-450 dark:text-slate-400 font-extrabold uppercase tracking-wide">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 cursor-pointer bg-transparent border-none ${
                      post.hasLiked ? "text-red-500 font-black" : "hover:text-slate-700 dark:hover:text-white"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.hasLiked ? "fill-red-500 text-red-500" : ""}`} />
                    <span>{post.likes} Likes</span>
                  </button>

                  <button
                    onClick={() => alert("Comment thread is simulated in the MVP portal.")}
                    className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-white cursor-pointer bg-transparent border-none"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.commentsCount} Comments</span>
                  </button>

                  <button
                    onClick={() => alert("Sharing features are simulated.")}
                    className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-white cursor-pointer bg-transparent border-none ml-auto"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
