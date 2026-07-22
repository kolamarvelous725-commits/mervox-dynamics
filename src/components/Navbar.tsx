"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, Home, Briefcase, User, LayoutGrid, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Services", href: "/services", icon: Briefcase },
    { name: "About", href: "/about", icon: User },
    { name: "Portfolio", href: "/portfolio", icon: LayoutGrid },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "py-3 bg-background/85 backdrop-blur-md border-b border-card-border/50 shadow-sm"
          : "py-6 bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Mervox Dynamic Logo"
                fill
                sizes="48px"
                className="object-contain object-left"
                priority
              />
            </div>
            <span className="font-heading font-black text-foreground text-base sm:text-lg tracking-wider uppercase">
              Mervox Dynamic
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-300 relative py-2 ${
                  isActive(link.href)
                    ? "text-accent font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
          </div>

          {/* Mobile Menu Buttons */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full border border-card-border/50 text-foreground hover:bg-muted/10 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            />

            {/* Menu container */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-4 left-4 right-4 z-40 max-w-sm mx-auto bg-card border border-card-border/60 shadow-2xl p-6 pb-6 rounded-[32px] md:hidden flex flex-col"
            >
              {/* Grab Handle */}
              <div className="w-12 h-1 bg-muted-foreground/20 rounded-full mx-auto mb-6" />

              {/* Navigation Links */}
              <nav className="flex flex-col gap-1 mb-6">
                {navLinks.map((link, idx) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${
                          active
                            ? "text-[#0055ff] dark:text-blue-400 font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon className={`w-5.5 h-5.5 ${active ? "text-[#0055ff] dark:text-blue-400" : "text-muted-foreground/80"}`} />
                        <span className="text-base font-medium">{link.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Book Call Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
              >
                <Link
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#0055ff] hover:bg-[#0044dd] text-white font-semibold rounded-[20px] shadow-[0_4px_20px_rgba(0,85,255,0.25)] hover:shadow-[0_6px_25px_rgba(0,85,255,0.4)] active:scale-[0.98] transition-all duration-300 cursor-pointer"
                >
                  <span>Book A Free Call</span>
                  <Phone className="w-4 h-4 shrink-0 transition-transform duration-300" />
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
