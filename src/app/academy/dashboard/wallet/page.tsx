"use client";

import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { AcademyDB } from "@/utils/academyDb";
import { useState, useEffect } from "react";
import { CreditCard, Download, Plus, DollarSign, Calendar, BookOpen, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Invoice {
  id: string;
  courseTitle: string;
  amount: string;
  status: "Paid" | "Pending";
  date: string;
}

export default function WalletPage() {
  const { student } = useAcademyAuth();
  const userId = student?.id || "";
  const router = useRouter();

  const [coursesEnrolled, setCoursesEnrolled] = useState(0);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardNumber, setCardNumber] = useState("");

  useEffect(() => {
    if (userId) {
      const progress = AcademyDB.getProgress(userId);
      setCoursesEnrolled(progress.length);

      // Generate invoice list based on active course enrollments
      const list = progress.map((p, idx) => {
        let amount = "$199.00";
        if (p.courseId === "forex-trading") amount = "$299.00";
        if (p.courseId === "ai-automation") amount = "$249.00";

        return {
          id: `inv-${1000 + idx}`,
          courseTitle: p.courseId === "forex-trading" 
            ? "Forex Trading Masterclass Access" 
            : p.courseId === "ai-automation" 
              ? "AI & Business Automation Access" 
              : p.courseId === "web-dev" 
                ? "Web & Software Development Access" 
                : "YouTube Algorithm Access",
          amount,
          status: "Paid" as const,
          date: new Date(Date.now() - idx * 24 * 60 * 60 * 1000 * 5).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        };
      });

      setInvoices(list);
    }
  }, [userId]);

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber.trim()) return;
    alert(`Payment Card ending in "${cardNumber.slice(-4)}" successfully linked for auto-renewals.\nThis is simulated for the MVP Portal.`);
    setCardNumber("");
    setShowAddCard(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Financials Portal</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Wallet & Payments</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2 md:mt-0 leading-relaxed font-semibold">
          Review subscription status, download tuition tax invoices, and configure payment cards.
        </p>
      </div>

      {coursesEnrolled === 0 ? (
        /* Empty State */
        <div className="p-8 text-center bg-white dark:bg-[#18181c] border border-card-border/60 rounded-3xl space-y-4 max-w-xl mx-auto my-12">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-card-border flex items-center justify-center mx-auto">
            <CreditCard className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-heading font-bold text-slate-800 dark:text-white">No Payment Records</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              You must enroll in courses to activate payment plans and download tuition tax invoices.
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
        /* Content List */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
          
          {/* Left Column: Balance & Saved Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Balance Card */}
            <div className="p-6 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs space-y-3">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Tuition Ledger</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-heading font-black text-slate-800 dark:text-white">$0.00</span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wide">Fully Paid</span>
              </div>
              <p className="text-[10px] text-slate-550 dark:text-slate-400 leading-relaxed font-semibold">
                Your student account holds zero outstanding balances. Next scheduled payout / subscription invoice is not set.
              </p>
            </div>

            {/* Payment Cards */}
            <div className="p-6 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs space-y-4 select-none">
              <div className="flex justify-between items-center pb-2 border-b border-card-border/40">
                <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Payment Cards</span>
                <button
                  onClick={() => setShowAddCard(!showAddCard)}
                  className="p-1.5 rounded-lg border border-card-border hover:bg-slate-50 dark:hover:bg-slate-900 text-[#0055ff] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {showAddCard ? (
                <form onSubmit={handleAddCard} className="space-y-3 pt-1">
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="Card Number (16 digits)"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0055ff] hover:bg-[#0044dd] text-white font-bold rounded-lg text-[10px] cursor-pointer"
                    >
                      Link Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddCard(false)}
                      className="px-4 py-2 border border-card-border hover:bg-slate-50 rounded-lg text-[10px] text-slate-500 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl border border-card-border/50 bg-slate-50/50 dark:bg-slate-900/30">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-slate-400" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-none">Visa ending in 4242</h4>
                      <p className="text-[9px] text-slate-400 mt-1 block">Expires 12/28</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-blue-100 text-[#0055ff] dark:bg-blue-950/20 dark:text-blue-400">
                    Primary
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Invoice Logs */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Tuition Invoices</h3>
            
            <div className="space-y-3">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-5 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] flex items-center justify-between gap-5 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">{inv.id}</span>
                      <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                        Paid
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-snug">{inv.courseTitle}</h4>
                    <div className="flex gap-4 text-[9px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wide">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {inv.date}
                      </span>
                      <span>Amount: {inv.amount}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Downloading Invoice PDF for ${inv.id}...`)}
                    className="p-2.5 rounded-xl border border-card-border bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-350 cursor-pointer shadow-xs shrink-0"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
