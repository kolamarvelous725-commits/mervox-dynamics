"use client";

import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { AcademyDB } from "@/utils/academyDb";
import { useState, useEffect, useRef } from "react";
import { Send, User, ShieldAlert, Sparkles, MessageCircle, AlertCircle, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/utils/supabaseClient";

interface ChatMessage {
  id: string;
  sender: "student" | "mentor";
  text: string;
  time: string;
}

interface ChatChannel {
  id: string;
  name: string;
  role: string;
  avatarInitials: string;
  avatarBg: string;
  courseId?: string;
  autoResponse: string;
}

export default function MessagesPage() {
  const { student } = useAcademyAuth();
  const userId = student?.id || "";
  const router = useRouter();

  const [coursesEnrolled, setCoursesEnrolled] = useState(0);
  const [activeChannelId, setActiveChannelId] = useState("ai-support");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typedMessage, setTypedMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channels: ChatChannel[] = [
    {
      id: "forex-mentor",
      name: "JPForex Mentor",
      role: "Forex Technical Instructor",
      avatarInitials: "JP",
      avatarBg: "bg-blue-100 text-[#0055ff] dark:bg-blue-950/30 dark:text-blue-400",
      courseId: "forex-trading",
      autoResponse: "Hey there! I am currently analyzing the EUR/USD market setups. I've received your query and will check your chart markups shortly.",
    },
    {
      id: "ai-support",
      name: "AI Automation support",
      role: "Workflow Mentor",
      avatarInitials: "AI",
      avatarBg: "bg-purple-100 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400",
      courseId: "ai-automation",
      autoResponse: "Hello! Thank you for the blueprint link. I am reviewing your Make.com logic error. Let me cross-check the API call parameters and get right back to you.",
    },
    {
      id: "helpdesk",
      name: "General Helpdesk",
      role: "Student Coordinator",
      avatarInitials: "GH",
      avatarBg: "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400",
      autoResponse: "Hello student! We have logged your general administrative ticket. An agent from Mervox Academy support will email you a resolution within 24 hours.",
    },
  ];

  // Check enrollment, load messages
  useEffect(() => {
    if (userId) {
      const progress = AcademyDB.getProgress(userId);
      setCoursesEnrolled(progress.length);

      // Load thread messages from Supabase
      const fetchMessages = async () => {
        try {
          const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("user_id", userId)
            .eq("channel_id", activeChannelId)
            .order("created_at", { ascending: true });

          if (error) {
            console.error("Failed to query Supabase messages:", error);
          } else if (data) {
            setMessages(
              data.map((m: any) => ({
                id: m.id,
                sender: m.sender as "student" | "mentor",
                text: m.text,
                time: m.time,
              }))
            );
          }
        } catch (err) {
          console.error("Exception loading messages:", err);
        }
      };

      fetchMessages();

      // Realtime subscription for incoming replies
      const channel = supabase
        .channel(`messages-room-${userId}-${activeChannelId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            if (payload.new.channel_id === activeChannelId) {
              setMessages((prev) => {
                if (prev.some((m) => m.id === payload.new.id)) return prev;
                return [
                  ...prev,
                  {
                    id: payload.new.id,
                    sender: payload.new.sender as "student" | "mentor",
                    text: payload.new.text,
                    time: payload.new.time,
                  },
                ];
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userId, activeChannelId]);

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const msgText = typedMessage.trim();
    setTypedMessage("");

    const timestamp = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    // Optimistic update
    const tempId = Math.random().toString(36).substring(2, 9);
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        sender: "student",
        text: msgText,
        time: timestamp,
      },
    ]);

    try {
      const { error } = await supabase.from("messages").insert({
        user_id: userId,
        channel_id: activeChannelId,
        text: msgText,
        sender: "student",
        time: timestamp,
      });

      if (error) {
        console.error("Failed to insert message into Supabase:", error);
        alert(`Failed to send message: ${error.message}`);
      }
    } catch (err) {
      console.error("Exception sending message:", err);
    }
  };

  const activeChannel = channels.find((c) => c.id === activeChannelId);

  // Filter channels based on student course enrollment
  const progressList = AcademyDB.getProgress(userId);
  const enrolledCourseIds = progressList.map((p) => p.courseId);
  const visibleChannels = channels.filter(
    (c) => !c.courseId || enrolledCourseIds.includes(c.courseId)
  );

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Communication Hub</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Direct Messaging</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2 md:mt-0 leading-relaxed font-semibold">
          Chat directly with instructors and support representatives about coursework, reviews, or troubleshooting.
        </p>
      </div>

      {coursesEnrolled === 0 ? (
        /* Empty State */
        <div className="p-8 text-center bg-white dark:bg-[#18181c] border border-card-border/60 rounded-3xl space-y-4 max-w-xl mx-auto my-12">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-card-border flex items-center justify-center mx-auto">
            <MessageCircle className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-heading font-bold text-slate-800 dark:text-white">No Enrolled Courses</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              You must enroll in programs to activate direct messaging channels with course instructors.
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
        /* Messenger layout wrapper */
        <div className="max-w-5xl mx-auto rounded-[24px] border border-card-border/60 bg-white dark:bg-[#18181c] overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px] shadow-xs">
          
          {/* Left panel: Threads menu */}
          <div className="md:col-span-4 border-r border-card-border/40 p-4 space-y-4 text-left select-none bg-slate-50/20 dark:bg-slate-900/10">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Channels</h3>
            
            <div className="space-y-1.5">
              {visibleChannels.map((chan) => {
                const isActive = chan.id === activeChannelId;
                return (
                  <button
                    key={chan.id}
                    onClick={() => setActiveChannelId(chan.id)}
                    className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all text-left cursor-pointer border-none ${
                      isActive
                        ? "bg-blue-50/70 dark:bg-blue-950/20 text-[#0055ff]"
                        : "hover:bg-slate-50 dark:hover:bg-slate-900/50 text-slate-655"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-heading font-black text-xs ${chan.avatarBg}`}>
                      {chan.avatarInitials}
                    </div>
                    <div className="truncate space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-none">{chan.name}</h4>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold leading-none mt-1 truncate">{chan.role}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel: Chat messages window */}
          <div className="md:col-span-8 flex flex-col justify-between h-[500px]">
            
            {/* Header info */}
            <div className="p-4 border-b border-card-border/40 flex items-center gap-3 text-left bg-slate-50/10 dark:bg-slate-900/5">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-heading font-black text-xs ${activeChannel?.avatarBg}`}>
                {activeChannel?.avatarInitials}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-none">{activeChannel?.name}</h4>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold mt-1 block">{activeChannel?.role}</p>
              </div>
            </div>

            {/* Bubble history */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg) => {
                const isStudent = msg.sender === "student";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isStudent ? "justify-end" : "justify-start"} text-left`}
                  >
                    <div className={`max-w-[75%] rounded-[18px] p-3 text-xs leading-normal font-semibold ${
                      isStudent
                        ? "bg-[#0055ff] text-white rounded-br-sm"
                        : "bg-slate-100 dark:bg-slate-900 border border-card-border/30 text-slate-800 dark:text-slate-200 rounded-bl-sm"
                    }`}>
                      <p>{msg.text}</p>
                      <span className={`text-[8px] mt-1.5 block text-right font-medium ${isStudent ? "text-white/60" : "text-slate-400"}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input bar */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-card-border/40 bg-slate-50/20 dark:bg-slate-900/10">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900/50 border border-card-border/60 rounded-xl px-3 py-1.5">
                <input
                  type="text"
                  placeholder={`Write a message to ${activeChannel?.name}...`}
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  className="w-full text-xs placeholder-slate-400 text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none"
                />
                
                <button
                  type="submit"
                  className="p-1.5 rounded-lg bg-[#0055ff] hover:bg-[#0044dd] text-white transition-all cursor-pointer border-none flex items-center justify-center shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

          </div>

        </div>
      )}

    </div>
  );
}
