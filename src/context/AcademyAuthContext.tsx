"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Student } from "@/types/academy";
import { supabase, isSupabaseConfigured } from "@/utils/supabaseClient";

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

const getNamesAndDate = (profile: any) => {
  const parts = (profile.full_name || "").trim().split(/\s+/);
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";
  
  let memberSince = "Joined";
  if (profile.created_at) {
    try {
      memberSince = new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } catch {}
  }
  
  return { firstName, lastName, memberSince };
};

export function AcademyAuthProvider({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem("mervox_academy_current_user");
        if (stored) {
          try {
            setStudent(JSON.parse(stored));
          } catch {
            setStudent(null);
          }
        } else {
          setStudent(null);
        }
        setLoading(false);
        return;
      }
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          let { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (!profile) {
            // Auto-create missing profile
            const email = session.user.email || "";
            const role = email === "marvelousotugalu012@gmail.com" ? "admin" : "student";
            const meta = session.user.user_metadata || {};
            const fullName = meta.fullName || `${meta.firstName || ""} ${meta.lastName || ""}`.trim() || email.split("@")[0];
            const phone = meta.phone || "";
            const country = meta.country || "";

            const { data: newProfile } = await supabase
              .from("profiles")
              .upsert({
                id: session.user.id,
                full_name: fullName,
                email: email,
                role: role,
                phone: phone,
                country: country,
                avatar_url: "",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .select()
              .single();

            profile = newProfile;
          }

          if (profile) {
            if (profile.role === "admin") {
              localStorage.removeItem("mervox_academy_current_user");
              setStudent(null);
            } else if (profile.suspended) {
              localStorage.removeItem("mervox_academy_current_user");
              setStudent(null);
              await supabase.auth.signOut();
              alert("Your account has been suspended by the administrator.");
            } else {
              const { firstName, lastName, memberSince } = getNamesAndDate(profile);
              const studentData: Student = {
                id: profile.id,
                firstName,
                lastName,
                email: profile.email,
                phone: profile.phone || "",
                country: profile.country || "",
                memberSince,
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    if (!isSupabaseConfigured) {
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setStudent(null);
        localStorage.removeItem("mervox_academy_current_user");
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.user) {
          let { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (!profile) {
            // Auto-create missing profile
            const email = session.user.email || "";
            const role = email === "marvelousotugalu012@gmail.com" ? "admin" : "student";
            const meta = session.user.user_metadata || {};
            const fullName = meta.fullName || `${meta.firstName || ""} ${meta.lastName || ""}`.trim() || email.split("@")[0];
            const phone = meta.phone || "";
            const country = meta.country || "";

            const { data: newProfile } = await supabase
              .from("profiles")
              .insert({
                id: session.user.id,
                full_name: fullName,
                email: email,
                role: role,
                phone: phone,
                country: country,
                avatar_url: "",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .select()
              .single();

            profile = newProfile;
          }

          if (profile) {
            if (profile.role === "admin") {
              setStudent(null);
              localStorage.removeItem("mervox_academy_current_user");
            } else if (profile.suspended) {
              setStudent(null);
              localStorage.removeItem("mervox_academy_current_user");
              await supabase.auth.signOut();
            } else {
              const { firstName, lastName, memberSince } = getNamesAndDate(profile);
              const studentData: Student = {
                id: profile.id,
                firstName,
                lastName,
                email: profile.email,
                phone: profile.phone || "",
                country: profile.country || "",
                memberSince,
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
    if (!isSupabaseConfigured) {
      const newId = "student-" + Math.random().toString(36).substring(2, 9);
      const memberSince = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
      const studentData = {
        id: newId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || "",
        country: userData.country || "",
        memberSince,
        avatarUrl: "",
        bio: "",
        occupation: "",
        dob: "",
        socials: {},
        password: userData.password,
        role: "student",
      };

      const usersJson = localStorage.getItem("mervox_academy_users");
      const users = usersJson ? JSON.parse(usersJson) : [];
      users.push(studentData);
      localStorage.setItem("mervox_academy_users", JSON.stringify(users));

      setStudent(studentData);
      localStorage.setItem("mervox_academy_current_user", JSON.stringify(studentData));
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          fullName: `${userData.firstName} ${userData.lastName}`.trim(),
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

    // Fallback: If trigger did not create it in time, auto-create it
    if (!profile) {
      const email = data.user.email || "";
      const role = email === "marvelousotugalu0125@gmail.com" || email === "marvelousotugalu012@gmail.com" ? "admin" : "student";
      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          full_name: `${userData.firstName} ${userData.lastName}`.trim(),
          email: email,
          role: role,
          phone: userData.phone,
          country: userData.country,
          avatar_url: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (insertError) {
        console.error("Fallback profile creation failed on signup. Supabase Error:", insertError);
      } else {
        profile = newProfile;
      }
    }

    if (profile) {
      const { firstName, lastName, memberSince } = getNamesAndDate(profile);
      const studentData: Student = {
        id: profile.id,
        firstName,
        lastName,
        email: profile.email,
        phone: profile.phone || "",
        country: profile.country || "",
        memberSince,
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
    if (!isSupabaseConfigured) {
      const usersJson = localStorage.getItem("mervox_academy_users");
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      if (users.length === 0) {
        const defaultStudent = {
          id: "student-default",
          firstName: "John",
          lastName: "Doe",
          email: "student@mervoxdynamic.com",
          phone: "+234 812 345 6789",
          country: "Nigeria",
          memberSince: "July 2026",
          avatarUrl: "",
          bio: "Student exploring forex and AI automation.",
          occupation: "Trader",
          dob: "2000-01-01",
          socials: {},
          password: "student123",
          role: "student",
        };
        users.push(defaultStudent);
        localStorage.setItem("mervox_academy_users", JSON.stringify(users));
      }

      const matched = users.find(
        (u: any) => u.email.toLowerCase().trim() === email.toLowerCase().trim() && u.password === password
      );

      if (matched) {
        if (matched.suspended) {
          alert("Your account has been suspended by the administrator.");
          return false;
        }
        const studentData: Student = {
          id: matched.id,
          firstName: matched.firstName,
          lastName: matched.lastName,
          email: matched.email,
          phone: matched.phone || "",
          country: matched.country || "",
          memberSince: matched.memberSince || "Joined",
          avatarUrl: matched.avatarUrl || "",
          bio: matched.bio || "",
          occupation: matched.occupation || "",
          dob: matched.dob || "",
          socials: matched.socials || {},
        };
        setStudent(studentData);
        localStorage.setItem("mervox_academy_current_user", JSON.stringify(studentData));
        return true;
      }
      alert("Invalid student email or password.");
      return false;
    }

    let networkFailed = false;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return false;
      }

      if (data.user) {
        let { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (!profile) {
          // Automatically create missing profile during login
          const role = email === "marvelousotugalu012@gmail.com" ? "admin" : "student";
          const meta = data.user.user_metadata || {};
          const fullName = meta.fullName || `${meta.firstName || ""} ${meta.lastName || ""}`.trim() || email.split("@")[0];
          const phone = meta.phone || "";
          const country = meta.country || "";

          const { data: newProfile, error: insertError } = await supabase
            .from("profiles")
            .upsert({
              id: data.user.id,
              full_name: fullName,
              email: email,
              role: role,
              phone: phone,
              country: country,
              avatar_url: "",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (insertError) {
            console.error("Failed to auto-create profile during login. Supabase Error:", insertError);
            alert(`Failed to initialize your user profile: ${insertError.message || JSON.stringify(insertError)}`);
            await supabase.auth.signOut();
            return false;
          }
          profile = newProfile;
        }

        if (profile.suspended) {
          alert("Your account has been suspended by the administrator.");
          await supabase.auth.signOut();
          return false;
        }

        const { firstName, lastName, memberSince } = getNamesAndDate(profile);
        const studentData: Student = {
          id: profile.id,
          firstName,
          lastName,
          email: profile.email,
          phone: profile.phone || "",
          country: profile.country || "",
          memberSince,
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
    } catch (err: any) {
      console.error("Supabase student login failed:", err);
      if (err.message?.includes("Failed to fetch") || String(err).includes("Failed to fetch") || err.message?.includes("network error")) {
        networkFailed = true;
      } else {
        alert(`Login failed: ${err.message || err}`);
        return false;
      }
    }

    if (networkFailed) {
      const usersJson = localStorage.getItem("mervox_academy_users");
      const users = usersJson ? JSON.parse(usersJson) : [];
      const matched = users.find(
        (u: any) => u.email.toLowerCase().trim() === email.toLowerCase().trim() && u.password === password
      );

      if (matched) {
        if (matched.suspended) {
          alert("Your account has been suspended by the administrator.");
          return false;
        }
        const studentData: Student = {
          id: matched.id,
          firstName: matched.firstName,
          lastName: matched.lastName,
          email: matched.email,
          phone: matched.phone || "",
          country: matched.country || "",
          memberSince: matched.memberSince || "Joined",
          avatarUrl: matched.avatarUrl || "",
          bio: matched.bio || "",
          occupation: matched.occupation || "",
          dob: matched.dob || "",
          socials: matched.socials || {},
        };
        setStudent(studentData);
        localStorage.setItem("mervox_academy_current_user", JSON.stringify(studentData));
        alert("⚠️ Note: Supabase database connection failed. Running in Offline Sandbox Mode.");
        return true;
      }
      alert("Invalid student email or password (Offline Sandbox Mode).");
      return false;
    }

    return false;
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    setStudent(null);
    localStorage.removeItem("mervox_academy_current_user");
  };

  const updateProfile = async (updatedData: Partial<Student>) => {
    if (!student) return;

    if (!isSupabaseConfigured) {
      const usersJson = localStorage.getItem("mervox_academy_users");
      const users = usersJson ? JSON.parse(usersJson) : [];
      const updatedUsers = users.map((u: any) => {
        if (u.id === student.id) {
          return {
            ...u,
            ...updatedData,
            socials: {
              ...u.socials,
              ...updatedData.socials,
            },
          };
        }
        return u;
      });
      localStorage.setItem("mervox_academy_users", JSON.stringify(updatedUsers));

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
      return;
    }

    const dbData: any = {};
    if (updatedData.firstName !== undefined || updatedData.lastName !== undefined) {
      const currentFirst = updatedData.firstName !== undefined ? updatedData.firstName : student.firstName;
      const currentLast = updatedData.lastName !== undefined ? updatedData.lastName : student.lastName;
      dbData.full_name = `${currentFirst} ${currentLast}`.trim();
    }
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
    dbData.updated_at = new Date().toISOString();

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

    if (!isSupabaseConfigured) {
      const usersJson = localStorage.getItem("mervox_academy_users");
      const users = usersJson ? JSON.parse(usersJson) : [];
      let updated = false;
      const updatedUsers = users.map((u: any) => {
        if (u.id === student.id && u.password === oldPw) {
          updated = true;
          return {
            ...u,
            password: newPw,
          };
        }
        return u;
      });
      if (updated) {
        localStorage.setItem("mervox_academy_users", JSON.stringify(updatedUsers));
        return true;
      }
      return false;
    }

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
    if (!isSupabaseConfigured) {
      const parts = name.trim().split(/\s+/);
      const firstName = parts[0] || "";
      const lastName = parts.slice(1).join(" ") || "";
      const mockStudent: Student = {
        id: "student-google",
        firstName,
        lastName,
        email,
        phone: "",
        country: "",
        memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        avatarUrl: "",
        bio: "",
        occupation: "",
        dob: "",
        socials: {},
      };
      setStudent(mockStudent);
      localStorage.setItem("mervox_academy_current_user", JSON.stringify(mockStudent));
      window.location.href = "/academy/dashboard";
      return;
    }

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
