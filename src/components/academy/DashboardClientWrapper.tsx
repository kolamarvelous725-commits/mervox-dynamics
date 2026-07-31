"use client";

import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { Sidebar } from "@/components/academy/Sidebar";
import { TopBar } from "@/components/academy/TopBar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AcademyDB } from "@/utils/academyDb";
import { supabase } from "@/utils/supabaseClient";

export default function DashboardClientWrapper({ children }: { children: React.ReactNode }) {
  const { student, loading } = useAcademyAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [syncKey, setSyncKey] = useState(0);

  useEffect(() => {
    if (!loading && !student) {
      router.push("/academy/login");
    } else if (student) {
      // 1. Initial background sync
      const runSync = async () => {
        try {
          await AcademyDB.syncFromCloud();
          setSyncKey((prev) => prev + 1);
        } catch (err) {
          console.error("Failed to sync cloud state for student portal:", err);
        }
      };
      runSync();

      // 2. Setup Realtime subscriptions to refresh layout on database updates
      const tablesToListen = ["announcements", "live_classes", "courses", "assignments", "progress", "payments", "certificates"];
      const channels = tablesToListen.map((table) => {
        return supabase
          .channel(`public:${table}-changes`)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: table },
            async (payload) => {
              console.log(`Realtime change in public.${table}:`, payload);
              try {
                await AcademyDB.syncFromCloud();
                setSyncKey((prev) => prev + 1);
              } catch (e) {
                console.error(`Failed to refresh on ${table} change:`, e);
              }
            }
          )
          .subscribe();
      });

      // Cleanup subscriptions on unmount
      return () => {
        channels.forEach((channel) => {
          supabase.removeChannel(channel);
        });
      };
    }
  }, [student, loading, router]);

  if (loading || !student) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0f0f11]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0055ff] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading student portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0f0f11] text-slate-800 dark:text-slate-100">
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main dashboard content panel */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header navigation */}
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Dynamic page container */}
        <main className="flex-1 overflow-y-auto p-6" key={syncKey}>
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
