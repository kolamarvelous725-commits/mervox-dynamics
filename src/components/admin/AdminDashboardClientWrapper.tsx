"use client";

import { useAdminAuth } from "@/context/AdminAuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { AcademyDB } from "@/utils/academyDb";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboardClientWrapper({ children }: { children: React.ReactNode }) {
  const { isAdminAuthenticated, loading } = useAdminAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!loading && !isAdminAuthenticated) {
      router.push("/admin/login");
    } else if (isAdminAuthenticated) {
      const syncData = async () => {
        setSyncing(true);
        try {
          await AcademyDB.syncFromCloud();
        } catch (e) {}
        setSyncing(false);
      };
      syncData();
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
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
