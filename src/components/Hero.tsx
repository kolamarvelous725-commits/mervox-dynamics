"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, Phone, Play, Star } from "lucide-react";

export function Hero() {
  const specialties = [
    "Web Design",
    "Web Development",
    "Digital Marketing",
    "Email Marketing",
    "Ecommerce",
    "Brand Identity",
    "Social Media Marketing",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-between pt-20 pb-4 overflow-hidden bg-background"
    >
      {/* Subtle Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[15%] -left-[10%] w-[45%] h-[45%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[120px]" />
        <div className="absolute -bottom-[15%] -right-[10%] w-[45%] h-[45%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col justify-between relative z-10">
        
        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full my-auto py-2">
          
          {/* Left Column Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col justify-center text-left"
          >
            {/* Eyebrow Label */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-card-border bg-card/40 backdrop-blur-md w-fit mb-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                Next-Gen Digital Agency
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-foreground leading-[1.1] mb-3"
            >
              Building Digital Experiences That Help{" "}
              <span className="text-accent relative inline-block">
                Businesses Grow.
                <span className="absolute bottom-1.5 left-0 w-full h-[3px] bg-accent/20 rounded-full" />
              </span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              variants={itemVariants}
              className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl mb-4"
            >
              Mervox Dynamics is a premium agency specializing in state-of-the-art digital craftsmanship. We collaborate with forward-thinking brands to design and build high-performance solutions.
            </motion.p>

            {/* Call to Actions (Blinking primary Book Call) */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-5 items-center w-full sm:w-auto mb-4"
            >
              {/* Primary Call to Action */}
              <div className="flex flex-col w-full sm:w-auto">
                <Link
                  href="#contact"
                  className="group flex items-center justify-center gap-3 px-7 py-3.5 font-semibold text-white bg-[#0a192f] dark:bg-[#1e3a8a] hover:bg-[#0c1e3b] dark:hover:bg-[#1d4ed8] rounded-[14px] shadow-[0_0_15px_rgba(10,25,47,0.1)] dark:shadow-[0_0_15px_rgba(30,58,138,0.18)] hover:shadow-[0_0_25px_rgba(10,25,47,0.2)] dark:hover:shadow-[0_0_25px_rgba(30,58,138,0.3)] transition-all duration-300 animate-soft-blink hover:-translate-y-[2px]"
                >
                  <Phone className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  <span>Book a Free Call</span>
                </Link>
              </div>

              {/* Secondary Call to Action */}
              <div className="flex flex-col items-center w-full sm:w-auto gap-1.5">
                <button
                  disabled
                  className="w-full sm:w-auto group flex items-center justify-center gap-3 px-7 py-3.5 font-semibold text-foreground/80 border border-card-border bg-card/10 backdrop-blur-sm rounded-[14px] animate-border-fade cursor-not-allowed select-none opacity-90 transition-all duration-300"
                >
                  <Play className="w-4 h-4 shrink-0 fill-foreground/10 text-foreground/60" />
                  <span>Watch Our Story</span>
                </button>
                <span className="text-[9px] font-extrabold tracking-[0.2em] text-[#0055ff]/70 dark:text-blue-400/70 animate-soft-blink uppercase select-none">
                  • COMING SOON •
                </span>
              </div>
            </motion.div>

            {/* Trust Indicator Section with Real Avatars */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3.5 py-3 border-t border-card-border/30 max-w-sm"
            >
              <div className="flex -space-x-2 select-none">
                <div className="w-7 h-7 rounded-full border-2 border-background overflow-hidden bg-muted/10">
                  <img src="/avatar1.png" alt="Client 1" className="w-full h-full object-cover" />
                </div>
                <div className="w-7 h-7 rounded-full border-2 border-background overflow-hidden bg-muted/10">
                  <img src="/avatar2.png" alt="Client 2" className="w-full h-full object-cover" />
                </div>
                <div className="w-7 h-7 rounded-full border-2 border-background overflow-hidden bg-muted/10">
                  <img src="/avatar3.png" alt="Client 3" className="w-full h-full object-cover" />
                </div>
                <div className="w-7 h-7 rounded-full border-2 border-background overflow-hidden bg-muted/10">
                  <img src="/avatar4.png" alt="Client 4" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Stars & Text */}
              <div className="flex flex-col items-start gap-0.5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-[#0055ff] text-[#0055ff] dark:fill-[#3b82f6] dark:text-[#3b82f6]"
                    />
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground font-semibold">
                  Trusted by growing businesses
                </p>
              </div>
            </motion.div>

          </motion.div>

          {/* Right Column (Original Illustrations Preserved) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-full aspect-square max-w-[320px] lg:max-w-[360px] flex items-center justify-center"
            >
              {/* Background Glow Sphere */}
              <div className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-accent/20 to-indigo-500/10 blur-[50px] dark:blur-[70px]" />

              {/* Glowing Interactive Orbs */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 3, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute w-[260px] h-[260px] lg:w-[300px] lg:h-[300px] rounded-full border border-accent/20 bg-gradient-to-tr from-accent/5 via-card/10 to-indigo-500/10 backdrop-blur-[4px] flex items-center justify-center shadow-lg"
              >
                <div className="absolute inset-4 rounded-full border border-dashed border-accent/15 animate-[spin_90s_linear_infinite]" />
                <div className="absolute inset-10 rounded-full border border-card-border/60" />
              </motion.div>

              {/* Floating Glass Panels */}
              {/* Panel 1 - Web Design & UI */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  x: [0, 4, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
                className="absolute top-10 left-0 px-3 py-2 rounded-2xl border border-card-border bg-card/60 backdrop-blur-md shadow-xl flex items-center gap-3 w-40"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center text-accent text-xs font-bold font-heading">
                  UI/UX
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-foreground">Web Design</span>
                  <span className="text-[8px] text-muted-foreground">Modern & Clean</span>
                </div>
              </motion.div>

              {/* Panel 2 - Code & Tech */}
              <motion.div
                animate={{
                  y: [0, 10, 0],
                  x: [0, -4, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.7,
                }}
                className="absolute bottom-10 right-0 px-3 py-2 rounded-2xl border border-card-border bg-card/60 backdrop-blur-md shadow-xl flex items-center gap-3 w-44"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold">
                  &lt;/&gt;
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-foreground">Development</span>
                  <span className="text-[8px] text-muted-foreground">React / Next.js / TS</span>
                </div>
              </motion.div>

              {/* Panel 3 - Metrics/Grows */}
              <motion.div
                animate={{
                  y: [0, -6, 0],
                  x: [0, -6, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.1,
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-2.5 rounded-2xl border border-card-border bg-card/80 backdrop-blur-md shadow-xl flex flex-col gap-2 w-36"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground">
                    Performance
                  </span>
                  <span className="text-xs font-extrabold text-emerald-500 font-heading">+98%</span>
                </div>
                <div className="h-1 w-full bg-muted dark:bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "98%" }}
                    transition={{ duration: 1.5, delay: 1 }}
                    className="h-full bg-accent rounded-full"
                  />
                </div>
              </motion.div>

              {/* Accent Glowing Spheres */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-20 right-10 w-5 h-5 rounded-full bg-accent/30 blur-[4px]"
              />
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
                className="absolute bottom-20 left-10 w-7 h-7 rounded-full bg-indigo-500/20 blur-[6px]"
              />
            </motion.div>
          </div>

        </div>

        {/* Infinite Brands Scroll Footer (Trusted by Brands and Businesses) */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="w-full border-t border-card-border/30 py-4 mt-auto flex flex-col items-center gap-3.5"
        >
          {/* Section Heading */}
          <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase text-center select-none">
            TRUSTED BY BRANDS AND BUSINESSES
          </span>

          <div className="w-full overflow-hidden relative py-1">
            {/* Left and Right Gradient Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            
            {/* Scrolling Track */}
            <div className="flex animate-marquee whitespace-nowrap gap-12 text-[#64748b] dark:text-[#94a3b8] font-heading font-extrabold text-[11px] sm:text-xs tracking-wide">
              {/* Set 1 */}
              <div className="flex items-center gap-12 shrink-0">
                <span className="flex items-center gap-1 select-none">
                  <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  NovaPay
                </span>
                <span className="flex items-center gap-1 select-none">
                  <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2c5.522 0 10 4.477 10 10s-4.478 10-10 10S2 17.523 2 12 6.478 2 12 2zm0 6a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                  Greenish
                </span>
                <span className="flex items-center gap-1 select-none">
                  <svg className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  VESTA
                </span>
                <span className="flex items-center gap-1 select-none">
                  <svg className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                  </svg>
                  BoldMart
                </span>
                <span className="flex items-center gap-1 select-none">
                  <svg className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" />
                  </svg>
                  HexaFlow
                </span>
                <span className="flex items-center gap-1 select-none">
                  <svg className="w-3.5 h-3.5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  LightAI
                </span>
              </div>
              
              {/* Set 2 (Duplicate for loop) */}
              <div className="flex items-center gap-12 shrink-0">
                <span className="flex items-center gap-1 select-none">
                  <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  NovaPay
                </span>
                <span className="flex items-center gap-1 select-none">
                  <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2c5.522 0 10 4.477 10 10s-4.478 10-10 10S2 17.523 2 12 6.478 2 12 2zm0 6a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                  Greenish
                </span>
                <span className="flex items-center gap-1 select-none">
                  <svg className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  VESTA
                </span>
                <span className="flex items-center gap-1 select-none">
                  <svg className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                  </svg>
                  BoldMart
                </span>
                <span className="flex items-center gap-1 select-none">
                  <svg className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" />
                  </svg>
                  HexaFlow
                </span>
                <span className="flex items-center gap-1 select-none">
                  <svg className="w-3.5 h-3.5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  LightAI
                </span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
