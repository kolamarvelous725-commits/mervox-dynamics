"use client";

import { useState, useEffect } from "react";
import { Send, MessageSquare, Shield, User, CornerDownLeft, Sparkles, Inbox, RefreshCw, Plus, Tag, CheckCircle2, Clock, AlertCircle, Search, Filter } from "lucide-react";
import { adminSupabase, isSupabaseConfigured } from "@/utils/supabaseClient";

interface Message {
  id: string;
  sender: "student" | "mentor";
  text: string;
  time: string;
}

interface MessageThread {
  studentId: string;
  studentName: string;
  studentEmail: string;
  channelId: string;
  lastMessage: string;
  lastMessageTime: string;
  messages: Message[];
}

interface StudentOption {
  id: string;
  name: string;
  email: string;
}

interface SupportTicket {
  id: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  category: string;
  subject: string;
  description: string;
  status: "active" | "in_progress" | "resolved";
  time: string;
}

export default function AdminMessagesPage() {
  const [activeTab, setActiveTab] = useState<"messages" | "tickets">("messages");
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [allStudents, setAllStudents] = useState<StudentOption[]>([]);
  const [selectedThreadIndex, setSelectedThreadIndex] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [selectedStudentForNewChat, setSelectedStudentForNewChat] = useState("");
  const [selectedChannelForNewChat, setSelectedChannelForNewChat] = useState("helpdesk");
  const [newChatInitialMessage, setNewChatInitialMessage] = useState("");

  // Tickets state
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [ticketSubTab, setTicketSubTab] = useState<"active" | "in_progress" | "resolved">("active");
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<"all" | "forex-mentor" | "ai-support" | "helpdesk">("all");

  const loadData = async () => {
    try {
      if (!isSupabaseConfigured) {
        return;
      }

      // 1. Fetch student profiles
      const { data: studentProfiles } = await adminSupabase
        .from("profiles")
        .select("id, full_name, email, role");

      const filteredStudents = (studentProfiles || []).filter((s: any) => {
        const email = (s.email || "").toLowerCase().trim();
        const isAdmin = email === "marvelousotugalu012@gmail.com" || email === "kolamarvelous725@gmail.com" || s.role === "admin";
        return !isAdmin;
      });

      const nameMap = new Map(filteredStudents.map((s) => [s.id, s.full_name || s.email]));
      const emailMap = new Map(filteredStudents.map((s) => [s.id, s.email]));

      setAllStudents(
        filteredStudents.map((s: any) => ({
          id: s.id,
          name: s.full_name || s.email,
          email: s.email,
        }))
      );

      // 2. Fetch all messages ordered by created_at
      const { data: allMsgs } = await adminSupabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      // 3. Group messages into support threads
      const threadsMap = new Map<string, MessageThread>();

      allMsgs?.forEach((m: any) => {
        const key = `${m.user_id}_${m.channel_id}`;
        const studentName = nameMap.get(m.user_id) || "Student Account";
        const studentEmail = emailMap.get(m.user_id) || "";

        if (!threadsMap.has(key)) {
          threadsMap.set(key, {
            studentId: m.user_id,
            studentName,
            studentEmail,
            channelId: m.channel_id,
            lastMessage: m.text,
            lastMessageTime: m.time || "Recently",
            messages: [],
          });
        }

        threadsMap.get(key)?.messages.push({
          id: m.id,
          sender: m.sender,
          text: m.text,
          time: m.time || "",
        });
      });

      const list = Array.from(threadsMap.values());
      setThreads(list);

      if (list.length > 0 && selectedThreadIndex === null) {
        setSelectedThreadIndex(0);
      }

      // 4. Fetch Support Tickets from public.support_tickets
      const { data: dbTickets, error: ticketsErr } = await adminSupabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false });

      const loadedTickets: SupportTicket[] = [];

      if (dbTickets && dbTickets.length > 0) {
        dbTickets.forEach((t: any) => {
          loadedTickets.push({
            id: t.id,
            userId: t.user_id,
            studentName: nameMap.get(t.user_id) || "Student Account",
            studentEmail: emailMap.get(t.user_id) || "",
            category: t.category || "General",
            subject: t.subject || "Support Inquiry",
            description: t.description || "",
            status: (t.status || "active") as "active" | "in_progress" | "resolved",
            time: t.created_at ? new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recently",
          });
        });
      } else if (allMsgs) {
        // Fallback extract tickets from messages if table is freshly created
        allMsgs.forEach((m: any) => {
          if (m.text && m.text.includes("[SUPPORT TICKET:")) {
            const match = m.text.match(/\[SUPPORT TICKET:\s*([^\]]+)\]/);
            const ticketId = match ? match[1].trim() : `TKT-${m.id.substring(0, 6)}`;
            let category = "General";
            if (ticketId.includes("-")) {
              category = ticketId.split("-")[1] || "General";
            }
            let subject = "Support Inquiry";
            const subMatch = m.text.match(/Subject:\s*([^\n]+)/);
            if (subMatch) subject = subMatch[1].trim();

            loadedTickets.push({
              id: ticketId,
              userId: m.user_id,
              studentName: nameMap.get(m.user_id) || "Student Account",
              studentEmail: emailMap.get(m.user_id) || "",
              category,
              subject,
              description: m.text,
              status: "active",
              time: m.time || "Recently",
            });
          }
        });
      }

      setTickets(loadedTickets);
    } catch (err) {
      console.error("Failed to load admin message threads & tickets:", err);
    }
  };

  useEffect(() => {
    loadData();

    if (!isSupabaseConfigured) return;

    // Real-time listener for all messages and tickets changes
    const channel = adminSupabase
      .channel("admin-chat-realtime-listener")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => loadData())
      .on("postgres_changes", { event: "*", schema: "public", table: "support_tickets" }, () => loadData())
      .subscribe();

    return () => {
      adminSupabase.removeChannel(channel);
    };
  }, [selectedThreadIndex]);

  const handleUpdateTicketStatus = async (ticketId: string, newStatus: "active" | "in_progress" | "resolved") => {
    try {
      const ticketToUpdate = tickets.find((t) => t.id === ticketId);
      if (!ticketToUpdate) return;

      if (isSupabaseConfigured) {
        const updatePayload: any = {
          status: newStatus,
          updated_at: new Date().toISOString()
        };

        if (newStatus === "resolved") {
          updatePayload.resolved_at = new Date().toISOString();
        }

        console.log(`Updating ticket ${ticketId} status to: ${newStatus}...`);
        const { error } = await adminSupabase
          .from("support_tickets")
          .update(updatePayload)
          .eq("id", ticketId);

        if (error) {
          console.error("Supabase support_tickets UPDATE failed payload:", updatePayload, "Error details:", error);
          alert(`Failed to update ticket status in database: ${error.message}`);
          return; // STOP: Do not update React state on database failure!
        }

        // If ticket is resolved, push notification to student profile
        if (newStatus === "resolved" && ticketToUpdate.userId) {
          try {
            console.log(`Sending resolution notification to student profile ${ticketToUpdate.userId}...`);
            const { data: profile, error: profileErr } = await adminSupabase
              .from("profiles")
              .select("notifications")
              .eq("id", ticketToUpdate.userId)
              .single();

            if (profileErr) {
              console.error("Failed to fetch student profile for resolution notification:", profileErr);
            } else {
              const currentNotifs = profile?.notifications 
                ? (Array.isArray(profile.notifications) 
                    ? profile.notifications 
                    : JSON.parse(profile.notifications as any)) 
                : [];
              
              const newNotif = {
                id: Math.random().toString(36).substring(2, 9),
                title: `Your support ticket '${ticketToUpdate.subject}' has been resolved.`,
                time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) + " (UTC)",
                unread: true,
              };

              const updatedNotifs = [newNotif, ...currentNotifs].slice(0, 30);

              const { error: notifUpdateErr } = await adminSupabase
                .from("profiles")
                .update({ notifications: updatedNotifs })
                .eq("id", ticketToUpdate.userId);

              if (notifUpdateErr) {
                console.error("Failed to push resolution notification to student profile:", notifUpdateErr);
              } else {
                console.log(`Resolution notification pushed successfully to student ${ticketToUpdate.userId}`);
              }
            }
          } catch (notifErr) {
            console.error("Exception handling student notification:", notifErr);
          }
        }
      }

      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error("Exception updating ticket status:", err);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedThreadIndex === null || !replyText.trim()) return;

    const thread = threads[selectedThreadIndex];
    const msgText = replyText.trim();
    setReplyText("");

    const timestamp = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    try {
      const { error } = await adminSupabase.from("messages").insert({
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

  const handleStartNewChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForNewChat || !newChatInitialMessage.trim()) return;

    const timestamp = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    try {
      const { error } = await adminSupabase.from("messages").insert({
        user_id: selectedStudentForNewChat,
        channel_id: selectedChannelForNewChat,
        text: newChatInitialMessage.trim(),
        sender: "mentor",
        time: timestamp,
      });

      if (error) {
        alert(`Failed to start conversation: ${error.message}`);
      } else {
        setShowNewChatModal(false);
        setNewChatInitialMessage("");
        loadData();
      }
    } catch (err) {
      console.error("Exception starting conversation:", err);
    }
  };

  const handleOpenTicketInChat = (userId: string) => {
    setActiveTab("messages");
    const threadIdx = threads.findIndex((th) => th.studentId === userId);
    if (threadIdx !== -1) {
      setSelectedThreadIndex(threadIdx);
    } else {
      setSelectedStudentForNewChat(userId);
      setSelectedChannelForNewChat("helpdesk");
      setShowNewChatModal(true);
    }
  };

  const getChannelName = (id: string) => {
    if (id === "forex-mentor") return "Forex Mentor Desk";
    if (id === "ai-support") return "AI Support Desk";
    return "General Academy Helpdesk";
  };

  const filteredThreads = threads.filter(
    (th) =>
      (selectedChannelFilter === "all" || th.channelId === selectedChannelFilter) &&
      (th.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        th.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        th.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeThread = selectedThreadIndex !== null ? filteredThreads[selectedThreadIndex] : null;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Student Support Desk</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">
            Communication & Tickets
          </h2>
        </div>
        
        <div className="flex items-center gap-2 mt-3 md:mt-0">
          <button
            onClick={() => setShowNewChatModal(true)}
            className="px-4 py-2 bg-[#0055ff] hover:bg-[#0044dd] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Student Message</span>
          </button>
          <button
            onClick={loadData}
            className="px-3.5 py-2 border border-card-border hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold text-slate-650 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-card-border/40 pb-2 text-left">
        <button
          onClick={() => setActiveTab("messages")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "messages"
              ? "bg-[#0055ff] text-white shadow-xs"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Direct Messages ({threads.length})
        </button>
        <button
          onClick={() => setActiveTab("tickets")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "tickets"
              ? "bg-[#0055ff] text-white shadow-xs"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Support Tickets Queue ({tickets.length})
        </button>
      </div>

      {activeTab === "messages" ? (
        /* Messages Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[580px] border border-card-border bg-white dark:bg-[#18181c] rounded-[24px] overflow-hidden shadow-xs">
          
          {/* Left Side: Threads Roster */}
          <div className="lg:col-span-4 border-r border-card-border/60 flex flex-col h-full bg-slate-50/20 dark:bg-slate-900/10">
            <div className="p-3 border-b border-card-border/40 bg-white/50 dark:bg-transparent">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search students or messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Category Filter for Direct Message Managers */}
            <div className="flex gap-1 p-2 bg-slate-50 dark:bg-slate-900 border-b border-card-border/30 select-none">
              {(["all", "forex-mentor", "ai-support", "helpdesk"] as const).map((filter) => {
                const count = threads.filter((th) => filter === "all" || th.channelId === filter).length;
                return (
                  <button
                    key={filter}
                    onClick={() => {
                      setSelectedChannelFilter(filter);
                      setSelectedThreadIndex(null); // Reset selection
                    }}
                    className={`flex-1 py-1.5 px-1 text-[8px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer truncate ${
                      selectedChannelFilter === filter
                        ? "bg-[#0055ff] text-white"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 bg-white dark:bg-slate-800 border border-card-border/40"
                    }`}
                  >
                    {filter === "all" ? `All (${count})` : filter === "forex-mentor" ? `Forex (${count})` : filter === "ai-support" ? `AI (${count})` : `Help (${count})`}
                  </button>
                );
              })}
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-card-border/30 scrollbar-thin text-left">
              {filteredThreads.length === 0 ? (
                <div className="p-8 text-center text-slate-400 py-16 space-y-2 select-none">
                  <Inbox className="w-6 h-6 mx-auto text-slate-300" />
                  <p className="text-[11px] font-semibold">No conversations found.</p>
                </div>
              ) : (
                filteredThreads.map((th, index) => {
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
                <div className="p-4 border-b border-card-border/40 flex items-center justify-between text-left bg-slate-50/10 select-none">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-900 border border-card-border/60 text-[#0055ff] flex items-center justify-center font-heading font-black text-xs shrink-0">
                      {activeThread.studentName.split(" ").map(n => n.charAt(0)).join("")}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 dark:text-white leading-none">
                        {activeThread.studentName}
                      </h4>
                      <span className="text-[9px] text-slate-400 font-medium mt-1 block">
                        {activeThread.studentEmail} • {getChannelName(activeThread.channelId)}
                      </span>
                    </div>
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
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-[10px] font-black border border-card-border/60 select-none ${
                          isMentor 
                            ? "bg-slate-100 dark:bg-slate-800 text-[#0055ff]" 
                            : "bg-blue-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                        }`}>
                          {isMentor ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        </div>

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
                    placeholder="Type a mentor response..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-grow px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#0055ff]"
                    required
                  />
                  <button
                    type="submit"
                    className="px-5 bg-[#0055ff] hover:bg-[#0044dd] text-white rounded-xl flex items-center justify-center shadow-xs cursor-pointer border-none"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-16 space-y-3 select-none">
                <MessageSquare className="w-8 h-8 text-slate-350" />
                <p className="text-xs font-semibold">Select a conversation thread to review or reply.</p>
              </div>
            )}
          </div>

        </div>
      ) : (        /* Support Tickets Desk */
        <div className="rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs p-6 space-y-4 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-card-border/40">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Student Ticket Inquiries
            </h3>
            <span className="text-xs text-slate-400 font-semibold">{tickets.length} total tickets logged</span>
          </div>
          {/* Sub-tabs for support tickets sorting */}
          <div className="flex flex-wrap gap-2 border-b border-card-border/30 pb-3 select-none">
            {(["active", "in_progress", "resolved"] as const).map((tab) => {
              const count = tickets.filter((t) => t.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setTicketSubTab(tab)}
                  className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    ticketSubTab === tab
                      ? "bg-[#0055ff] text-white"
                      : "bg-slate-50 dark:bg-slate-900/40 text-slate-500 hover:text-slate-700 dark:hover:text-slate-355"
                  }`}
                >
                  {tab === "active" ? "Active" : tab === "in_progress" ? "In Progress" : "Resolved"} ({count})
                </button>
              );
            })}
          </div>

          {tickets.filter((t) => t.status === ticketSubTab).length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
              <p className="text-xs font-semibold">No tickets found in this section.</p>
            </div>
          ) : (
            <div className="divide-y divide-card-border/30 space-y-3">
              {tickets
                .filter((t) => t.status === ticketSubTab)
                .map((t) => (
                  <div key={t.id} className="pt-3 first:pt-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-[#0055ff] dark:bg-blue-950/40 dark:text-blue-400">
                          {t.id}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{t.category}</span>
                        <span className="text-[10px] text-slate-400">• {t.time}</span>
                      </div>
                      <h4 className="text-xs font-black text-slate-800 dark:text-white truncate">{t.subject}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{t.description}</p>
                      <div className="text-[10px] text-slate-400 font-medium">
                        Student: <span className="font-bold text-slate-700 dark:text-slate-300">{t.studentName}</span> ({t.studentEmail})
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <select
                        value={t.status}
                        onChange={(e) => handleUpdateTicketStatus(t.id, e.target.value as any)}
                        className={`text-[10px] font-bold px-2.5 py-1.5 rounded-xl border cursor-pointer focus:outline-none ${
                          t.status === "resolved"
                            ? "bg-slate-100 dark:bg-slate-800/40 text-slate-600 border-slate-200 dark:border-slate-800/40"
                            : t.status === "in_progress"
                            ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 border-blue-200 dark:border-blue-900/30"
                            : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border-emerald-200 dark:border-emerald-900/30"
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>

                      <button
                        onClick={() => handleOpenTicketInChat(t.userId)}
                        className="px-3 py-1.5 bg-[#0055ff] hover:bg-[#0044dd] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply in Chat</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Start New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#18181c] w-full max-w-md rounded-2xl border border-card-border shadow-2xl p-6 space-y-4 text-left">
            <h3 className="text-sm font-heading font-black text-slate-850 dark:text-white">
              Start Direct Message with Student
            </h3>

            <form onSubmit={handleStartNewChat} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                  Select Registered Student
                </label>
                <select
                  value={selectedStudentForNewChat}
                  onChange={(e) => setSelectedStudentForNewChat(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                  required
                >
                  <option value="">-- Choose a student --</option>
                  {allStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                  Channel / Desk
                </label>
                <select
                  value={selectedChannelForNewChat}
                  onChange={(e) => setSelectedChannelForNewChat(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="helpdesk">General Academy Helpdesk</option>
                  <option value="forex-mentor">Forex Mentor Desk</option>
                  <option value="ai-support">AI Support Desk</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                  Initial Message
                </label>
                <textarea
                  placeholder="Type message to the student..."
                  rows={3}
                  value={newChatInitialMessage}
                  onChange={(e) => setNewChatInitialMessage(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none resize-none"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewChatModal(false)}
                  className="px-4 py-2 border border-card-border rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0055ff] hover:bg-[#0044dd] text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
