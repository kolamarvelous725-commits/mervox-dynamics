"use client";

import { useState, useEffect } from "react";
import { Send, MessageSquare, Shield, User, CornerDownLeft, Sparkles, Inbox, RefreshCw } from "lucide-react";
import { supabase } from "@/utils/supabaseClient";

interface Message {
  id: string;
  sender: "student" | "mentor";
  text: string;
  time: string;
}

interface MessageThread {
  studentId: string;
  studentName: string;
  channelId: string;
  lastMessage: string;
  lastMessageTime: string;
  messages: Message[];
}

export default function AdminMessagesPage() {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [selectedThreadIndex, setSelectedThreadIndex] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const loadData = async () => {
    try {
      // 1. Fetch profiles to map user_id -> full_name
      const { data: students } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("role", "student");
      const nameMap = new Map(students?.map((s) => [s.id, s.full_name]) || []);

      // 2. Fetch all messages ordered by time
      const { data: allMsgs } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      // 3. Group messages into support threads
      const threadsMap = new Map<string, MessageThread>();
      allMsgs?.forEach((m: any) => {
        const key = `${m.user_id}_${m.channel_id}`;
        const studentName = nameMap.get(m.user_id) || "Anonymous Student";
        if (!threadsMap.has(key)) {
          threadsMap.set(key, {
            studentId: m.user_id,
            studentName,
            channelId: m.channel_id,
            lastMessage: "",
            lastMessageTime: "",
            messages: [],
          });
        }
        const t = threadsMap.get(key)!;
        t.messages.push({
          id: m.id,
          sender: m.sender as "student" | "mentor",
          text: m.text,
          time: m.time,
        });
        t.lastMessage = m.text;
        t.lastMessageTime = m.time;
      });

      const sortedThreads = Array.from(threadsMap.values());
      setThreads(sortedThreads);
      if (sortedThreads.length > 0 && selectedThreadIndex === null) {
        setSelectedThreadIndex(0);
      }
    } catch (err) {
      console.error("Failed to load message threads:", err);
    }
  };

  useEffect(() => {
    loadData();

    // Setup real-time listener for incoming messages
    const channel = supabase
      .channel("admin-chat-listener")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedThreadIndex]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedThreadIndex === null || !replyText.trim()) return;

    const thread = threads[selectedThreadIndex];
    const msgText = replyText.trim();
    setReplyText("");

    const timestamp = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    try {
      const { error } = await supabase.from("messages").insert({
        user_id: thread.studentId,
        channel_id: thread.channelId,
        text: msgText,
        sender: "mentor",
        time: timestamp,
      });

      if (error) {
        console.error("Failed to send admin reply:", error);
        alert(`Failed to send message: ${error.message}`);
      } else {
        loadData();
      }
    } catch (err) {
      console.error("Exception sending reply:", err);
    }
  };

  const getChannelName = (id: string) => {
    if (id === "forex-mentor") return "Forex Mentor Desk";
    if (id === "ai-support") return "AI Support Desk";
    return "General Academy Helpdesk";
  };

  const activeThread = selectedThreadIndex !== null ? threads[selectedThreadIndex] : null;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Student Support Desk</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Direct Messages</h2>
        </div>
        
        <button
          onClick={loadData}
          className="px-4 py-2 border border-card-border hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold text-slate-655 flex items-center gap-1.5 self-start md:self-auto mt-3 md:mt-0 select-none cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {/* Messages Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[550px] border border-card-border bg-white dark:bg-[#18181c] rounded-[24px] overflow-hidden shadow-xs">
        
        {/* Left Side: Threads Roster */}
        <div className="lg:col-span-4 border-r border-card-border/60 flex flex-col h-full bg-slate-50/20 dark:bg-slate-900/10">
          <div className="p-4 border-b border-card-border/40 bg-white/50 dark:bg-transparent text-left select-none">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Incoming Channels</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-card-border/30 scrollbar-thin text-left">
            {threads.length === 0 ? (
              <div className="p-8 text-center text-slate-400 py-16 space-y-2 select-none">
                <Inbox className="w-6 h-6 mx-auto text-slate-300" />
                <p className="text-[11px] font-semibold">Inbox is currently empty.</p>
              </div>
            ) : (
              threads.map((th, index) => {
                const isActive = selectedThreadIndex === index;
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedThreadIndex(index)}
                    className={`p-4 cursor-pointer transition-all hover:bg-slate-50/50 dark:hover:bg-slate-900/30 flex gap-3 ${
                      isActive ? "bg-blue-50/20 dark:bg-blue-950/10 border-l-[3px] border-[#0055ff]" : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-900 border border-card-border/60 text-[#0055ff] flex items-center justify-center font-heading font-black text-xs shrink-0 select-none">
                      {th.studentName.split(" ").map(n => n.charAt(0)).join("")}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex justify-between items-baseline gap-2">
                        <h4 className="text-xs font-black text-slate-800 dark:text-white truncate">
                          {th.studentName}
                        </h4>
                        <span className="text-[8px] text-slate-400 font-bold shrink-0">{th.lastMessageTime}</span>
                      </div>
                      <span className="text-[8px] px-1 rounded font-bold uppercase tracking-wider bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 leading-none">
                        {getChannelName(th.channelId)}
                      </span>
                      <p className="text-[10px] text-slate-450 truncate font-semibold leading-relaxed pt-1">
                        {th.lastMessage}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Chat Window */}
        <div className="lg:col-span-8 flex flex-col h-full bg-white dark:bg-[#18181c]">
          {activeThread ? (
            <>
              {/* Active Header details */}
              <div className="p-4 border-b border-card-border/40 flex items-center gap-3 text-left bg-slate-50/10 select-none">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-900 border border-card-border/60 text-[#0055ff] flex items-center justify-center font-heading font-black text-xs shrink-0">
                  {activeThread.studentName.split(" ").map(n => n.charAt(0)).join("")}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-white leading-none">
                    {activeThread.studentName}
                  </h4>
                  <span className="text-[9px] text-[#0055ff] font-bold mt-1.5 block leading-none">
                    {getChannelName(activeThread.channelId)}
                  </span>
                </div>
              </div>

              {/* Chat bubbles container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin text-left bg-slate-50/5 dark:bg-transparent">
                {activeThread.messages.map((msg) => {
                  const isMentor = msg.sender === "mentor";
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 max-w-[80%] ${isMentor ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                    >
                      {/* Avatar icon */}
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-[10px] font-black border border-card-border/60 select-none ${
                        isMentor 
                          ? "bg-slate-100 dark:bg-slate-800 text-[#0055ff]" 
                          : "bg-blue-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                      }`}>
                        {isMentor ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      </div>

                      {/* Bubble */}
                      <div className={`p-3 rounded-2xl text-xs space-y-1.5 shadow-2xs ${
                        isMentor
                          ? "bg-[#0055ff] text-white rounded-tr-xs font-medium"
                          : "bg-slate-150/45 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 border border-card-border/40 rounded-tl-xs font-medium"
                      }`}>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        <span className={`text-[8px] font-semibold block text-right leading-none ${
                          isMentor ? "text-blue-100" : "text-slate-400"
                        }`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Text input box */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-card-border/40 flex gap-2 bg-slate-50/20 dark:bg-transparent select-none">
                <input
                  type="text"
                  placeholder="Type a direct instructor response..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-grow px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="px-5 bg-[#0055ff] hover:bg-[#0044dd] text-white rounded-xl flex items-center justify-center shadow-sm cursor-pointer border-none"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-16 space-y-3 select-none">
              <MessageSquare className="w-8 h-8 text-slate-350" />
              <p className="text-xs font-semibold">Select an incoming support channel thread to start chatting.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
