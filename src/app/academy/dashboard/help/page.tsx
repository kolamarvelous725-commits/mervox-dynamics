"use client";

import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { AcademyDB } from "@/utils/academyDb";
import { useState, useEffect } from "react";
import { HelpCircle, ChevronDown, ChevronUp, FileText, Send, CheckCircle2, MessageSquare, Clock, Tag, ArrowRight } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/utils/supabaseClient";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
}

interface SubmittedTicket {
  id: string;
  category: string;
  subject: string;
  description: string;
  time: string;
  status: string;
}

export default function HelpPage() {
  const { student } = useAcademyAuth();
  const userId = student?.id || "";

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("Technical");
  const [ticketDescription, setTicketDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myTickets, setMyTickets] = useState<SubmittedTicket[]>([]);

  const faqs: FAQItem[] = [
    {
      question: "How do I unlock my course completion certificate?",
      answer: "To earn a course certificate, you must complete all 20 lessons (reaching 100% progress) and successfully pass the course qualification quiz. Once both requirements are met, your certificate will automatically generate and become available for download in the Certificates tab.",
    },
    {
      question: "How do I download my payment tax invoices?",
      answer: "Invoices for course sign-ups are automatically generated. You can view, review, and download PDF copies of all past invoices from the Wallet & Payments section of your dashboard.",
    },
    {
      question: "Where can I join the upcoming live classes?",
      answer: "Upcoming streams are listed under the Live Classes tab. If there is an active stream, click the 'Join Session' button to connect directly. Recorded past mentoring sessions are also archived there.",
    },
    {
      question: "Can I edit my registered account profile details?",
      answer: "Yes, you can edit your name, phone number, country, occupation, date of birth, bio, and password at any time inside the Profile Settings tab. Saving changes updates the details everywhere across your dashboard.",
    },
  ];

  const loadMyTickets = async () => {
    if (!userId) return;
    try {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem(`mervox_tickets_${userId}`);
        if (stored) {
          setMyTickets(JSON.parse(stored));
        }
        return;
      }

      // Query from dedicated support_tickets table
      const { data: dbTickets, error: ticketsErr } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (dbTickets && dbTickets.length > 0) {
        setMyTickets(
          dbTickets.map((t: any) => ({
            id: t.id,
            category: t.category || "General",
            subject: t.subject || "Support Inquiry",
            description: t.description || "",
            time: t.created_at ? new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recently",
            status: t.status || "active",
          }))
        );
        return;
      }

      // Fallback query from messages table
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("user_id", userId)
        .eq("channel_id", "helpdesk")
        .order("created_at", { ascending: false });

      if (data) {
        const extracted: SubmittedTicket[] = [];
        data.forEach((m: any) => {
          if (m.text && m.text.includes("[SUPPORT TICKET:")) {
            const match = m.text.match(/\[SUPPORT TICKET:\s*([^\]]+)\]/);
            const ticketId = match ? match[1].trim() : `TKT-${m.id.substring(0, 6)}`;
            
            let category = "General";
            if (ticketId.includes("-")) {
              category = ticketId.split("-")[1] || "General";
            }

            let subject = "Support Inquiry";
            const subMatch = m.text.match(/Subject:\s*([^\n]+)/);
            if (subMatch) {
              subject = subMatch[1].trim();
            }

            extracted.push({
              id: ticketId,
              category,
              subject,
              description: m.text,
              time: m.time || "Recently",
              status: "Open",
            });
          }
        });
        setMyTickets(extracted);
      }
    } catch (err) {
      console.error("Failed to load student tickets:", err);
    }
  };

  useEffect(() => {
    loadMyTickets();

    if (!isSupabaseConfigured || !userId) return;

    const channel = supabase
      .channel(`student_tickets_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "support_tickets",
          filter: `user_id=eq.${userId}`,
        },
        async (payload: any) => {
          loadMyTickets();
          if (payload.eventType === "UPDATE" && payload.new && payload.new.status === "resolved") {
            const ticketId = payload.new.id;
            await AcademyDB.addNotification(userId, `Your support ticket #${ticketId} has been resolved.`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDescription.trim() || !userId) return;

    setIsSubmitting(true);
    const ticketId = `TKT-${ticketCategory.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const formattedText = `[SUPPORT TICKET: ${ticketId}]\nSubject: ${ticketSubject.trim()}\nCategory: ${ticketCategory}\n\n${ticketDescription.trim()}`;

    try {
      if (!isSupabaseConfigured) {
        const newTicket: SubmittedTicket = {
          id: ticketId,
          category: ticketCategory,
          subject: ticketSubject.trim(),
          description: ticketDescription.trim(),
          time: timestamp,
          status: "Open",
        };
        const updated = [newTicket, ...myTickets];
        setMyTickets(updated);
        localStorage.setItem(`mervox_tickets_${userId}`, JSON.stringify(updated));
        AcademyDB.logActivity(userId, "lesson", `Opened support ticket #${ticketId}`);
        AcademyDB.addNotification(userId, `Support ticket #${ticketId} created successfully.`);
        alert(`Ticket ${ticketId} submitted successfully! Our student coordinators will reply shortly.`);
        setTicketSubject("");
        setTicketDescription("");
        setIsSubmitting(false);
        return;
      }

      // 1. Insert into support_tickets table
      try {
        await supabase.from("support_tickets").insert({
          id: ticketId,
          user_id: userId,
          student_name: `${student?.firstName || ""} ${student?.lastName || ""}`.trim() || "Student Account",
          category: ticketCategory,
          subject: ticketSubject.trim(),
          description: ticketDescription.trim(),
          status: "active",
        });
      } catch (stErr) {
        console.warn("Notice: support_tickets table insert warning:", stErr);
      }

      // 2. Also insert into messages under helpdesk channel so it streams in Chat
      const { error } = await supabase.from("messages").insert({
        user_id: userId,
        channel_id: "helpdesk",
        text: formattedText,
        sender: "student",
        time: timestamp,
      });

      if (error) {
        alert(`Failed to submit ticket: ${error.message}`);
      } else {
        alert(`Ticket #${ticketId} submitted successfully! You can track responses here or in Direct Messages.`);
        setTicketSubject("");
        setTicketDescription("");
        loadMyTickets();
      }
    } catch (err: any) {
      console.error("Exception submitting ticket:", err);
      alert(`Error submitting ticket: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Help Center</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Help & Support</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2 md:mt-0 leading-relaxed font-semibold">
          Find fast answers in our knowledge base or submit a support ticket to our student coordinators.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Left Column: FAQs & My Tickets */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* My Submitted Tickets */}
          {myTickets.length > 0 && (
            <div className="p-5 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-card-border/40">
                <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#0055ff]" />
                  My Submitted Support Tickets
                </h3>
                <Link
                  href="/academy/dashboard/messages"
                  className="text-[11px] font-bold text-[#0055ff] hover:underline flex items-center gap-1"
                >
                  <span>Open Messages</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="divide-y divide-card-border/30 space-y-2.5">
                {myTickets.map((t) => (
                  <div key={t.id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-50 text-[#0055ff] dark:bg-blue-950/40">
                          {t.id}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{t.category}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">{t.subject}</h4>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                      t.status === "resolved"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : t.status === "in_progress"
                        ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                        : "bg-blue-50 text-[#0055ff] dark:bg-blue-950/40 dark:text-blue-400"
                    }`}>
                      {t.status === "in_progress" ? "In Progress" : t.status === "active" ? "Active" : t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Frequently Asked Questions</h3>
            
            <div className="space-y-2 select-none">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-card-border bg-white dark:bg-[#18181c] overflow-hidden transition-all shadow-xs"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-4 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all border-none bg-transparent"
                    >
                      <span className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 border-t border-card-border/20">
                        <p className="text-xs text-slate-550 dark:text-slate-450 leading-relaxed font-semibold">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Submit Ticket Form */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-card-border/40">
              <MessageSquare className="w-5 h-5 text-[#0055ff]" />
              <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Open Support Ticket</span>
            </div>

            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#0055ff]"
                >
                  <option value="Technical">Technical Issue</option>
                  <option value="Billing">Billing & Wallet</option>
                  <option value="Account">Account Access</option>
                  <option value="General">General Inquiries</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Subject</label>
                <input
                  type="text"
                  placeholder="Summarize the support request"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#0055ff]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Description</label>
                <textarea
                  placeholder="Provide comprehensive details about your inquiry..."
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-[#0055ff] hover:bg-[#0044dd] rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Submitting Ticket..." : "Submit Support Ticket"}</span>
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
