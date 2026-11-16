"use client";

import { Mail, MessageCircle, Phone, ArrowUpRight } from "lucide-react";

export function Contact() {
  const contactChannels = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      handle: "+234 811 276 9033",
      label: "Instant Chat & Inquiries",
      action: "Message on WhatsApp",
      mobileAction: "WhatsApp",
      href: "https://wa.me/2348112769033",
      accentColor: "from-emerald-500/15 via-emerald-500/5 to-transparent",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20",
      iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
      iconType: "whatsapp",
    },
    {
      id: "gmail",
      name: "Gmail",
      handle: "mervoxdynamic@gmail.com",
      label: "Project Inquiries & Proposals",
      action: "Send an Email",
      mobileAction: "Email Us",
      href: "mailto:mervoxdynamic@gmail.com",
      accentColor: "from-blue-500/15 via-blue-500/5 to-transparent",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      buttonColor: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20",
      iconColor: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
      iconType: "mail",
    },
    {
      id: "tiktok",
      name: "TikTok",
      handle: "@mervoxdynamic",
      label: "Official Videos & Tech Insights",
      action: "Visit TikTok Profile",
      mobileAction: "TikTok",
      href: "https://www.tiktok.com/@mervoxdynamic?lang=en",
      accentColor: "from-pink-500/15 via-purple-500/5 to-transparent",
      badgeColor: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
      buttonColor: "bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-black shadow-slate-900/20",
      iconColor: "text-pink-600 dark:text-pink-400 bg-pink-500/10",
      iconType: "tiktok",
    },
  ];

  return (
    <section id="contact" className="py-14 sm:py-20 bg-background relative border-t border-card-border/50">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 sm:mb-3 block">
            Let's Connect
          </span>
          <h2 className="text-2xl sm:text-4xl font-heading font-black tracking-tight text-foreground">
            Connect With Mervox Dynamics
          </h2>
          <div className="h-1 w-12 bg-accent/30 rounded-full mx-auto mt-3 sm:mt-4" />
          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-muted-foreground leading-relaxed">
            Reach out directly through any of our official channels. We are always ready to discuss your projects and collaborate.
          </p>
        </div>

        {/* Channels Grid - Compact and not oversized on mobile, 3 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 md:gap-6">
          {contactChannels.map((channel) => (
            <a
              key={channel.id}
              href={channel.href}
              target={channel.href.startsWith("http") ? "_blank" : undefined}
              rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group relative rounded-[18px] md:rounded-[24px] border border-card-border/80 bg-card/60 hover:bg-card hover:border-accent/30 p-4 sm:p-5 md:p-8 flex flex-col md:justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden text-left"
            >
              {/* Background gradient on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${channel.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
              />

              {/* Mobile View: Compact horizontal card */}
              <div className="relative z-10 flex items-center justify-between gap-3 md:hidden">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${channel.iconColor} shadow-xs shrink-0`}>
                    {channel.iconType === "whatsapp" && <MessageCircle className="w-5 h-5" />}
                    {channel.iconType === "mail" && <Mail className="w-5 h-5" />}
                    {channel.iconType === "tiktok" && (
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      {channel.name}
                    </span>
                    <h3 className="text-sm font-heading font-black text-foreground truncate tracking-tight group-hover:text-accent transition-colors">
                      {channel.handle}
                    </h3>
                  </div>
                </div>

                <div
                  className={`py-2 px-3 rounded-[12px] text-xs font-bold flex items-center justify-center gap-1 shadow-sm shrink-0 ${channel.buttonColor}`}
                >
                  <span>{channel.mobileAction}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </div>
              </div>

              {/* Desktop View: Full vertical card */}
              <div className="hidden md:block relative z-10 space-y-5">
                <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${channel.iconColor} transition-transform duration-300 group-hover:scale-110 shadow-xs shrink-0`}>
                    {channel.iconType === "whatsapp" && <MessageCircle className="w-7 h-7" />}
                    {channel.iconType === "mail" && <Mail className="w-7 h-7" />}
                    {channel.iconType === "tiktok" && (
                      <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${channel.badgeColor} shrink-0`}>
                    {channel.name}
                  </span>
                </div>

                <div className="space-y-1.5 text-left">
                  <p className="text-xs text-muted-foreground font-semibold">
                    {channel.label}
                  </p>
                  <h3 className="text-lg sm:text-xl font-heading font-black text-foreground break-all tracking-tight group-hover:text-accent transition-colors leading-tight">
                    {channel.handle}
                  </h3>
                </div>
              </div>

              <div className="hidden md:block relative z-10 pt-8">
                <div
                  className={`w-full py-3.5 px-5 rounded-[16px] text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-300 group-hover:shadow-md ${channel.buttonColor}`}
                >
                  <span>{channel.action}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Direct Phone Strip */}
        <div className="mt-5 md:mt-8 p-4 md:p-6 rounded-[18px] md:rounded-[22px] border border-card-border/60 bg-card/40 flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-muted-foreground font-semibold">Prefer a voice phone call?</p>
              <h4 className="text-sm md:text-base font-heading font-bold text-foreground">+234 811 276 9033</h4>
            </div>
          </div>
          <a
            href="tel:+2348112769033"
            className="px-4 md:px-6 py-2 md:py-2.5 rounded-xl border border-card-border hover:border-accent/40 bg-background hover:bg-card text-xs font-bold text-foreground transition-all duration-200 cursor-pointer shadow-xs shrink-0"
          >
            Call Now
          </a>
        </div>

      </div>
    </section>
  );
}
