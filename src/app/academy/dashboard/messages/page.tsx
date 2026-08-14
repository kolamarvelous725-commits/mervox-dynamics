"use client";

import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { AcademyDB } from "@/utils/academyDb";
import { useState, useEffect, useRef } from "react";
import { Send, User, ShieldAlert, Sparkles, MessageCircle, AlertCircle, BookOpen, Plus, MessageSquare, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase, isSupabaseConfigured } from "@/utils/supabaseClient";

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
  lastMessage?: string;
  lastMessageTime?: string;
}

const DEFAULT_CHANNELS: ChatChannel[] = [
  {
    id: "helpdesk",
    name: "General Helpdesk",
    role: "Student Coordinator & Support",
    avatarInitials: "GH",
    avatarBg: "bg-blue-100 text-[#0055ff] dark:bg-blue-950/30 dark:text-blue-400",
  },
  {
    id: "forex-mentor",
    name: "JPForex Mentor",
    role: "Forex Technical Instructor",
    avatarInitials: "JP",
    avatarBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
  },
  {
    id: "ai-support",
    name: "AI Automation Support",
    role: "Workflow & Engineering Mentor",
    avatarInitials: "AI",
    avatarBg: "bg-purple-100 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400",
  },
];

export default function MessagesPage() {
  const { student } = useAcademyAuth();
  const userId = student?.id || "";
  const router = useRouter();

  const [activeChannelId, setActiveChannelId] = useState("helpdesk");
  const [channels, setChannels] = useState<ChatChannel[]>(DEFAULT_CHANNELS);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatChannelId, setNewChatChannelId] = useState("helpdesk");
  const [newChatMessage, setNewChatMessage] = useState("");
  const [messageCategory, setMessageCategory] = useState("General");
  const [newChatCategory, setNewChatCategory] = useState("General");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync category state with channel selection
  useEffect(() => {
    if (activeChannelId === "forex-mentor") {
      setMessageCategory("FX");
    } else if (activeChannelId === "ai-support") {
      setMessageCategory("AI");
    } else {
      setMessageCategory("General");
    }
  }, [activeChannelId]);

  // Sync modal channel selection with default category
  useEffect(() => {
    if (newChatChannelId === "forex-mentor") {
      setNewChatCategory("FX");
    } else if (newChatChannelId === "ai-support") {
      setNewChatCategory("AI");
    } else {
      setNewChatCategory("General");
    }
  }, [newChatChannelId]);

  // Fetch messages and discover active channels for this student
  const fetchMessagesAndChannels = async () => {
    if (!userId) return;

    try {
      if (!isSupabaseConfigured) {
        const key = `mervox_academy_chat_messages_${userId}_${activeChannelId}`;
        const stored = localStorage.getItem(key);
        if (stored) {
          setMessages(JSON.parse(stored));
        } else {
          const defaultMsg: ChatMessage[] = [
            {
              id: `welcome-${activeChannelId}`,
              sender: "mentor",
              text: `Welcome! How can the Mervox Academy team assist you today?`,
              time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
            }
          ];
          setMessages(defaultMsg);
        }
        return;
      }

      // Fetch all messages for this student across all channels
      const { data: allUserMsgs, error } = await supabase
        .from("messages")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Failed to query student messages:", error);
        return;
      }

      if (allUserMsgs) {
        // Group messages by channel
        const channelMap = new Map<string, { lastMsg: string; lastTime: string; count: number }>();
        allUserMsgs.forEach((m: any) => {
          const cId = m.channel_id || "helpdesk";
          channelMap.set(cId, {
            lastMsg: m.text,
            lastTime: m.time || "Recently",
            count: (channelMap.get(cId)?.count || 0) + 1,
          });
        });

        // Merge discovered dynamic channels with default channels
        const dynamicChannels: ChatChannel[] = [...DEFAULT_CHANNELS];
        channelMap.forEach((meta, cId) => {
          const existing = dynamicChannels.find((c) => c.id === cId);
          if (existing) {
            existing.lastMessage = meta.lastMsg;
            existing.lastMessageTime = meta.lastTime;
          } else {
            dynamicChannels.push({
              id: cId,
              name: cId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
              role: "Support Representative",
              avatarInitials: cId.slice(0, 2).toUpperCase(),
              avatarBg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400",
              lastMessage: meta.lastMsg,
              lastMessageTime: meta.lastTime,
            });
          }
        });

        setChannels(dynamicChannels);

        // Filter messages for currently active channel
        const currentChannelMsgs = allUserMsgs
          .filter((m: any) => (m.channel_id || "helpdesk") === activeChannelId)
          .map((m: any) => ({
            id: m.id,
            sender: m.sender as "student" | "mentor",
            text: m.text,
            time: m.time || "Recently",
          }));

        setMessages(currentChannelMsgs);
      }
    } catch (err) {
      console.error("Exception loading student messages:", err);
    }
  };

  useEffect(() => {
    fetchMessagesAndChannels();

    if (!isSupabaseConfigured || !userId) return;

    // Realtime channel subscription for all incoming student messages
    const realtimeChannel = supabase
      .channel(`student_chat_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchMessagesAndChannels();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(realtimeChannel);
    };
  }, [userId, activeChannelId]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || isSending) return;

    const msgText = typedMessage.trim();
    setTypedMessage("");
    setIsSending(true);

    const timestamp = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    // Optimistic UI update
    const tempId = `temp-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: tempId,
      sender: "student",
      text: msgText,
      time: timestamp,
    };

    setMessages((prev) => [...prev, newMsg]);

    try {
      if (!isSupabaseConfigured) {
        const key = `mervox_academy_chat_messages_${userId}_${activeChannelId}`;
        const stored = localStorage.getItem(key);
        const current = stored ? JSON.parse(stored) : [];
        const updated = [...current, newMsg];
        localStorage.setItem(key, JSON.stringify(updated));
        setIsSending(false);
        return;
      }

      const { error } = await supabase.from("messages").insert({
        user_id: userId,
        channel_id: activeChannelId,
        text: msgText,
        sender: "student",
        time: timestamp,
        category: messageCategory,
      });

      if (error) {
        console.error("Failed to insert message into Supabase:", error);
        alert(`Message send failed: ${error.message}`);
      } else {
        fetchMessagesAndChannels();
      }
    } catch (err: any) {
      console.error("Exception sending message:", err);
      alert(`Message error: ${err.message || String(err)}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleStartNewConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim() || !userId) return;

    const timestamp = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const targetChannel = newChatChannelId;
    const msgText = newChatMessage.trim();

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("messages").insert({
          user_id: userId,
          channel_id: targetChannel,
          text: msgText,
          sender: "student",
          time: timestamp,
          category: newChatCategory,
        });

        if (error) {
          alert(`Failed to start conversation: ${error.message}`);
          return;
        }
      }

      setActiveChannelId(targetChannel);
      setNewChatMessage("");
      setShowNewChatModal(false);
      fetchMessagesAndChannels();
    } catch (err: any) {
      alert(`Error starting conversation: ${err.message || String(err)}`);
    }
  };

  const activeChannel = channels.find((c) => c.id === activeChannelId) || DEFAULT_CHANNELS[0];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Communication Hub</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Direct Messaging</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2 md:mt-0 leading-relaxed font-semibold">
          Chat directly in real-time with instructors, student coordinators, and technical support representatives.
        </p>
      </div>

      {/* Messenger layout container */}
      <div className="max-w-5xl mx-auto rounded-[24px] border border-card-border/60 bg-white dark:bg-[#18181c] overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[520px] shadow-xs">
        
        {/* Left panel: Channels menu */}
        <div className="md:col-span-4 border-r border-card-border/40 p-4 space-y-4 text-left select-none bg-slate-50/20 dark:bg-slate-900/10 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest">Channels</h3>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="px-2 py-1 bg-[#0055ff] hover:bg-[#0044dd] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
              >
                <Plus className="w-3 h-3" />
                <span>New Chat</span>
              </button>
            </div>
            
            <div className="space-y-1.5 overflow-y-auto max-h-[400px] scrollbar-thin">
              {channels.map((chan) => {
                const isActive = chan.id === activeChannelId;
                return (
                  <button
                    key={chan.id}
                    onClick={() => setActiveChannelId(chan.id)}
                    className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all text-left cursor-pointer border-none ${
                      isActive
                        ? "bg-blue-50/80 dark:bg-blue-950/30 text-[#0055ff] shadow-xs"
                        : "hover:bg-slate-50 dark:hover:bg-slate-900/50 text-slate-655"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-heading font-black text-xs ${chan.avatarBg}`}>
                      {chan.avatarInitials}
                    </div>
                    <div className="truncate space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-none truncate">{chan.name}</h4>
                        {chan.lastMessageTime && (
                          <span className="text-[8px] text-slate-400 font-medium shrink-0 ml-1">{chan.lastMessageTime}</span>
                        )}
                      </div>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold leading-none mt-1 truncate">
                        {chan.lastMessage || chan.role}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right panel: Chat messages window */}
        <div className="md:col-span-8 flex flex-col justify-between h-[520px]">
          
          {/* Header info */}
          <div className="p-4 border-b border-card-border/40 flex items-center gap-3 text-left bg-slate-50/10 dark:bg-slate-900/5">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-heading font-black text-xs ${activeChannel.avatarBg}`}>
              {activeChannel.avatarInitials}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-none">{activeChannel.name}</h4>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold mt-1 block">{activeChannel.role}</p>
            </div>
          </div>

          {/* Bubble history */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                <p>No messages yet in this channel.</p>
                <p className="text-[10px] text-slate-400 mt-1">Send a message below to reach out directly to the team.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isStudent = msg.sender === "student";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isStudent ? "justify-end" : "justify-start"} text-left`}
                  >
                    <div className={`max-w-[78%] rounded-[18px] p-3.5 text-xs leading-relaxed font-semibold shadow-xs ${
                      isStudent
                        ? "bg-[#0055ff] text-white rounded-br-sm"
                        : "bg-slate-100 dark:bg-slate-900 border border-card-border/40 text-slate-800 dark:text-slate-200 rounded-bl-sm"
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <span className={`text-[8px] mt-1.5 block text-right font-medium ${isStudent ? "text-white/70" : "text-slate-400"}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input bar */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-card-border/40 bg-slate-50/20 dark:bg-slate-900/10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-450 uppercase">Category:</span>
              <select
                value={messageCategory}
                onChange={(e) => setMessageCategory(e.target.value)}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="General">General</option>
                <option value="FX">FX</option>
                <option value="AI">AI</option>
                <option value="Web Design">Web Design</option>
                <option value="Web Development">Web Development</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="YouTube Monetization">YouTube Monetization</option>
              </select>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900/60 border border-card-border/60 rounded-xl px-3 py-1.5 shadow-xs">
              <input
                type="text"
                placeholder={`Write a message to ${activeChannel.name}...`}
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                disabled={isSending}
                className="w-full text-xs placeholder-slate-400 text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none"
              />
              
              <button
                type="submit"
                disabled={isSending || !typedMessage.trim()}
                className="p-2 rounded-lg bg-[#0055ff] hover:bg-[#0044dd] disabled:opacity-50 text-white transition-all cursor-pointer border-none flex items-center justify-center shrink-0 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

        </div>

      </div>

      {/* New Conversation Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#18181c] w-full max-w-md rounded-[24px] border border-card-border/60 shadow-2xl p-6 space-y-4 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-card-border/40">
              <h3 className="text-sm font-heading font-black text-slate-800 dark:text-white">Start New Conversation</h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStartNewConversation} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Select Department / Instructor</label>
                <select
                  value={newChatChannelId}
                  onChange={(e) => setNewChatChannelId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="helpdesk">General Helpdesk (Student Coordinator)</option>
                  <option value="forex-mentor">JPForex Mentor (Forex Technical Instructor)</option>
                  <option value="ai-support">AI Automation Support (Workflow Mentor)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Message Category / Service</label>
                <select
                  value={newChatCategory}
                  onChange={(e) => setNewChatCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="General">General</option>
                  <option value="FX">FX</option>
                  <option value="AI">AI</option>
                  <option value="Web Design">Web Design</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="YouTube Monetization">YouTube Monetization</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Initial Message</label>
                <textarea
                  placeholder="Type your question, review request, or inquiry..."
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewChatModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0055ff] hover:bg-[#0044dd] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
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
