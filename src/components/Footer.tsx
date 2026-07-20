"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MessageCircle, Share2 } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/#services" },
    { name: "Portfolio", href: "/#portfolio" },
    { name: "Contact", href: "/#contact" },
  ];

  const services = [
    { name: "Web Design", href: "/#services" },
    { name: "Web Development", href: "/#services" },
    { name: "Store Creation", href: "/#services" },
    { name: "Brand Identity", href: "/#services" },
  ];

  return (
    <footer className="bg-background border-t border-card-border/50 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        {/* Column 1: Logo & Info */}
        <div className="md:col-span-4 space-y-6 text-left">
          <Link href="/" className="flex items-center gap-2.5 w-fit group">
            <div className="relative w-9 h-9 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Mervox Dynamics Logo"
                fill
                sizes="36px"
                className="object-contain object-left"
              />
            </div>
            <span className="font-heading font-black text-foreground text-base tracking-wider uppercase">
              Mervox Dynamics
            </span>
          </Link>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
            High-performance digital craftsmanship for forward-thinking brands. We build websites, store apps, and visuals that scale businesses.
          </p>
          <p className="text-[11px] text-muted-foreground">
            © {currentYear} Mervox Dynamics. All rights reserved.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="md:col-span-3 text-left space-y-4">
          <h4 className="text-xs font-heading font-bold text-foreground uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Services */}
        <div className="md:col-span-3 text-left space-y-4">
          <h4 className="text-xs font-heading font-bold text-foreground uppercase tracking-wider">
            Services
          </h4>
          <ul className="space-y-2.5">
            {services.map((service, idx) => (
              <li key={service.name + idx}>
                <Link
                  href={service.href}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Socials */}
        <div className="md:col-span-2 text-left space-y-4">
          <h4 className="text-xs font-heading font-bold text-foreground uppercase tracking-wider">
            Connect
          </h4>
          <div className="flex gap-3">
            {/* Email */}
            <a
              href="mailto:mervoxdynamics@gmail.com"
              className="w-8 h-8 rounded-lg border border-card-border/60 hover:border-accent/40 bg-card/20 hover:bg-accent hover:text-white flex items-center justify-center text-muted-foreground transition-all duration-300"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@marv_web"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg border border-card-border/60 hover:border-accent/40 bg-card/20 hover:bg-accent hover:text-white flex items-center justify-center text-muted-foreground transition-all duration-300"
              aria-label="TikTok"
            >
              <Share2 className="w-4 h-4" />
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/2348112769033"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg border border-card-border/60 hover:border-accent/40 bg-card/20 hover:bg-accent hover:text-white flex items-center justify-center text-muted-foreground transition-all duration-300"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
