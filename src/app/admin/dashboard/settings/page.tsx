"use client";

import { AcademyDB } from "@/utils/academyDb";
import { useState, useEffect } from "react";
import { Save, Settings, Shield, Link2, Mail, CreditCard, Image as ImageIcon } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    logoUrl: "/logo.png",
    academyName: "Mervox Academy",
    contactEmail: "support@mervoxdynamic.com",
    contactPhone: "+234 812 345 6789",
    twitter: "https://twitter.com/mervoxdynamic",
    github: "https://github.com/mervoxdynamic",
    linkedin: "https://linkedin.com/company/mervoxdynamic",
    emailProvider: "SMTP (Default)",
    paymentProvider: "Stripe Test",
  });

  useEffect(() => {
    setSettings(AcademyDB.getAdminSettings());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    AcademyDB.saveAdminSettings(settings);
    alert("Branding and utility configurations saved and synchronized successfully!");
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border/40 pb-4 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055ff]">System Config</span>
          <h2 className="text-2xl font-heading font-black text-slate-800 dark:text-white mt-1">Platform Settings</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2 md:mt-0 leading-relaxed font-semibold">
          Adjust academy themes, brand images, email notifications configurations, and invoice payment providers.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Left Column: Branding details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* General Branding */}
          <div className="p-6 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider pb-2 border-b border-card-border/40 flex items-center gap-2 select-none">
              <ImageIcon className="w-4 h-4 text-[#0055ff]" />
              Branding & Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Academy Name</label>
                <input
                  type="text"
                  value={settings.academyName}
                  onChange={(e) => setSettings({ ...settings, academyName: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Academy Logo Path</label>
                <input
                  type="text"
                  value={settings.logoUrl}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact details */}
          <div className="p-6 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider pb-2 border-b border-card-border/40 flex items-center gap-2 select-none">
              <Mail className="w-4 h-4 text-purple-500" />
              Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Support Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wide block">Support Phone Number</label>
                <input
                  type="text"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Social connections */}
          <div className="p-6 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider pb-2 border-b border-card-border/40 flex items-center gap-2 select-none">
              <Link2 className="w-4 h-4 text-sky-500" />
              Social Media Links
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Twitter / X URL</label>
                <input
                  type="text"
                  value={settings.twitter}
                  onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">GitHub URL</label>
                <input
                  type="text"
                  value={settings.github}
                  onChange={(e) => setSettings({ ...settings, github: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">LinkedIn URL</label>
                <input
                  type="text"
                  value={settings.linkedin}
                  onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Server integration preferences */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Email Settings */}
          <div className="p-6 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider pb-2 border-b border-card-border/40 select-none">
              Email SMTP Engine
            </h3>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Outgoing Provider</label>
              <select
                value={settings.emailProvider}
                onChange={(e) => setSettings({ ...settings, emailProvider: e.target.value })}
                className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="SMTP (Default)">SMTP Mail Server</option>
                <option value="Mailgun API">Mailgun Web API</option>
                <option value="SendGrid API">SendGrid Web API</option>
              </select>
            </div>
          </div>

          {/* Payment Settings */}
          <div className="p-6 rounded-2xl border border-card-border bg-white dark:bg-[#18181c] shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider pb-2 border-b border-card-border/40 select-none">
              Tuition Gateways
            </h3>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Active Provider</label>
              <select
                value={settings.paymentProvider}
                onChange={(e) => setSettings({ ...settings, paymentProvider: e.target.value })}
                className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-card-border text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="Stripe Test">Stripe API (Staging)</option>
                <option value="PayPal Sandbox">PayPal API (Sandbox)</option>
                <option value="Manual Payout Ledger">Manual Bank Transact</option>
              </select>
            </div>
          </div>

          {/* Save Action */}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#0055ff] hover:bg-[#0044dd] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer border-none"
          >
            <Save className="w-4 h-4" />
            <span>Save configurations</span>
          </button>

        </div>

      </form>

    </div>
  );
}
