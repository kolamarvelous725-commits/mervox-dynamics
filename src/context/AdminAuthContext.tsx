"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

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
    const checkAdminSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profile && profile.role === "admin") {
            setIsAdminAuthenticated(true);
            localStorage.setItem("mervox_academy_admin_active", "true");
          } else {
            setIsAdminAuthenticated(false);
            localStorage.removeItem("mervox_academy_admin_active");
          }
        } else {
          const active = localStorage.getItem("mervox_academy_admin_active");
          if (active === "true") {
            setIsAdminAuthenticated(true);
          } else {
            setIsAdminAuthenticated(false);
          }
        }
      } catch (err) {
        console.error("Error verifying admin session:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAdminSession();
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    const targetEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "marvelousotugalu012@gmail.com";
    const targetPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Marv224.";

    try {
      // 1. Attempt login via Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profile && profile.role === "admin") {
          setIsAdminAuthenticated(true);
          localStorage.setItem("mervox_academy_admin_active", "true");
          return true;
        } else {
          alert("Access Denied: You do not have administrator permissions.");
          await supabase.auth.signOut();
          return false;
        }
      }
    } catch (err) {
      console.warn("Supabase admin auth failed, checking fallback local credentials:", err);
    }

    // 2. Fallback local credential check
    if (email.toLowerCase().trim() === targetEmail.toLowerCase().trim() && pass === targetPass) {
      setIsAdminAuthenticated(true);
      localStorage.setItem("mervox_academy_admin_active", "true");
      return true;
    }

    return false;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
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
