"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const active = localStorage.getItem("mervox_academy_admin_active");
      if (active === "true") {
        setIsAdminAuthenticated(true);
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    // Admin credentials from user spec
    const targetEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "marvelousotugalu012@gmail.com";
    const targetPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Marv224.";

    if (email.toLowerCase().trim() === targetEmail.toLowerCase().trim() && pass === targetPass) {
      setIsAdminAuthenticated(true);
      localStorage.setItem("mervox_academy_admin_active", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem("mervox_academy_admin_active");
    router.push("/admin/login");
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
