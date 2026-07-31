"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Student } from "@/types/academy";
import { AcademyDB } from "@/utils/academyDb";

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

// Simple hash simulation for user password protection
const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return `mvx_${hash.toString(36)}`;
};

export function AcademyAuthProvider({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrateAndSync = async () => {
      // Fetch latest registered users database from cloud
      await AcademyDB.syncFromCloud();

      const storedUser = localStorage.getItem("mervox_academy_current_user");
      if (storedUser) {
        try {
          const current = JSON.parse(storedUser);
          let studentData = current;

          // Enforce suspended status & update profile from cloud sync
          const usersJson = localStorage.getItem("mervox_academy_users");
          if (usersJson) {
            const users = JSON.parse(usersJson);
            const matched = users.find((u: any) => u.id === current.id);
            if (matched) {
              if (matched.suspended) {
                localStorage.removeItem("mervox_academy_current_user");
                setStudent(null);
                alert("Your account has been suspended by the administrator.");
                setLoading(false);
                return;
              }
              
              // Build updated student data from synced cloud profile!
              studentData = {
                id: matched.id,
                firstName: matched.firstName,
                lastName: matched.lastName,
                email: matched.email,
                phone: matched.phone || "",
                country: matched.country || "",
                memberSince: matched.memberSince,
                avatarUrl: matched.avatarUrl || "",
                bio: matched.bio || "",
                occupation: matched.occupation || "",
                dob: matched.dob || "",
                socials: matched.socials || {},
              };
              localStorage.setItem("mervox_academy_current_user", JSON.stringify(studentData));

              // Update local device keys from the synced users record
              if (matched.progress) localStorage.setItem(`mervox_academy_progress_${matched.id}`, JSON.stringify(matched.progress));
              if (matched.quizzes) localStorage.setItem(`mervox_academy_quizzes_${matched.id}`, JSON.stringify(matched.quizzes));
              if (matched.certificates) localStorage.setItem(`mervox_academy_certificates_${matched.id}`, JSON.stringify(matched.certificates));
              if (matched.activity) localStorage.setItem(`mervox_academy_activity_${matched.id}`, JSON.stringify(matched.activity));
              if (matched.notifications) localStorage.setItem(`mervox_academy_notifications_${matched.id}`, JSON.stringify(matched.notifications));
            }
          }

          setStudent(studentData);
        } catch (err) {
          console.error("Failed to parse current student", err);
        }
      }
      setLoading(false);
    };

    hydrateAndSync();
  }, []);

  const signup = async (userData: Omit<Student, "id" | "memberSince" | "avatarUrl"> & { password: string }) => {
    // Retrieve existing users database
    const usersJson = localStorage.getItem("mervox_academy_users");
    const users = usersJson ? JSON.parse(usersJson) : [];

    // Check if email already registered
    const existing = users.find((u: any) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error("Email address is already registered.");
    }

    const newStudent: Student = {
      id: Math.random().toString(36).substring(2, 9),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      country: userData.country,
      memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      avatarUrl: "", // Start blank so initials render, unless photo is uploaded later
    };

    // Store in users database with hashed password
    users.push({ ...newStudent, password: hashPassword(userData.password) });
    localStorage.setItem("mervox_academy_users", JSON.stringify(users));
    
    // Sync newly created user record to cloud database
    AcademyDB.syncUserData(newStudent.id);

    // Log user in
    setStudent(newStudent);
    localStorage.setItem("mervox_academy_current_user", JSON.stringify(newStudent));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Pull newest account credentials from other devices before evaluating login details
    await AcademyDB.syncFromCloud();

    const usersJson = localStorage.getItem("mervox_academy_users");
    const users = usersJson ? JSON.parse(usersJson) : [];

    const hashedPassword = hashPassword(password);
    const matchedUser = users.find(
      (u: any) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        (u.password === hashedPassword || u.password === password)
    );

    if (matchedUser) {
      if (matchedUser.suspended) {
        alert("Your account has been suspended by the administrator.");
        return false;
      }
      // Hydrate local device database keys from cloud data model
      if (matchedUser.progress) localStorage.setItem(`mervox_academy_progress_${matchedUser.id}`, JSON.stringify(matchedUser.progress));
      if (matchedUser.quizzes) localStorage.setItem(`mervox_academy_quizzes_${matchedUser.id}`, JSON.stringify(matchedUser.quizzes));
      if (matchedUser.certificates) localStorage.setItem(`mervox_academy_certificates_${matchedUser.id}`, JSON.stringify(matchedUser.certificates));
      if (matchedUser.activity) localStorage.setItem(`mervox_academy_activity_${matchedUser.id}`, JSON.stringify(matchedUser.activity));
      if (matchedUser.notifications) localStorage.setItem(`mervox_academy_notifications_${matchedUser.id}`, JSON.stringify(matchedUser.notifications));

      const studentData: Student = {
        id: matchedUser.id,
        firstName: matchedUser.firstName,
        lastName: matchedUser.lastName,
        email: matchedUser.email,
        phone: matchedUser.phone,
        country: matchedUser.country,
        memberSince: matchedUser.memberSince,
        avatarUrl: matchedUser.avatarUrl,
        bio: matchedUser.bio,
        occupation: matchedUser.occupation,
        dob: matchedUser.dob,
        socials: matchedUser.socials,
      };
      setStudent(studentData);
      localStorage.setItem("mervox_academy_current_user", JSON.stringify(studentData));
      return true;
    }

    return false;
  };

  const logout = () => {
    setStudent(null);
    localStorage.removeItem("mervox_academy_current_user");
  };

  const updateProfile = async (updatedData: Partial<Student>) => {
    if (!student) return;

    // Retrieve users list
    const usersJson = localStorage.getItem("mervox_academy_users");
    const users = usersJson ? JSON.parse(usersJson) : [];

    // Find and update matched user
    const updatedUsers = users.map((u: any) => {
      if (u.id === student.id) {
        return {
          ...u,
          ...updatedData,
          // Ensure nestable objects merge correctly
          socials: {
            ...u.socials,
            ...updatedData.socials,
          },
        };
      }
      return u;
    });

    localStorage.setItem("mervox_academy_users", JSON.stringify(updatedUsers));

    // Update active student context state & current user session storage
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

    // Sync profile changes to cloud database
    AcademyDB.syncUserData(student.id);
  };

  const changePassword = async (oldPw: string, newPw: string): Promise<boolean> => {
    if (!student) return false;

    // Retrieve users list
    const usersJson = localStorage.getItem("mervox_academy_users");
    const users = usersJson ? JSON.parse(usersJson) : [];

    // Check old password
    const hashedOld = hashPassword(oldPw);
    const userIndex = users.findIndex((u: any) => u.id === student.id && u.password === hashedOld);

    if (userIndex !== -1) {
      users[userIndex].password = hashPassword(newPw);
      localStorage.setItem("mervox_academy_users", JSON.stringify(users));
      AcademyDB.syncUserData(student.id);
      return true;
    }

    return false;
  };

  const loginWithGoogle = async (email: string, name: string) => {
    const usersJson = localStorage.getItem("mervox_academy_users");
    const users = usersJson ? JSON.parse(usersJson) : [];

    const parts = name.trim().split(" ");
    const firstName = parts[0] || "Google";
    const lastName = parts.slice(1).join(" ") || "User";

    let studentData = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!studentData) {
      studentData = {
        id: Math.random().toString(36).substring(2, 9),
        firstName,
        lastName,
        email,
        phone: "+1 555-0100",
        country: "United States",
        memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        avatarUrl: "",
      };
      users.push({ ...studentData, password: hashPassword("google_oauth_bypass") });
      localStorage.setItem("mervox_academy_users", JSON.stringify(users));
    }

    // Set dynamic session details
    const activeData: Student = {
      id: studentData.id,
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      email: studentData.email,
      phone: studentData.phone,
      country: studentData.country,
      memberSince: studentData.memberSince,
      avatarUrl: studentData.avatarUrl,
      bio: studentData.bio,
      occupation: studentData.occupation,
      dob: studentData.dob,
      socials: studentData.socials,
    };

    setStudent(activeData);
    localStorage.setItem("mervox_academy_current_user", JSON.stringify(activeData));
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
