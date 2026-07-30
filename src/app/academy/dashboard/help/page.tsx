"use client";

import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { AcademyDB } from "@/utils/academyDb";
import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, FileText, Send, CheckCircle2, MessageSquare } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function HelpPage() {
  const { student } = useAcademyAuth();
  const userId = student?.id || "";

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("technical");
  const [ticketDescription, setTicketDescription] = useState("");

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

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDescription.trim()) return;

    alert(`Ticket Submitted Successfully!\nCategory: ${ticketCategory}\nSubject: ${ticketSubject}\n\nOur student coordinators will review this request and reply via Messages shortly.`);
    
    // Log activity
    if (userId) {
      AcademyDB.logActivity(userId, "lesson", `Opened support ticket: ${ticketSubject}`);
      AcademyDB.addNotification(userId, `Support ticket #${Math.floor(1000 + Math.random() * 9000)} created successfully.`);
    }

    setTicketSubject("");
    setTicketDescription("");
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
        
        {/* Left Column: FAQs */}
        <div className="lg:col-span-7 space-y-4">
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
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing & Wallet</option>
                  <option value="account">Account Access</option>
                  <option value="general">General Inquiries</option>
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
                  placeholder="Describe your issue in details so our team can assist you."
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-[#0055ff] hover:bg-[#0044dd] rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket</span>
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
