"use client";

import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { AcademyDB } from "@/utils/academyDb";
import { useState, useEffect, useRef } from "react";
import { Send, User, ShieldAlert, Sparkles, MessageCircle, AlertCircle, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
      autoResponse: "Hey there! I am currently analyzing the EUR/USD market setups. I've received your query and will check your chart markups shortly. Remember: watch leverage!",
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

  const defaultMessages: Record<string, ChatMessage[]> = {
    "forex-mentor": [
      { id: "m1", sender: "mentor", text: "Welcome to the Forex direct mentoring channel! How are your price action practice charts coming along?", time: "10:30 AM" },
    ],
    "ai-support": [
      { id: "m2", sender: "mentor", text: "Hi! You can share your Make.com workflow JSON schemas or Ask prompt questions here directly.", time: "09:15 AM" },
    ],
    "helpdesk": [
      { id: "m3", sender: "mentor", text: "Hello! How can the support desk help you today? Ask us about billing, download access, or live dates.", time: "Yesterday" },
    ],
  };

  // Check enrollment, load messages
  useEffect(() => {
    if (userId) {
      const progress = AcademyDB.getProgress(userId);
      setCoursesEnrolled(progress.length);

      // Load thread messages
      const savedKey = `mervox_academy_msg_${userId}_${activeChannelId}`;
      const saved = localStorage.getItem(savedKey);
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        const initial = defaultMessages[activeChannelId] || [];
        localStorage.setItem(savedKey, JSON.stringify(initial));
        setMessages(initial);
      }
    }
  }, [userId, activeChannelId]);

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const msgText = typedMessage.trim();
    setTypedMessage("");

    const savedKey = `mervox_academy_msg_${userId}_${activeChannelId}`;
    const timestamp = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    const newMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: "student" as const,
      text: msgText,
      time: timestamp,
    };

    const updated = [...messages, newMsg];
    localStorage.setItem(savedKey, JSON.stringify(updated));
    setMessages(updated);

    // Trigger auto response delay
    setTimeout(() => {
      const currentChannel = channels.find((c) => c.id === activeChannelId);
      const replyMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: "mentor" as const,
        text: currentChannel?.autoResponse || "Thank you for reaching out. We will get back to you shortly.",
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      };

      const updatedWithReply = [...updated, replyMsg];
      localStorage.setItem(savedKey, JSON.stringify(updatedWithReply));
      setMessages(updatedWithReply);

      // Log notification
      AcademyDB.addNotification(userId, `New message reply from ${currentChannel?.name || "Mentor"}.`);
    }, 1500);
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
