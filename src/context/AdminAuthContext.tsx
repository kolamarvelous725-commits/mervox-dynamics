"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminSupabase, isSupabaseConfigured } from "@/utils/supabaseClient";

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
      if (!isSupabaseConfigured) {
        const active = localStorage.getItem("mervox_academy_admin_active");
        setIsAdminAuthenticated(active === "true");
        setLoading(false);
        return;
      }
      try {
        const { data: { session } } = await adminSupabase.auth.getSession();
        
        if (session?.user) {
          const email = (session.user.email || "").toLowerCase().trim();
          const isAdminEmail = email === "marvelousotugalu012@gmail.com" || email === "kolamarvelous725@gmail.com";

          const { data: profile } = await adminSupabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if ((profile && profile.role === "admin") || isAdminEmail) {
            setIsAdminAuthenticated(true);
            localStorage.setItem("mervox_academy_admin_active", "true");
          } else {
            setIsAdminAuthenticated(false);
            localStorage.removeItem("mervox_academy_admin_active");
          }
        } else {
          setIsAdminAuthenticated(false);
          localStorage.removeItem("mervox_academy_admin_active");
        }
      } catch (err) {
        console.error("Error verifying admin session:", err);
        setIsAdminAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminSession();

    if (!isSupabaseConfigured) return;

    const { data: { subscription } } = adminSupabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setIsAdminAuthenticated(false);
        localStorage.removeItem("mervox_academy_admin_active");
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.user) {
          const email = (session.user.email || "").toLowerCase().trim();
          const isAdminEmail = email === "marvelousotugalu012@gmail.com" || email === "kolamarvelous725@gmail.com";
          
          const { data: profile } = await adminSupabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if ((profile && profile.role === "admin") || isAdminEmail) {
            setIsAdminAuthenticated(true);
            localStorage.setItem("mervox_academy_admin_active", "true");
          } else {
            setIsAdminAuthenticated(false);
            localStorage.removeItem("mervox_academy_admin_active");
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    const targetEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "marvelousotugalu012@gmail.com";
    const targetPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Marv224.";

    if (!isSupabaseConfigured) {
      if (email.toLowerCase().trim() === targetEmail.toLowerCase().trim() && pass === targetPass) {
        setIsAdminAuthenticated(true);
        localStorage.setItem("mervox_academy_admin_active", "true");
        return true;
      }
      return false;
    }

    let networkFailed = false;
    try {
      // 1. Attempt login via isolated Admin Supabase Auth
      let activeUser: any = null;

      const loginRes = await adminSupabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (loginRes.data.user) {
        activeUser = loginRes.data.user;
      }

      // If missing from auth.users, register them automatically
      if (loginRes.error && (loginRes.error.message.includes("Invalid login credentials") || loginRes.error.message.includes("Email not confirmed"))) {
        if (email.toLowerCase().trim() === targetEmail.toLowerCase().trim() && pass === targetPass) {
          console.log("Admin account missing in auth.users. Automatically creating/registering in Supabase Auth...");
          
          const signupResult = await adminSupabase.auth.signUp({
            email,
            password: pass,
            options: {
              data: {
                fullName: "Academy Administrator",
              }
            }
          });

          if (signupResult.error) {
            console.error("Failed to auto-register admin:", signupResult.error);
            throw new Error(signupResult.error.message);
          }

          if (signupResult.data.user) {
            activeUser = signupResult.data.user;
          }

          // If session was not created automatically, re-login to acquire the session tokens
          if (!signupResult.data.session) {
            const retryRes = await adminSupabase.auth.signInWithPassword({
              email,
              password: pass,
            });
            if (retryRes.error) {
              throw new Error(retryRes.error.message);
            }
            if (retryRes.data.user) {
              activeUser = retryRes.data.user;
            }
          }
        } else {
          throw new Error(loginRes.error.message);
        }
      } else if (loginRes.error) {
        throw new Error(loginRes.error.message);
      }

      if (activeUser) {
        let { data: profile } = await adminSupabase
          .from("profiles")
          .select("*")
          .eq("id", activeUser.id)
          .single();

        if (!profile) {
          // Check if profile exists with this email but different ID (pre-registered)
          const { data: preExisting } = await adminSupabase
            .from("profiles")
            .select("*")
            .eq("email", email)
            .single();

          if (preExisting) {
            // Update the pre-existing profile ID to match the new auth user id
            const { data: updatedProfile } = await adminSupabase
              .from("profiles")
              .update({ id: activeUser.id })
              .eq("email", email)
              .select()
              .single();
            profile = updatedProfile;
          } else {
            // Auto-create missing admin profile
            const { data: newProfile, error: insertError } = await adminSupabase
              .from("profiles")
              .upsert({
                id: activeUser.id,
                full_name: "Academy Administrator",
                email: activeUser.email || email,
                role: "admin",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .select()
              .single();

            if (insertError) {
              console.error("Failed to auto-create admin profile:", insertError.message, insertError.details, insertError.hint);
              alert(`Failed to auto-create admin profile: ${insertError.message} (${insertError.details || ""})`);
            } else {
              profile = newProfile;
            }
          }
        }

        if (profile && profile.role === "admin") {
          setIsAdminAuthenticated(true);
          localStorage.setItem("mervox_academy_admin_active", "true");
          return true;
        } else {
          alert("Access Denied: You do not have administrator permissions.");
          await adminSupabase.auth.signOut();
          return false;
        }
      }
    } catch (err: any) {
      console.error("Supabase admin login failed:", err);
      if (err.message?.includes("Failed to fetch") || String(err).includes("Failed to fetch") || err.message?.includes("network error")) {
        networkFailed = true;
      } else {
        alert(`Supabase admin login failed: ${err.message || err}`);
      }
    }

    // 2. Fallback check for local validation (if Supabase is offline OR if the network request failed)
    if (!isSupabaseConfigured || networkFailed) {
      if (email.toLowerCase().trim() === targetEmail.toLowerCase().trim() && pass === targetPass) {
        setIsAdminAuthenticated(true);
        localStorage.setItem("mervox_academy_admin_active", "true");
        alert("⚠️ Note: Supabase database connection failed. Running in Offline Sandbox Mode.");
        return true;
      }
    }

    return false;
  };

  const logout = async () => {
    try {
      await adminSupabase.auth.signOut();
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
