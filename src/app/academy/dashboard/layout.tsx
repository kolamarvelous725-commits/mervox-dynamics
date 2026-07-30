import type { Viewport } from "next";
import DashboardClientWrapper from "@/components/academy/DashboardClientWrapper";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardClientWrapper>{children}</DashboardClientWrapper>;
}
