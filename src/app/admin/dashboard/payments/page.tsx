"use client";

import { useState, useEffect } from "react";
import { CreditCard, DollarSign, Search, Calendar, UserCheck } from "lucide-react";
import { adminSupabase, isSupabaseConfigured } from "@/utils/supabaseClient";
import AcademyDB from "@/utils/academyDb";

interface PaymentItem {
  id: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  amount: number;
  status: string;
  date: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        if (!isSupabaseConfigured) {
          const students = AcademyDB.getStudents();
          const list = students.map((s, idx) => {
            const amount = [299, 249, 199][idx % 3];
            let courseTitle = "Academy Course Fee";
            if (amount === 299) courseTitle = "Forex Trading Masterclass Access";
            else if (amount === 249) courseTitle = "AI & Business Automation Access";
            else if (amount === 199) courseTitle = "Web & Software Development Access";

            return {
              id: `TXN-OFFLINE-${s.id.toUpperCase()}`,
              studentName: `${s.firstName} ${s.lastName}`,
              studentEmail: s.email,
              courseTitle,
              amount,
              status: "Paid",
              date: s.memberSince || "July 2026",
            };
          });

          setPayments(list);
          setTotalRevenue(list.reduce((sum, p) => sum + p.amount, 0));
          return;
        }

        const { data: payData, error: payError } = await adminSupabase
          .from("payments")
          .select("*, profiles(full_name, email)")
          .order("created_at", { ascending: false });

        if (payError) {
          console.error("Failed to query payments roster:", payError);
        } else if (payData) {
          let revenue = 0;
          const list: PaymentItem[] = payData.map((p: any) => {
            const amt = Number(p.amount) || 0;
            revenue += amt;

            let courseTitle = "Academy Course Fee";
            if (amt === 299) courseTitle = "Forex Trading Masterclass Access";
            else if (amt === 249) courseTitle = "AI & Business Automation Access";
            else if (amt === 199) courseTitle = "Web & Software Development Access";

            return {
              id: p.transaction_id || `TXN-${p.id.slice(0, 8).toUpperCase()}`,
              studentName: p.profiles?.full_name || "Anonymous Student",
              studentEmail: p.profiles?.email || "",
              courseTitle,
              amount: amt,
              status: p.status || "Paid",
              date: new Date(p.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            };
          });

          setPayments(list);
          setTotalRevenue(revenue);
        }
      } catch (err) {
        console.error("Exception loading payments:", err);
      }
    };

    loadPayments();
  }, []);

  const filteredPayments = payments.filter(
    (p) =>
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Finance Center</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Payment Transactions</h2>
        </div>
        
        {/* Total Revenue Display */}
        <div className="mt-3 md:mt-0 p-3 bg-emerald-50/50 dark:bg-emerald-950/15 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-left select-none">
          <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest block">Total Income</span>
          <span className="text-sm font-heading font-black text-emerald-700 dark:text-emerald-450 mt-1 block">
            ${totalRevenue.toLocaleString()}.00 USD
          </span>
        </div>
      </div>

      {/* Roster & Filter */}
      <div className="space-y-4 text-left">
        
        {/* Search */}
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search payments by student name, email, course, or transaction ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white dark:bg-[#18181c] border border-card-border/60 text-slate-850 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
          />
        </div>

        {/* Ledger table */}
        <div className="rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-card-border/40 text-[9px] font-black uppercase text-slate-455 tracking-wider text-left select-none">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Course Tuition</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border/40 text-xs font-semibold">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-450">
                      No matching payments found in the transaction registry.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/20">
                      <td className="px-6 py-4 text-slate-450 uppercase font-black tracking-wide font-heading text-[10px]">
                        {p.id}
                      </td>
                      <td className="px-6 py-4">
                        <h4 className="font-bold text-slate-850 dark:text-white leading-none">
                          {p.studentName}
                        </h4>
                        <span className="text-[9px] text-slate-400 mt-1 block truncate max-w-[150px] leading-none">
                          {p.studentEmail}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-655 dark:text-slate-350">
                        {p.courseTitle}
                      </td>
                      <td className="px-6 py-4 text-slate-800 dark:text-white font-black text-sm">
                        ${p.amount}.00
                      </td>
                      <td className="px-6 py-4 text-slate-450 font-bold uppercase tracking-wider text-[10px]">
                        {p.date}
                      </td>
                      <td className="px-6 py-4 text-right select-none">
                        <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
