import type { Viewport } from "next";
import AdminDashboardClientWrapper from "@/components/admin/AdminDashboardClientWrapper";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <AdminDashboardClientWrapper>{children}</AdminDashboardClientWrapper>;
}
