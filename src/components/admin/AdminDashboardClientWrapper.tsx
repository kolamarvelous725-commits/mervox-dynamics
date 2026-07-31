"use client";

import { useAdminAuth } from "@/context/AdminAuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { AcademyDB } from "@/utils/academyDb";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function AdminDashboardClientWrapper({ children }: { children: React.ReactNode }) {
  const { isAdminAuthenticated, loading } = useAdminAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncKey, setSyncKey] = useState(0);

  useEffect(() => {
    if (!loading && !isAdminAuthenticated) {
      router.push("/admin/login");
    } else if (isAdminAuthenticated) {
      // 1. Initial background sync
      const syncData = async () => {
        setSyncing(true);
        try {
          await AcademyDB.syncFromCloud();
          setSyncKey((prev) => prev + 1);
        } catch (e) {}
        setSyncing(false);
      };
      syncData();

      // 2. Setup Realtime subscriptions to refresh admin layout
      const tablesToListen = ["profiles", "enrollments", "progress", "quizzes", "certificates", "messages", "payments", "live_classes", "courses", "announcements", "assignments"];
      const channels = tablesToListen.map((table) => {
        return supabase
          .channel(`admin:${table}-changes`)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: table },
            async (payload) => {
              console.log(`Admin Realtime change in public.${table}:`, payload);
              try {
                await AcademyDB.syncFromCloud();
                setSyncKey((prev) => prev + 1);
              } catch (e) {
                console.error(`Failed to refresh admin on ${table} change:`, e);
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
  }, [isAdminAuthenticated, loading, router]);

  if (loading || !isAdminAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0f0f11]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0055ff] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Verifying administrative access...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0f0f11] text-slate-800 dark:text-slate-100">
      {/* Sidebar navigation */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main admin content panel */}
      <div className="flex flex-col flex-grow overflow-hidden">
        {/* Top header navigation */}
        <AdminTopBar onMenuClick={() => setSidebarOpen(true)} />

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
