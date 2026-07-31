"use client";

import { AcademyDB } from "@/utils/academyDb";
import { useState, useEffect } from "react";
import { CreditCard, DollarSign, Search, Calendar, UserCheck } from "lucide-react";

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
    const students = AcademyDB.getStudents();
    const courses = AcademyDB.getCourses();

    const list: PaymentItem[] = [];
    let revenue = 0;

    students.forEach((student: any) => {
      const progress = student.progress || [];
      progress.forEach((p: any, idx: number) => {
        const course = courses.find((c) => c.id === p.courseId);
        
        let cost = 199;
        if (p.courseId === "forex-trading") cost = 299;
        if (p.courseId === "ai-automation") cost = 249;

        revenue += cost;
        
        list.push({
          id: `TXN-${student.id.substring(0, 4).toUpperCase()}-${idx}584`,
          studentName: `${student.firstName} ${student.lastName}`,
          studentEmail: student.email,
          courseTitle: course ? course.title : p.courseId,
          amount: cost,
          status: "Paid",
          date: student.memberSince || "July 2026",
        });
      });
    });

    setPayments(list);
    setTotalRevenue(revenue);
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
