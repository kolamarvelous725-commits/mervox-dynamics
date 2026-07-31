"use client";

import { useAdminAuth } from "@/context/AdminAuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { isAdminAuthenticated, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAdminAuthenticated) {
        router.push("/admin/dashboard");
      } else {
        router.push("/admin/login");
      }
    }
  }, [isAdminAuthenticated, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0f0f11]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#0055ff] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Verifying session...</span>
      </div>
    </div>
  );
}
