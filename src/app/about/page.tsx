"use client";

import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Alex_Brush } from "next/font/google";

const signatureFont = Alex_Brush({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

import {
  Play,
  MonitorSmartphone,
  ShoppingCart,
  PenTool,
  Send,
  MessageSquareHeart,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Mail,
  FileText,
  Target,
  Cpu,
  Compass,
  Heart,
  Search,
  CheckCircle,
  Eye,
  Rocket,
} from "lucide-react";

export default function AboutPage() {
  const expertise = [
    {
      icon: MonitorSmartphone,
      title: "Web Design & Development",
      desc: "Building modern, fast & responsive websites.",
    },
    {
      icon: Sparkles,
      title: "UI/UX Design",
      desc: "Designing experiences that are intuitive and user-friendly.",
    },
    {
      icon: Send,
      title: "Digital Marketing",
      desc: "Strategies that attract, engage and convert.",
    },
    {
      icon: ShoppingCart,
      title: "Ecommerce Solutions",
      desc: "Building powerful online stores that sell.",
    },
    {
      icon: PenTool,
      title: "Branding & Identity",
      desc: "Creating brands that stand out and connect.",
    },
    {
      icon: MessageSquareHeart,
      title: "Social Media Management",
      desc: "Building presence and engagement that grows.",
    },
    {
      icon: Mail,
      title: "Email Marketing",
      desc: "Smart email systems that nurture and convert.",
    },
    {
      icon: FileText,
      title: "Content & Copy Creation",
      desc: "Words and content that communicate value.",
    },
    {
      icon: Target,
      title: "Advertising",
      desc: "Targeted ads that bring real results.",
    },
    {
      icon: Cpu,
      title: "Automation & Digital Solutions",
      desc: "Streamlining processes with smart automation.",
    },
  ];

  const philosophy = [
    {
      icon: Compass,
      title: "Strategy First",
      desc: "We understand your business before we build anything.",
    },
    {
      icon: Target,
      title: "Built for Results",
      desc: "A beautiful website is good. A website that brings results is better.",
    },
    {
      icon: Heart,
      title: "Human-Centered",
      desc: "We design and build experiences that people love to use.",
    },
    {
      icon: TrendingUp,
      title: "Built to Evolve",
      desc: "We create solutions that can grow with your business.",
    },
  ];

  const stats = [
    { value: "6+", label: "Years of Experience", desc: "Hands-on experience across multiple digital disciplines." },
    { value: "15+", label: "Specialists & Partners", desc: "A strong network of experts dedicated to your success." },
    { value: "100+", label: "Projects Completed", desc: "Helping businesses bring their ideas to life." },
    { value: "Multiple", label: "Digital Services", desc: "End-to-end solutions under one trusted brand." },
  ];

  const steps = [
    { number: "01", name: "Discover", desc: "We understand your business, goals, audience, and challenges.", icon: Search },
    { number: "02", name: "Strategize", desc: "We create the right strategy and roadmap to achieve your goals.", icon: Target },
    { number: "03", name: "Create", desc: "Our team designs, develops, and brings your vision to life.", icon: PenTool },
    { number: "04", name: "Refine", desc: "We test, review, and improve to ensure the highest quality.", icon: CheckCircle },
    { number: "05", name: "Grow", desc: "We help you optimize, improve, and scale your digital presence.", icon: TrendingUp },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        
        {/* SECTION 1 — ABOUT HERO */}
        <section className="relative min-h-screen lg:h-[88vh] lg:max-h-[720px] flex flex-col justify-between pt-10 pb-2 overflow-hidden border-b border-card-border/50 bg-background">
          <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col justify-between relative z-10">
            
            {/* Main Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-4 lg:gap-12 items-center w-full mt-2 mb-auto py-1 animate-fadeIn">
              
              {/* Hero Text */}
              <div className="lg:col-span-7 flex flex-col justify-center text-left">
                {/* Eyebrow Label */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-card-border bg-card/40 backdrop-blur-md w-fit mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    ABOUT MERVOX DYNAMICS
                  </span>
                </div>

                {/* Headline */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-foreground leading-[1.1] mb-3">
                  Digital expertise.<br />
                  Strategic thinking.<br />
                  <span className="text-accent relative inline-block">
                    Real business impact.
                    <span className="absolute bottom-1.5 left-0 w-full h-[3px] bg-accent/20 rounded-full" />
                  </span>
                </h1>

                {/* Supporting Copy */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl mb-4">
                  We help businesses build strong digital foundations through web design, development, marketing, branding, and more.
                </p>

                {/* Call to Actions (matching Home page button sizes and shapes exactly!) */}
                <div className="flex flex-col sm:flex-row gap-5 items-center w-full sm:w-auto mb-4">
                  <div className="flex flex-col w-full sm:w-auto">
                    <Link
                      href="/#services"
                      className="group flex items-center justify-center gap-3 px-7 py-3.5 font-semibold text-white bg-[#0a192f] dark:bg-[#1e3a8a] hover:bg-[#0c1e3b] dark:hover:bg-[#1d4ed8] rounded-[14px] shadow-[0_0_15px_rgba(10,25,47,0.1)] dark:shadow-[0_0_15px_rgba(30,58,138,0.18)] hover:shadow-[0_0_25px_rgba(10,25,47,0.2)] dark:hover:shadow-[0_0_25px_rgba(30,58,138,0.3)] transition-all duration-300 animate-soft-blink hover:-translate-y-[2px]"
                    >
                      <span>Explore Our Services</span>
                      <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>

                  <div className="flex flex-col items-center w-full sm:w-auto gap-1.5">
                    <a
                      href="https://wa.me/2348112769033"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto group flex items-center justify-center gap-3 px-7 py-3.5 font-semibold text-foreground/80 border border-card-border bg-card/10 backdrop-blur-sm rounded-[14px] transition-all duration-300 hover:border-accent/40 hover:-translate-y-[2px]"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                      </span>
                      <Play className="w-4 h-4 shrink-0 fill-foreground/10 text-foreground/60" />
                      <span>Watch Our Story</span>
                    </a>
                    <span className="text-[9px] font-extrabold tracking-[0.2em] text-[#0055ff]/70 dark:text-blue-400/70 animate-soft-blink uppercase select-none">
                      COMING SOON
                    </span>
                  </div>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="lg:col-span-5 relative flex justify-center items-end self-end h-[300px] sm:h-[350px] md:h-[400px] lg:h-[440px] w-full mt-2 lg:mt-0">
                {/* Background Circular Outline (Reduced size relative to image) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[75%] sm:w-[70%] aspect-square rounded-full border border-dashed border-accent/20 -z-10 animate-[spin_100s_linear_infinite]" />
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[65%] sm:w-[60%] aspect-square rounded-full bg-gradient-to-t from-accent/5 to-transparent -z-10" />
                
                {/* Dot grid accent */}
                <div className="absolute top-4 right-4 w-20 h-20 opacity-20 dark:opacity-30 bg-[radial-gradient(var(--accent)_1px,transparent_1px)] [background-size:12px_12px]" />
                
                {/* Main Image - Large Cutout silhouette */}
                <div className="relative w-full max-w-[360px] sm:max-w-[400px] lg:max-w-[440px] h-full">
                  <Image
                    src="/new-marvelous-image.png"
                    alt="Marvelous Kola"
                    fill
                    className="object-contain object-bottom scale-110 md:scale-105 transition-transform duration-500 hover:scale-115"
                    priority
                  />
                </div>
              </div>

            </div>

            {/* Infinite Brands Scroll Footer (Trusted by Brands and Businesses) */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
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

        {/* SECTION 2 — OUR STORY */}
        <section className="py-20 md:py-28 relative border-b border-card-border/50">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Story Text */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="text-xs font-bold text-accent uppercase tracking-widest block">
                OUR STORY
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-foreground">
                The Story Behind Mervox Dynamics
              </h2>
              <div className="text-sm sm:text-base text-muted-foreground leading-relaxed space-y-5">
                <p>
                  Mervox Dynamics was born from a simple realization: having a great business idea is only the beginning.
                </p>
                <p>
                  With over 6 years of experience across web design, web development, digital marketing, ecommerce, branding, social media, and other digital solutions, we understand the challenges businesses face in today's digital world.
                </p>
                <p>
                  Our goal is to bring strategy, creativity, technology, and execution together to help businesses build stronger digital foundations and create meaningful digital experiences.
                </p>
                <p>
                  Today, Mervox Dynamics works with a growing network of skilled professionals and creative partners, bringing different areas of expertise together to deliver solutions built around each client's unique goals.
                </p>
              </div>
              <div className="pt-4 border-t border-card-border/50 inline-block">
                <span className={`${signatureFont.className} text-4xl text-accent block tracking-wide leading-none`}>
                  Marvelous Kola
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-2 block">
                  Founder, Mervox Dynamics
                </span>
              </div>
            </div>

            {/* Story Visual */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-[440px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-card border border-card-border">
                <Image
                  src="/ceo-pics.jpeg"
                  alt="Marvelous Kola Sitting"
                  fill
                  className="object-cover object-center scale-105 transition-transform duration-500 hover:scale-110"
                />
                
                {/* Floating Quote Bubbles */}
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-background/90 dark:bg-background/95 backdrop-blur border border-card-border/50 shadow-xl flex items-start gap-3.5">
                  <span className="text-3xl text-accent font-serif leading-none mt-1">“</span>
                  <p className="text-[11px] sm:text-xs text-foreground font-medium leading-relaxed">
                    My goal is simple: create digital solutions that help businesses grow, scale and thrive in a digital world.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3 — OUR EXPERTISE */}
        <section className="py-20 md:py-28 relative border-b border-card-border/50">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Headline Block */}
            <div className="lg:col-span-4 flex flex-col items-start text-left space-y-6">
              <div>
                <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-3">
                  OUR TEAM
                </span>
                <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-foreground mb-4">
                  15+ Specialists.<br />
                  One Shared Vision.
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  We're a collaborative network of 15+ skilled professionals and creative partners working together to deliver exceptional digital solutions.
                </p>
              </div>
              <a
                href="https://wa.me/2348112769033"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 border border-accent text-accent font-semibold rounded-full hover:bg-accent hover:text-white transition-all duration-300 inline-flex items-center gap-2"
              >
                Connect With Us <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Grid Block */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {expertise.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-card-border/60 bg-card/30 hover:bg-card hover:border-accent/15 transition-all duration-300 text-left flex items-start gap-4 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-accent/5 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-heading font-bold text-foreground mb-1 group-hover:text-accent transition-colors duration-300">
                          {item.title}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 4 — OUR PHILOSOPHY */}
        <section className="py-20 md:py-28 relative border-b border-card-border/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-3">
                OUR PHILOSOPHY
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-foreground">
                How We Think
              </h2>
              <div className="h-1 w-10 bg-accent/20 rounded-full mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {philosophy.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-8 rounded-2xl border border-card-border/60 bg-card/30 hover:bg-card hover:border-accent/15 hover:shadow-sm transition-all duration-300 text-left flex flex-col group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-accent/5 text-accent flex items-center justify-center shrink-0 mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                      <Icon className="w-4.5 h-4.5 text-accent group-hover:text-white" />
                    </div>
                    <h4 className="text-base font-heading font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 5 — STATS */}
        <section className="py-16 md:py-20 bg-muted/20 border-b border-card-border/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-card-border/50">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center text-center p-4 ${
                    idx > 0 ? "pt-10 sm:pt-4 lg:pl-6" : ""
                  }`}
                >
                  <span className="text-4xl md:text-5xl font-heading font-black text-accent mb-2">
                    {stat.value}
                  </span>
                  <span className="text-sm font-heading font-bold text-foreground mb-1.5">
                    {stat.label}
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-[220px]">
                    {stat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6 — OUR PROCESS */}
        <section className="py-20 md:py-28 relative border-b border-card-border/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-3">
                OUR PROCESS
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-foreground">
                Our Proven Process
              </h2>
              <div className="h-1 w-10 bg-accent/20 rounded-full mx-auto mt-4" />
            </div>

            {/* Process Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left relative group">
                    {/* Horizontal Connector Line for desktop */}
                    {idx < steps.length - 1 && (
                      <div className="hidden md:block absolute top-6 left-12 w-full h-[1px] bg-card-border/80 group-hover:bg-accent/30 transition-colors duration-300 -z-10" />
                    )}
                    
                    {/* Step Icon Container */}
                    <div className="w-12 h-12 rounded-full border border-card-border bg-card/60 shadow-sm flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                      <Icon className="w-4.5 h-4.5" />
                    </div>

                    <span className="text-[10px] font-bold text-accent tracking-widest uppercase block mb-1">
                      STEP {step.number}
                    </span>
                    <h4 className="text-base font-heading font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                      {step.name}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px] md:max-w-none">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 7 — MISSION & VISION */}
        <section className="py-20 md:py-28 relative border-b border-card-border/50">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 divide-y md:divide-y-0 md:divide-x divide-card-border/50">
            
            {/* Mission */}
            <div className="flex flex-col items-start text-left space-y-5 pb-8 md:pb-0">
              <div className="w-12 h-12 rounded-2xl bg-accent/5 text-accent flex items-center justify-center shrink-0">
                <Rocket className="w-5 h-5" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-foreground">
                Our Mission
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                To help businesses become better equipped for the digital world through innovative solutions, strategic thinking, and quality execution.
              </p>
            </div>

            {/* Vision */}
            <div className="flex flex-col items-start text-left space-y-5 pt-8 md:pt-0 md:pl-12">
              <div className="w-12 h-12 rounded-2xl bg-accent/5 text-accent flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-foreground">
                Our Vision
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                A future where ambitious businesses have the digital foundation they need to grow, innovate, and make a lasting impact.
              </p>
            </div>

          </div>
        </section>

        {/* SECTION 8 — FOUNDER MESSAGE */}
        <section className="py-20 md:py-28 relative border-b border-card-border/50">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Message Column */}
            <div className="lg:col-span-7 text-left space-y-6">
              <span className="text-xs font-bold text-accent uppercase tracking-widest block">
                A MESSAGE FROM THE FOUNDER
              </span>
              
              <span className="text-5xl text-accent font-serif leading-none block -mb-4">“</span>
              
              <div className="text-sm sm:text-base text-foreground font-medium leading-relaxed space-y-5">
                <p>
                  I believe every business has something valuable to offer. My goal is to help businesses build digital experiences that tell their stories, connect with their audiences, and create real opportunities for growth.
                </p>
                <p>
                  That's why I built Mervox Dynamics.
                </p>
                <p>
                  We're here to help businesses build stronger digital foundations, create meaningful experiences, and turn their ideas into something people can see, use, and believe in.
                </p>
                <p>
                  We're still growing. We're still learning. And we're just getting started. But our vision is clear: we want to build digital solutions that move businesses forward.
                </p>
              </div>

              <div className="pt-4 border-t border-card-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <span className={`${signatureFont.className} text-4xl text-accent block tracking-wide leading-none`}>
                    Marvelous Kola
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-2 block">
                    Founder & Creative Lead
                  </span>
                </div>
                {/* Handwritten signature visual styling */}
                <div className={`${signatureFont.className} text-4xl opacity-50 dark:opacity-40 text-accent select-none hidden sm:block`}>
                  Marvelous Kola
                </div>
              </div>
            </div>

            {/* Photo Column */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-[440px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-card border border-card-border">
                <Image
                  src="/ceo-pics.jpeg"
                  alt="Marvelous Kola Portrait"
                  fill
                  className="object-cover object-center scale-105 transition-transform duration-500 hover:scale-110"
                />
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 9 — FINAL CTA */}
        <section className="py-20 md:py-24 max-w-7xl mx-auto px-6">
          <div className="p-12 md:p-20 rounded-[32px] bg-gradient-to-br from-accent/5 to-transparent dark:from-accent/[0.03] border border-card-border/50 flex flex-col items-center text-center relative overflow-hidden">
            {/* Decorative dot highlights */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
            
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-4">
              READY TO GROW?
            </span>
            <h2 className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-foreground mb-4">
              Let's build what's next.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-md">
              Your idea. Our expertise. Real impact.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="https://wa.me/2348112769033"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-accent text-white font-bold rounded-full hover:bg-accent-hover transition-all duration-300 shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 inline-flex items-center gap-2 relative group"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                Book a Free Call
              </a>
              <Link
                href="/#contact"
                className="px-8 py-4 border border-card-border hover:border-accent/40 bg-card hover:bg-muted/10 font-bold rounded-full transition-all duration-300 inline-flex items-center gap-2"
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
