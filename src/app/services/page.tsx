"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import {
  Layout,
  Code,
  Megaphone,
  Mail,
  ShoppingCart,
  PenTool,
  Target,
  Palette,
  MessageSquare,
  UserCheck,
  ArrowRight,
  Sparkles,
  ArrowUpRight,
  Star,
} from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      id: "web-design",
      icon: Layout,
      title: "Web Design",
      description: "Clean, professional visual layouts crafted with precise user experience structures to engage visitors and build immediate brand trust.",
    },
    {
      id: "web-development",
      icon: Code,
      title: "Web Development",
      description: "High-performance, responsive code engineered with Next.js, React, and TypeScript for clean architecture and search engine indexing.",
    },
    {
      id: "digital-marketing",
      icon: Megaphone,
      title: "Digital Marketing",
      description: "Data-driven client acquisition campaigns and landing page pipelines aligned directly with your key conversion targets.",
    },
    {
      id: "email-marketing",
      icon: Mail,
      title: "Email Marketing",
      description: "Custom email automation sequences and nurturing campaigns built to educate leads and optimize customer lifetime value.",
    },
    {
      id: "ecommerce-development",
      icon: ShoppingCart,
      title: "E-commerce / Online Store Creation",
      description: "High-converting online store systems equipped with smooth checkouts, secure gateways, and seamless stock inventory hookups.",
    },
    {
      id: "digital-product-design",
      icon: PenTool,
      title: "Digital Product Design",
      description: "Intuitive UX wireframes and high-fidelity SaaS dashboard layouts engineered for maximum usability and modern interactive workflows.",
    },
    {
      id: "social-media-advertising",
      icon: Target,
      title: "Social Media Advertising",
      description: "Targeted paid traffic campaigns across Meta, Google, and LinkedIn designed to acquire leads with a positive return on spend.",
    },
    {
      id: "graphics-design",
      icon: Palette,
      title: "Graphics Design",
      description: "Professional logo packages, visual assets, brand assets, and custom vector layouts that present a cohesive visual standard.",
    },
    {
      id: "social-media-management",
      icon: MessageSquare,
      title: "Social Media Management",
      description: "Creative content calendars, visual scheduling, and community engagement strategies to grow organic brand authority.",
    },
    {
      id: "virtual-assistant-services",
      icon: UserCheck,
      title: "Virtual Assistant Services",
      description: "Administrative support operations, schedule management, and client inquiry handling to streamline your daily operations.",
    },
  ];

  const steps = [
    {
      number: "01",
      name: "Discover",
      desc: "We research your business objectives, target audience demographics, and layout standard technical requirements.",
    },
    {
      number: "02",
      name: "Strategize",
      desc: "We construct the visual blueprints, map page wireframes, and select the optimal execution technologies.",
    },
    {
      number: "03",
      name: "Create",
      desc: "Our design and engineering team develops high-fidelity assets, review cycles, and performance test scores.",
    },
    {
      number: "04",
      name: "Launch & Grow",
      desc: "We deploy the optimized static output live, verify indexing performance, and begin tracking custom analytics.",
    },
  ];

  const [activeHash, setActiveHash] = useState("");

  // Scroll to active hash anchor on mount or hash change
  useEffect(() => {
    const handleScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace("#", "");
        setActiveHash(id);
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 200);
        }
      }
    };

    handleScroll();
    window.addEventListener("hashchange", handleScroll);
    return () => window.removeEventListener("hashchange", handleScroll);
  }, []);

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

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">

        {/* SECTION 1 — HERO SECTION */}
        <section className="relative min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-between pt-20 pb-4 overflow-hidden bg-background">
          {/* Subtle grid background to match reference UIUX design */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a04_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a04_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col justify-between relative z-10">
            {/* 2-Column Grid matching Home Hero Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full my-auto py-2">
              
              {/* Left Column: Heading & Text */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="lg:col-span-7 flex flex-col justify-center text-left space-y-4"
              >
                {/* Eyebrow */}
                <motion.div
                  variants={itemVariants}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-card-border bg-card/40 backdrop-blur-md w-fit"
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    OUR CAPABILITIES
                  </span>
                </motion.div>
 
                {/* Headline */}
                <motion.h1
                  variants={itemVariants}
                  className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-foreground leading-[1.1] mb-2"
                >
                  We build digital solutions<br />
                  that help{" "}
                  <span className="text-accent relative inline-block">
                    businesses grow.
                    <span className="absolute bottom-1.5 left-0 w-full h-[3px] bg-accent/20 rounded-full" />
                  </span>
                </motion.h1>
 
                {/* Supporting Copy */}
                <motion.p
                  variants={itemVariants}
                  className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl mb-2"
                >
                  Explore our full suite of premium services designed by professional UI/UX designers and backed by performance-oriented engineering frameworks.
                </motion.p>
 
                {/* CTA Button */}
                <motion.div
                  variants={itemVariants}
                  className="pt-1 mb-2"
                >
                  <a
                    href="#contact-cta"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 font-semibold text-white bg-accent hover:bg-accent-hover rounded-[14px] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-[2px]"
                  >
                    <span>Let's Work Together</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </motion.div>

                {/* Trust Indicator Section with Real Avatars */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-3.5 py-3 border-t border-card-border/30 max-w-sm"
                >
                  <div className="flex -space-x-2 select-none">
                    <div className="w-7 h-7 rounded-full border-2 border-background overflow-hidden bg-muted/10 relative">
                      <Image src="/avatar1.png" alt="Client 1" fill sizes="28px" className="object-cover" />
                    </div>
                    <div className="w-7 h-7 rounded-full border-2 border-background overflow-hidden bg-muted/10 relative">
                      <Image src="/avatar2.png" alt="Client 2" fill sizes="28px" className="object-cover" />
                    </div>
                    <div className="w-7 h-7 rounded-full border-2 border-background overflow-hidden bg-muted/10 relative">
                      <Image src="/avatar3.png" alt="Client 3" fill sizes="28px" className="object-cover" />
                    </div>
                    <div className="w-7 h-7 rounded-full border-2 border-background overflow-hidden bg-muted/10 relative">
                      <Image src="/avatar4.png" alt="Client 4" fill sizes="28px" className="object-cover" />
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
 
              {/* Right Column: Laptop Visual Graphic matching Home Hero Right Column */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="relative w-full aspect-[4/3] max-w-[320px] lg:max-w-[400px] flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl border border-card-border/50 bg-card/10 backdrop-blur-sm"
                >
                  {/* Subtle Background Glow Sphere matching Home Page */}
                  <div className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-accent/20 to-indigo-500/10 blur-[50px] dark:blur-[70px] -z-10" />
                  
                  <Image
                    src="/laptop.png"
                    alt="Services Hero Laptop"
                    fill
                    sizes="(max-width: 768px) 320px, 400px"
                    className="object-contain p-4 transition-transform duration-500 hover:scale-105"
                    priority
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

        {/* SECTION 2 — SERVICES GRID */}
        <section className="py-20 md:py-28 relative border-t border-card-border/50 bg-background">
          <div className="max-w-7xl mx-auto px-6 w-full space-y-16">

            {/* Header description */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 text-left">
              <div className="max-w-xl">
                <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-3">
                  SERVICE SUITE
                </span>
                <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-foreground">
                  Our Professional Services
                </h2>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                Each service is tailored with a minimal design system, dark-mode capability, and optimal user paths.
              </p>
            </div>

            {/* Services Grid container */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {services.map((service) => {
                const IconComponent = service.icon;
                return (
                  <div
                    id={service.id}
                    key={service.id}
                    className={`p-8 rounded-[20px] border bg-card text-left transition-all duration-300 flex flex-col justify-between group scroll-mt-28 relative ${activeHash === service.id
                        ? "border-accent shadow-[0_0_20px_rgba(30,58,138,0.15)] scale-[1.01]"
                        : "border-card-border hover:border-accent/40 shadow-sm hover:shadow-md"
                      }`}
                  >
                    {/* Background glow highlights on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[20px]" />

                    <div className="space-y-6 relative z-10">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-accent/5 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                        <IconComponent className="w-5 h-5 stroke-[1.75]" />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-accent transition-colors duration-300">
                          {service.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 relative z-10">
                      <a
                        href={`https://wa.me/2348112769033?text=Hi%20Mervox%20Dynamics,%20I'd%20like%20to%20discuss%20a%20project%20for%20${encodeURIComponent(service.title)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-hover transition-colors duration-300 mt-auto"
                      >
                        <span>Discuss Project</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* SECTION 3 — PROCESS SECTION */}
        <section className="py-20 md:py-28 relative border-t border-card-border/50 bg-background">
          <div className="max-w-7xl mx-auto px-6 w-full space-y-16">

            {/* Header description */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 text-left">
              <div className="max-w-xl">
                <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-3">
                  WORKFLOW
                </span>
                <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-foreground">
                  How We Work
                </h2>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                A simple, direct process designed to remove bottlenecks and deliver high-performance products.
              </p>
            </div>

            {/* Process Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-start relative group text-left">
                  {/* Horizontal Connector Line for desktop */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-7 left-14 w-[calc(100%-3.5rem)] h-[1px] border-t border-dashed border-card-border" />
                  )}

                  {/* Step Circle Container */}
                  <div className="w-14 h-14 rounded-full border border-card-border bg-card shadow-sm flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    <span className="text-sm font-bold font-heading">{step.number}</span>
                  </div>

                  <h4 className="text-lg font-heading font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                    {step.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 — CTA SECTION */}
        <section id="contact-cta" className="py-20 max-w-7xl mx-auto px-6">
          <div className="p-12 md:p-20 rounded-[32px] bg-gradient-to-br from-accent/5 to-transparent dark:from-accent/[0.03] border border-card-border/50 flex flex-col items-center text-center relative overflow-hidden">
            {/* Decorative dot highlights */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <span className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-4">
              READY TO LAUNCH?
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-foreground mb-4">
              Let's create something exceptional together.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-10 max-w-md">
              Share your business objectives and get a free blueprint outline for your digital project.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="https://wa.me/2348112769033"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-accent text-white font-bold rounded-[14px] hover:bg-accent-hover transition-all duration-300 shadow-md hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                <span>Book a Free Call</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <Link
                href="/#contact"
                className="px-8 py-4 border border-card-border hover:border-accent/40 bg-card hover:bg-muted/10 font-bold rounded-[14px] transition-all duration-300 inline-flex items-center gap-2"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
