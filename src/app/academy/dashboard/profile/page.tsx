"use client";

import { useAcademyAuth } from "@/context/AcademyAuthContext";
import { useState } from "react";
import { User, Phone, Globe, Lock, Save, Camera, Mail, Briefcase, FileText, Globe2, Link as LinkIcon, Calendar } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const { student, updateProfile, changePassword } = useAcademyAuth();

  const [activeTab, setActiveTab] = useState<"personal" | "socials" | "security">("personal");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Form states initialized from context student session
  const [profileForm, setProfileForm] = useState({
    firstName: student?.firstName || "",
    lastName: student?.lastName || "",
    phone: student?.phone || "",
    country: student?.country || "",
    bio: student?.bio || "",
    occupation: student?.occupation || "",
    dob: student?.dob || "",
  });

  const [socialsForm, setSocialsForm] = useState({
    twitter: student?.socials?.twitter || "",
    github: student?.socials?.github || "",
    linkedin: student?.socials?.linkedin || "",
  });

  const [securityForm, setSecurityForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(student?.avatarUrl || null);

  useEffect(() => {
    if (student) {
      setProfileForm({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        phone: student.phone || "",
        country: student.country || "",
        bio: student.bio || "",
        occupation: student.occupation || "",
        dob: student.dob || "",
      });
      setSocialsForm({
        twitter: student.socials?.twitter || "",
        github: student.socials?.github || "",
        linkedin: student.socials?.linkedin || "",
      });
      if (student.avatarUrl) {
        setAvatarPreview(student.avatarUrl);
      }
    }
  }, [student]);

  const countries = [
    "Nigeria", "United States", "United Kingdom", "Canada", 
    "South Africa", "Kenya", "Ghana", "Germany", "Australia", "Other"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, formType: "profile" | "socials" | "security") => {
    const { name, value } = e.target;
    if (formType === "profile") {
      setProfileForm((prev) => ({ ...prev, [name]: value }));
    } else if (formType === "socials") {
      setSocialsForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setSecurityForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // FileReader to read file upload as base64 string
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setError("Image size must be less than 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await updateProfile({
        ...profileForm,
        avatarUrl: avatarPreview || "",
      });
      setSuccess("Profile details saved successfully.");
    } catch (err: any) {
      setError("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await updateProfile({
        socials: socialsForm,
      });
      setSuccess("Social media links saved successfully.");
    } catch (err: any) {
      setError("Failed to save social links.");
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!securityForm.oldPassword || !securityForm.newPassword) {
      setError("Please fill in current and new password fields.");
      return;
    }
    if (securityForm.newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }
    if (securityForm.newPassword !== securityForm.confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const match = await changePassword(securityForm.oldPassword, securityForm.newPassword);
      if (match) {
        setSuccess("Password updated successfully.");
        setSecurityForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
      } else {
        setError("Current password is incorrect.");
      }
    } catch (err: any) {
      setError("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract student initials for avatar fallback
  const getInitials = (first = "", last = "") => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">Account Settings</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Manage Your Profile</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2 md:mt-0 leading-relaxed font-semibold">
          Customize your bio, upload student profile photo, add socials, or secure your credentials.
        </p>
      </div>

      {/* Profile Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Quick card and Tabs */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick summary widget */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#18181c] border border-card-border/60 text-center space-y-4 shadow-xs select-none">
            
            {/* Circular Avatar Photo Upload */}
            <div className="relative w-24 h-24 mx-auto group">
              <div className="relative w-full h-full rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-card-border/60 flex items-center justify-center">
                {avatarPreview ? (
                  <Image src={avatarPreview} alt="Avatar Preview" fill className="object-cover" />
                ) : (
                  <div className="text-xl font-heading font-black text-[#0055ff]">
                    {getInitials(student?.firstName, student?.lastName)}
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-1.5 -right-1.5 p-2 rounded-xl bg-[#0055ff] hover:bg-[#0044dd] text-white shadow-md cursor-pointer transition-all duration-200 group-hover:scale-105 active:scale-95 flex items-center justify-center border border-white dark:border-[#18181c]"
                title="Upload Photo"
              >
                <Camera className="w-3.5 h-3.5" />
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-heading font-black text-slate-800 dark:text-white leading-tight">
                {student?.firstName} {student?.lastName}
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium leading-none">
                {student?.occupation || "Student"}
              </p>
            </div>

            <div className="pt-2 border-t border-card-border/40 text-left text-[11px] font-semibold text-slate-400 space-y-2">
              <div className="flex justify-between items-center">
                <span>Member Since:</span>
                <span className="text-slate-600 dark:text-slate-300">{student?.memberSince}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Country:</span>
                <span className="text-slate-600 dark:text-slate-300">{student?.country}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tab controls */}
          <div className="p-3 rounded-2xl bg-white dark:bg-[#18181c] border border-card-border/60 shadow-xs flex flex-col gap-1 text-left select-none">
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "personal"
                  ? "bg-[#0055ff] text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Personal Details</span>
            </button>
            <button
              onClick={() => setActiveTab("socials")}
              className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "socials"
                  ? "bg-[#0055ff] text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <Globe2 className="w-4 h-4" />
              <span>Social Links</span>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "security"
                  ? "bg-[#0055ff] text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Security & Password</span>
            </button>
          </div>

        </div>

        {/* Right column: Form details */}
        <div className="lg:col-span-8 bg-white dark:bg-[#18181c] border border-card-border/60 rounded-[24px] p-6 sm:p-8 shadow-xs text-left">
          
          {/* Display messages */}
          {error && (
            <div className="p-3 mb-6 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 mb-6 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl">
              {success}
            </div>
          )}

          {/* TAB 1: PERSONAL DETAILS */}
          {activeTab === "personal" && (
            <form onSubmit={handleProfileSave} className="space-y-5">
              <h3 className="text-sm font-heading font-black text-slate-800 dark:text-white uppercase tracking-wider pb-2 border-b border-card-border/40">
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">First Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <User className="w-4 h-4 text-slate-400" />
                    </span>
                    <input
                      type="text"
                      name="firstName"
                      value={profileForm.firstName}
                      onChange={(e) => handleInputChange(e, "profile")}
                      placeholder="First Name"
                      className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Last Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <User className="w-4 h-4 text-slate-400" />
                    </span>
                    <input
                      type="text"
                      name="lastName"
                      value={profileForm.lastName}
                      onChange={(e) => handleInputChange(e, "profile")}
                      placeholder="Last Name"
                      className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Phone Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <Phone className="w-4 h-4 text-slate-400" />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={profileForm.phone}
                      onChange={(e) => handleInputChange(e, "profile")}
                      placeholder="Phone Number"
                      className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Country</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <Globe className="w-4 h-4 text-slate-400" />
                    </span>
                    <select
                      name="country"
                      value={profileForm.country}
                      onChange={(e) => handleInputChange(e, "profile")}
                      className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all appearance-none cursor-pointer"
                      required
                    >
                      {countries.map((c) => (
                        <option key={c} value={c} className="text-slate-800 dark:text-slate-200">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Occupation</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                    </span>
                    <input
                      type="text"
                      name="occupation"
                      value={profileForm.occupation}
                      onChange={(e) => handleInputChange(e, "profile")}
                      placeholder="e.g. Student, UX Designer"
                      className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Date of Birth (Optional)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <Calendar className="w-4 h-4 text-slate-400" />
                    </span>
                    <input
                      type="date"
                      name="dob"
                      value={profileForm.dob}
                      onChange={(e) => handleInputChange(e, "profile")}
                      className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Biography</label>
                <div className="relative">
                  <span className="absolute top-3.5 left-3.5">
                    <FileText className="w-4 h-4 text-slate-400" />
                  </span>
                  <textarea
                    name="bio"
                    value={profileForm.bio}
                    onChange={(e) => handleInputChange(e, "profile")}
                    rows={4}
                    placeholder="Tell us a little bit about yourself, your learning goals, or background..."
                    className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 font-bold text-white bg-[#0055ff] hover:bg-[#0044dd] disabled:bg-[#0055ff]/50 rounded-xl shadow-xs transition-all cursor-pointer text-xs"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "Saving..." : "Save Changes"}</span>
              </button>
            </form>
          )}

          {/* TAB 2: SOCIAL LINKS */}
          {activeTab === "socials" && (
            <form onSubmit={handleSocialsSave} className="space-y-5">
              <h3 className="text-sm font-heading font-black text-slate-800 dark:text-white uppercase tracking-wider pb-2 border-b border-card-border/40">
                Social Profiles
              </h3>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Twitter Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <LinkIcon className="w-4 h-4 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    name="twitter"
                    value={socialsForm.twitter}
                    onChange={(e) => handleInputChange(e, "socials")}
                    placeholder="@username"
                    className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">GitHub Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <LinkIcon className="w-4 h-4 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    name="github"
                    value={socialsForm.github}
                    onChange={(e) => handleInputChange(e, "socials")}
                    placeholder="github_username"
                    className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">LinkedIn Profile URL</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <LinkIcon className="w-4 h-4 text-slate-400" />
                  </span>
                  <input
                    type="url"
                    name="linkedin"
                    value={socialsForm.linkedin}
                    onChange={(e) => handleInputChange(e, "socials")}
                    placeholder="https://linkedin.com/in/profile-name"
                    className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 font-bold text-white bg-[#0055ff] hover:bg-[#0044dd] disabled:bg-[#0055ff]/50 rounded-xl shadow-xs transition-all cursor-pointer text-xs"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "Saving..." : "Save Social Links"}</span>
              </button>
            </form>
          )}

          {/* TAB 3: SECURITY & PASSWORD */}
          {activeTab === "security" && (
            <form onSubmit={handleSecuritySave} className="space-y-5">
              <h3 className="text-sm font-heading font-black text-slate-800 dark:text-white uppercase tracking-wider pb-2 border-b border-card-border/40">
                Security & Password Settings
              </h3>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Current Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </span>
                  <input
                    type="password"
                    name="oldPassword"
                    value={securityForm.oldPassword}
                    onChange={(e) => handleInputChange(e, "security")}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">New Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </span>
                    <input
                      type="password"
                      name="newPassword"
                      value={securityForm.newPassword}
                      onChange={(e) => handleInputChange(e, "security")}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Confirm New Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </span>
                    <input
                      type="password"
                      name="confirmNewPassword"
                      value={securityForm.confirmNewPassword}
                      onChange={(e) => handleInputChange(e, "security")}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-card-border/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0055ff] transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 font-bold text-white bg-[#0055ff] hover:bg-[#0044dd] disabled:bg-[#0055ff]/50 rounded-xl shadow-xs transition-all cursor-pointer text-xs"
              >
                <Lock className="w-4 h-4 text-white" />
                <span>{loading ? "Updating..." : "Update Password"}</span>
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
