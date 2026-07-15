"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

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
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-background"
    >
      {/* Subtle Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full relative z-10">
        {/* Left Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col justify-center text-left"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-card-border bg-card/40 backdrop-blur-md w-fit mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Next-Gen Digital Agency
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-foreground leading-[1.1] mb-6"
          >
            Building Digital Experiences That Help{" "}
            <span className="text-accent relative inline-block">
              Businesses Grow.
              <span className="absolute bottom-1.5 left-0 w-full h-[3px] bg-accent/20 rounded-full" />
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mb-8"
          >
            Mervox Dynamics is a premium agency specializing in state-of-the-art digital craftsmanship. We collaborate with forward-thinking brands to design and build high-performance solutions.
          </motion.p>

          {/* Specialties List */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 gap-3 mb-8 max-w-lg"
          >
            {specialties.map((specialty) => (
              <div key={specialty} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span className="text-sm font-medium text-foreground/80">{specialty}</span>
              </div>
            ))}
          </motion.div>

          {/* Call to Actions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
          >
            <Link
              href="#contact"
              className="group flex items-center justify-center gap-2 px-6 py-3.5 font-semibold text-white bg-accent hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-[18px] shadow-sm hover:shadow-md cursor-pointer"
            >
              Start Your Project
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#services"
              className="flex items-center justify-center gap-2 px-6 py-3.5 font-semibold text-foreground border border-card-border bg-card/30 hover:bg-card/80 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-[18px] cursor-pointer"
            >
              View Services
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Premium Illustration (No Stock Images) */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-full aspect-square max-w-[450px] flex items-center justify-center"
          >
            {/* Background Glow Sphere */}
            <div className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-accent/20 to-indigo-500/10 blur-[60px] dark:blur-[80px]" />

            {/* Glowing Interactive Orbs */}
            <motion.div
              animate={{
                y: [0, -12, 0],
                rotate: [0, 3, 0],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute w-[280px] h-[280px] rounded-full border border-accent/20 bg-gradient-to-tr from-accent/5 via-card/10 to-indigo-500/10 backdrop-blur-[4px] flex items-center justify-center shadow-lg"
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
              className="absolute top-10 left-2 px-4 py-3 rounded-2xl border border-card-border bg-card/60 backdrop-blur-md shadow-xl flex items-center gap-3 w-44"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center text-accent text-xs font-bold font-heading">
                UI/UX
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-foreground">Web Design</span>
                <span className="text-[9px] text-muted-foreground">Modern & Clean</span>
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
              className="absolute bottom-14 right-2 px-4 py-3 rounded-2xl border border-card-border bg-card/60 backdrop-blur-md shadow-xl flex items-center gap-3 w-48"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold">
                &lt;/&gt;
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-foreground">Development</span>
                <span className="text-[9px] text-muted-foreground">React / Next.js / TS</span>
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
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-3.5 rounded-2xl border border-card-border bg-card/80 backdrop-blur-md shadow-xl flex flex-col gap-2.5 w-40"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  Performance
                </span>
                <span className="text-xs font-extrabold text-emerald-500 font-heading">+98%</span>
              </div>
              <div className="h-1.5 w-full bg-muted dark:bg-muted/30 rounded-full overflow-hidden">
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
              className="absolute top-20 right-12 w-6 h-6 rounded-full bg-accent/30 blur-[4px]"
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
              className="absolute bottom-20 left-16 w-8 h-8 rounded-full bg-indigo-500/20 blur-[6px]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
