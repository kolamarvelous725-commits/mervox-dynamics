"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Student } from "@/types/academy";
import { supabase } from "@/utils/supabaseClient";

interface AcademyAuthContextType {
  student: Student | null;
  loading: boolean;
  signup: (userData: Omit<Student, "id" | "memberSince" | "avatarUrl"> & { password: string }) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updatedData: Partial<Student>) => Promise<void>;
  changePassword: (oldPw: string, newPw: string) => Promise<boolean>;
  loginWithGoogle: (email: string, name: string) => Promise<void>;
}

const AcademyAuthContext = createContext<AcademyAuthContextType | undefined>(undefined);

export function AcademyAuthProvider({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profile) {
            if (profile.suspended) {
              localStorage.removeItem("mervox_academy_current_user");
              setStudent(null);
              await supabase.auth.signOut();
              alert("Your account has been suspended by the administrator.");
            } else {
              const studentData: Student = {
                id: profile.id,
                firstName: profile.first_name,
                lastName: profile.last_name,
                email: profile.email,
                phone: profile.phone || "",
                country: profile.country || "",
                memberSince: profile.member_since,
                avatarUrl: profile.avatar_url || "",
                bio: profile.bio || "",
                occupation: profile.occupation || "",
                dob: profile.dob || "",
                socials: profile.socials || {},
              };
              setStudent(studentData);
              localStorage.setItem("mervox_academy_current_user", JSON.stringify(studentData));
            }
          } else {
            setStudent(null);
            localStorage.removeItem("mervox_academy_current_user");
          }
        } else {
          setStudent(null);
          localStorage.removeItem("mervox_academy_current_user");
        }
      } catch (err) {
        console.error("Error checking session:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setStudent(null);
        localStorage.removeItem("mervox_academy_current_user");
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profile) {
            if (profile.suspended) {
              setStudent(null);
              localStorage.removeItem("mervox_academy_current_user");
              await supabase.auth.signOut();
            } else {
              const studentData: Student = {
                id: profile.id,
                firstName: profile.first_name,
                lastName: profile.last_name,
                email: profile.email,
                phone: profile.phone || "",
                country: profile.country || "",
                memberSince: profile.member_since,
                avatarUrl: profile.avatar_url || "",
                bio: profile.bio || "",
                occupation: profile.occupation || "",
                dob: profile.dob || "",
                socials: profile.socials || {},
              };
              setStudent(studentData);
              localStorage.setItem("mervox_academy_current_user", JSON.stringify(studentData));
            }
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signup = async (userData: Omit<Student, "id" | "memberSince" | "avatarUrl"> & { password: string }) => {
    // Register the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          country: userData.country,
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Failed to create user session in Supabase.");
    }

    // Wait slightly to let the database trigger insert public.profiles
    let profile = null;
    for (let i = 0; i < 5; i++) {
      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      if (p) {
        profile = p;
        break;
      }
      await new Promise((r) => setTimeout(r, 500));
    }

    if (profile) {
      const studentData: Student = {
        id: profile.id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: profile.email,
        phone: profile.phone || "",
        country: profile.country || "",
        memberSince: profile.member_since,
        avatarUrl: profile.avatar_url || "",
        bio: profile.bio || "",
        occupation: profile.occupation || "",
        dob: profile.dob || "",
        socials: profile.socials || {},
      };
      setStudent(studentData);
      localStorage.setItem("mervox_academy_current_user", JSON.stringify(studentData));
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return false;
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (!profile) {
        alert("Account profile missing.");
        await supabase.auth.signOut();
        return false;
      }

      if (profile.suspended) {
        alert("Your account has been suspended by the administrator.");
        await supabase.auth.signOut();
        return false;
      }

      const studentData: Student = {
        id: profile.id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: profile.email,
        phone: profile.phone || "",
        country: profile.country || "",
        memberSince: profile.member_since,
        avatarUrl: profile.avatar_url || "",
        bio: profile.bio || "",
        occupation: profile.occupation || "",
        dob: profile.dob || "",
        socials: profile.socials || {},
      };

      setStudent(studentData);
      localStorage.setItem("mervox_academy_current_user", JSON.stringify(studentData));
      return true;
    }

    return false;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setStudent(null);
    localStorage.removeItem("mervox_academy_current_user");
  };

  const updateProfile = async (updatedData: Partial<Student>) => {
    if (!student) return;

    const dbData: any = {};
    if (updatedData.firstName !== undefined) dbData.first_name = updatedData.firstName;
    if (updatedData.lastName !== undefined) dbData.last_name = updatedData.lastName;
    if (updatedData.phone !== undefined) dbData.phone = updatedData.phone;
    if (updatedData.country !== undefined) dbData.country = updatedData.country;
    if (updatedData.avatarUrl !== undefined) dbData.avatar_url = updatedData.avatarUrl;
    if (updatedData.bio !== undefined) dbData.bio = updatedData.bio;
    if (updatedData.occupation !== undefined) dbData.occupation = updatedData.occupation;
    if (updatedData.dob !== undefined) dbData.dob = updatedData.dob;
    if (updatedData.socials !== undefined) {
      dbData.socials = {
        ...student.socials,
        ...updatedData.socials,
      };
    }

    const { error } = await supabase
      .from("profiles")
      .update(dbData)
      .eq("id", student.id);

    if (error) {
      throw new Error(error.message);
    }

    const newStudentSession: Student = {
      ...student,
      ...updatedData,
      socials: {
        ...student.socials,
        ...updatedData.socials,
      },
    };
    
    setStudent(newStudentSession);
    localStorage.setItem("mervox_academy_current_user", JSON.stringify(newStudentSession));
  };

  const changePassword = async (oldPw: string, newPw: string): Promise<boolean> => {
    if (!student) return false;

    // Verify old password by attempting to sign in
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: student.email,
      password: oldPw,
    });

    if (signInErr) {
      return false;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPw,
    });

    return !error;
  };

  const loginWithGoogle = async (email: string, name: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/academy/dashboard",
      }
    });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <AcademyAuthContext.Provider value={{ student, loading, signup, login, logout, updateProfile, changePassword, loginWithGoogle }}>
      {children}
    </AcademyAuthContext.Provider>
  );
}

export function useAcademyAuth() {
  const context = useContext(AcademyAuthContext);
  if (!context) {
    throw new Error("useAcademyAuth must be used within an AcademyAuthProvider");
  }
  return context;
}
