"use client";

import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { AcademyDB } from "@/utils/academyDb";
import { useState, useEffect } from "react";
import { Users, Send, Heart, MessageSquare, BookOpen, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Comment {
  id: string;
  userName: string;
  userInitials: string;
  content: string;
  date: string;
}

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
  likedBy?: string[];
  comments?: Comment[];
}

export default function CommunityPage() {
  const { student } = useAcademyAuth();
  const router = useRouter();

  const isAdmin = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
  const userId = isAdmin ? "admin-user" : (student?.id || "");

  const formatUserTime = (uId: string) => {
    let timezone = undefined;
    let tzName = "";
    try {
      const usersJson = localStorage.getItem("mervox_academy_users");
      const users = usersJson ? JSON.parse(usersJson) : [];
      const user = users.find((u: any) => u.id === uId);
      const country = user?.country || "";
      
      const countryTimezones: Record<string, string> = {
        "Nigeria": "Africa/Lagos",
        "United Kingdom": "Europe/London",
        "United States": "America/New_York",
        "Canada": "America/Toronto",
        "Germany": "Europe/Berlin",
        "South Africa": "Africa/Johannesburg",
        "Ghana": "Africa/Accra",
        "Kenya": "Africa/Nairobi",
        "India": "Asia/Kolkata",
        "Australia": "Australia/Sydney",
        "United Arab Emirates": "Asia/Dubai",
        "Saudi Arabia": "Asia/Riyadh",
      };

      if (countryTimezones[country]) {
        timezone = countryTimezones[country];
        tzName = countryTimezones[country].split("/")[1].replace("_", " ") + " Time";
      }
    } catch (e) {
      console.error("Error formatting post time:", e);
    }

    const timeFormatted = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone,
    }).format(new Date());

    return tzName ? `${timeFormatted} (${tzName})` : `${timeFormatted} (Local Time)`;
  };

  const [coursesEnrolled, setCoursesEnrolled] = useState(0);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const staticPosts: CommunityPost[] = [
    {
      id: "post-1",
      userName: "Marvelous Kolade",
      userInitials: "MK",
      courseTag: "AI Automation",
      content: "Just finalized my first lead-gen automation flow on Make.com connecting Google Sheets to ChatGPT! The productivity boost is absolutely insane. Highly recommend the automation blueprint download in resources.",
      date: "2 hours ago",
      likes: 12,
      commentsCount: 1,
      likedBy: Array.from({ length: 12 }).map((_, i) => `user-dummy-${i}`),
      comments: [
        {
          id: "c-1",
          userName: "JPForex Mentor",
          userInitials: "JP",
          content: "Excellent work! Make sure you add rate limit controls to prevent Make.com credit depletion.",
          date: "1 hour ago",
        }
      ]
    },
    {
      id: "post-2",
      userName: "Alice Smith",
      userInitials: "AS",
      courseTag: "Forex Trading",
      content: "Caught a beautiful 45 pip buy setup on GBP/USD this morning using support & resistance levels we marked in yesterday's live session! Risk management plan followed perfectly.",
      date: "5 hours ago",
      likes: 8,
      commentsCount: 0,
      likedBy: Array.from({ length: 8 }).map((_, i) => `user-dummy-${i}`),
      comments: [],
    },
    {
      id: "post-3",
      userName: "JPForex Mentor",
      userInitials: "JP",
      courseTag: "Mentor Update",
      content: "Great work to everyone who joined the live trading stream today. Remember to study your positions, watch the daily candles, and never trade with leverage beyond your limits.",
      date: "Yesterday",
      likes: 24,
      commentsCount: 2,
      likedBy: Array.from({ length: 24 }).map((_, i) => `user-dummy-${i}`),
      comments: [
        {
          id: "c-2",
          userName: "Alice Smith",
          userInitials: "AS",
          content: "Thank you for the guidance JP! Watching the 4h candle close makes all the difference.",
          date: "Yesterday",
        },
        {
          id: "c-3",
          userName: "Dave Miller",
          userInitials: "DM",
          content: "Highly value these setups. Look forward to next session.",
          date: "Yesterday",
        }
      ]
    },
  ];

  useEffect(() => {
    if (userId) {
      if (isAdmin) {
        setCoursesEnrolled(1); // Bypass empty state for admin
      } else {
        const progress = AcademyDB.getProgress(userId);
        setCoursesEnrolled(progress.length);
      }

      // Load posts
      const savedKey = "mervox_academy_posts";
      const saved = localStorage.getItem(savedKey);
      let currentPosts = [];
      if (saved) {
        currentPosts = JSON.parse(saved).map((p: any) => {
          if (!p.likedBy) {
            p.likedBy = Array.from({ length: p.likes || 0 }).map((_, i) => `user-dummy-${i}`);
          }
          return p;
        });
        setPosts(currentPosts);
      } else {
        localStorage.setItem(savedKey, JSON.stringify(staticPosts));
        setPosts(staticPosts);
        currentPosts = staticPosts;
      }

      if (!isAdmin) {
        const viewedPostKey = `mervox_academy_viewed_post_${userId}`;
        const activeIds = currentPosts.map((p: any) => p.id);
        localStorage.setItem(viewedPostKey, JSON.stringify(activeIds));
      }
    }
  }, [userId]);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const savedKey = "mervox_academy_posts";
    const authorName = isAdmin ? "Academy Administrator" : (student ? `${student.firstName} ${student.lastName}` : "Guest Student");
    const initials = isAdmin ? "AD" : `${student?.firstName.charAt(0)}${student?.lastName.charAt(0)}`.toUpperCase();

    const newPost: CommunityPost = {
      id: Math.random().toString(36).substring(2, 9),
      userName: authorName,
      userInitials: initials,
      userAvatar: isAdmin ? undefined : (student?.avatarUrl || undefined),
      courseTag: isAdmin ? "Official Update" : "General Discussion",
      content: newPostContent.trim(),
      date: formatUserTime(userId),
      likes: 0,
      commentsCount: 0,
      likedBy: [],
      comments: [],
    };

    const updated = [newPost, ...posts];
    localStorage.setItem(savedKey, JSON.stringify(updated));
    setPosts(updated);
    setNewPostContent("");

    if (!isAdmin) {
      AcademyDB.logActivity(userId, "lesson", `Posted an update in community`);
    }
  };

  const handleLike = (id: string) => {
    if (!userId) return;
    const savedKey = "mervox_academy_posts";
    const updated = posts.map((post) => {
      if (post.id === id) {
        const likedBy = post.likedBy || [];
        const isLiked = likedBy.includes(userId);
        const newLikedBy = isLiked
          ? likedBy.filter((uid) => uid !== userId)
          : [...likedBy, userId];
        
        return {
          ...post,
          likedBy: newLikedBy,
          likes: newLikedBy.length,
        };
      }
      return post;
    });

    localStorage.setItem(savedKey, JSON.stringify(updated));
    setPosts(updated);
  };

  const handleCommentSubmit = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const savedKey = "mervox_academy_posts";
    const authorName = isAdmin ? "Academy Administrator" : (student ? `${student.firstName} ${student.lastName}` : "Guest Student");
    const initials = isAdmin ? "AD" : `${student?.firstName.charAt(0)}${student?.lastName.charAt(0)}`.toUpperCase();

    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      userName: authorName,
      userInitials: initials,
      content: commentText.trim(),
      date: formatUserTime(userId),
    };

    const updated = posts.map((post) => {
      if (post.id === postId) {
        const currentComments = post.comments || [];
        return {
          ...post,
          commentsCount: (post.commentsCount || 0) + 1,
          comments: [...currentComments, newComment],
        };
      }
      return post;
    });

    localStorage.setItem(savedKey, JSON.stringify(updated));
    setPosts(updated);
    setCommentText("");
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
                      (post.likedBy || []).includes(userId) ? "text-red-500 font-black" : "hover:text-slate-700 dark:hover:text-white"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${(post.likedBy || []).includes(userId) ? "fill-red-500 text-red-500" : ""}`} />
                    <span>{(post.likedBy || []).length} Likes</span>
                  </button>

                  <button
                    onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                    className={`flex items-center gap-1.5 cursor-pointer bg-transparent border-none ${
                      expandedPostId === post.id ? "text-[#0055ff] font-black" : "hover:text-slate-700 dark:hover:text-white"
                    }`}
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

                {/* Expanded Comments Thread */}
                {expandedPostId === post.id && (
                  <div className="border-t border-card-border/40 pt-4 mt-4 space-y-4">
                    {/* Comments List */}
                    <div className="space-y-3">
                      {(post.comments || []).length === 0 ? (
                        <p className="text-[11px] text-slate-400 font-semibold italic">No comments yet. Start the conversation!</p>
                      ) : (
                        (post.comments || []).map((comm: any) => (
                          <div key={comm.id} className="flex gap-3 bg-slate-50/50 dark:bg-slate-900/30 p-3 rounded-xl border border-card-border/30">
                            <div className="w-7 h-7 rounded-lg bg-blue-50/70 dark:bg-slate-800 flex items-center justify-center shrink-0 font-heading font-black text-[9px] text-[#0055ff] border border-card-border/60">
                              {comm.userInitials}
                            </div>
                            <div className="space-y-1 text-left">
                              <div className="flex items-center gap-2">
                                <h5 className="text-[11px] font-bold text-slate-800 dark:text-white leading-none">{comm.userName}</h5>
                                <span className="text-[8px] text-slate-400 font-semibold leading-none">{comm.date}</span>
                              </div>
                              <p className="text-[11px] text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">{comm.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Comment Input Form */}
                    <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                        required
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#0055ff] hover:bg-[#0044dd] text-white font-bold text-xs transition-all cursor-pointer shadow-xs border-none"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                )}

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
