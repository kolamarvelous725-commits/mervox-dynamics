import { AdminAuthProvider } from "@/context/AdminAuthContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mervox Academy | Administrator Portal",
  description: "Secure Admin workspace for course, quiz, student status, and certificate controls.",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
