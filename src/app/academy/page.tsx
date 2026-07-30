"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Users,
  BookOpen,
  CheckCircle2,
  Award,
  ChevronRight,
  TrendingUp,
  Video,
  Cpu,
  Code2,
  Calendar,
  Compass,
  ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AcademyPage() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  const cardHoverEffect = {
    y: -4,
    transition: { duration: 0.3, ease: "easeOut" as any }
  };

  const aboutFeatures = [
    {
      icon: GraduationCap,
      title: "Beginner Friendly",
      desc: "No prior technical experience needed. We teach you from the absolute ground up.",
      color: "text-blue-600 bg-blue-500/10",
    },
    {
      icon: Briefcase,
      title: "Real Projects",
      desc: "Build actual projects and custom client work that showcase your practical skills.",
      color: "text-emerald-600 bg-emerald-500/10",
    },
    {
      icon: Users,
      title: "Expert Mentorship",
      desc: "Receive constant guidance and direct feedback from active industry developers.",
      color: "text-purple-600 bg-purple-500/10",
    },
    {
      icon: BookOpen,
      title: "Lifetime Resources",
      desc: "Access session replays, code checklists, design tools, and study references forever.",
      color: "text-pink-600 bg-pink-500/10",
    },
  ];

  const whyLearnPoints = [
    "Practical hands-on learning",
    "Experienced instructors",
    "Community support",
    "Certificate of completion",
    "Lifetime access where applicable",
    "Career guidance",
  ];

  const courses = [
    {
      icon: TrendingUp,
      badge: "Partnered with JPForex",
      title: "Forex Trading",
      desc: "Master technical analysis, risk management, trading psychology, and live market strategies through our partnership with JPForex (HabbyForex Student)",
      features: ["Live Market Analysis", "Trading Psychology", "1-on-1 Mentoring", "JPForex Backing"],
      color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
      image: "/course-forex-v3.webp",
    },
    {
      icon: Video,
      badge: "Video Creator Course",
      title: "YouTube Monetization",
      desc: "Master high-yield channel creation, algorithmic SEO growth, thumbnails design, audience analytics, and multi-tier revenue monetization.",
      features: ["Algorithm SEO Hacks", "Channel Automation", "Thumbnails & Editing", "Sponsorship Guides"],
      color: "text-red-600 bg-red-500/10 border-red-500/20",
      image: "/course-youtube-v3.webp",
    },
    {
      icon: Cpu,
      badge: "Artificial Intelligence",
      title: "AI Automation",
      desc: "Harness cutting-edge generative AI, ChatGPT prompt engineering, no-code automation funnels, and enterprise workflows to multiply business productivity.",
      features: ["Prompt Engineering", "Zapier/Make Automation", "No-code SaaS Building", "AI Business Integration"],
      color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
      image: "/course-ai-v3.webp",
    },
    {
      icon: Code2,
      badge: "Software Engineering",
      title: "Web & Software Dev",
      desc: "Master coding including Web Design, UI/UX, Frontend & Backend code, Mobile Apps development, and Vercel cloud deployment. Prepares you for freelancing and remote jobs.",
      features: ["React/Next.js/Node.js", "UI/UX Figma Design", "Mobile Apps (React Native)", "Database & Deployment"],
      color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
      image: "/course-webdev-v3.webp",
    },
  ];

  const benefits = [
    {
      title: "Hands-on Projects",
      desc: "Apply what you learn by building real-world digital applications and design layouts.",
      icon: Briefcase,
    },
    {
      title: "Industry Mentorship",
      desc: "Receive feedback and guidance directly from active field software engineers.",
      icon: Users,
    },
    {
      title: "Certification",
      desc: "Gain industry-recognized certificates of completion to boost your professional portfolio.",
      icon: Award,
    },
    {
      title: "Career Opportunities",
      desc: "Unlock pathways to remote software developer jobs, high-ticket freelancing, and digital agencies.",
      icon: Compass,
    },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background text-foreground transition-colors duration-300">

        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden border-b border-card-border/50 bg-background">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[130px]" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-[130px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* Left Info Column */}
              <div className="lg:col-span-7 text-left">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="max-w-2xl space-y-6"
                >
                  <motion.div
                    variants={itemVariants}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-card-border bg-card/45 backdrop-blur-md w-fit"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0055ff] animate-pulse" />
                    <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      Mervox Academy
                    </span>
                  </motion.div>

                  <motion.h1
                    variants={itemVariants}
                    className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-black dark:text-foreground leading-[1.1]"
                  >
                    Learn Skills. <br />
                    <span className="text-[#0055ff] dark:text-blue-500 relative inline-block">
                      Build Businesses.
                      <span className="absolute bottom-1.5 left-0 w-full h-[3px] bg-blue-500/20 rounded-full" />
                    </span> <br />
                    Create Opportunities.
                  </motion.h1>

                  <motion.p
                    variants={itemVariants}
                    className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl"
                  >
                    Mervox Academy equips beginners, professionals and business owners with practical digital skills that help them earn more, build businesses and stay ahead in today's digital world.
                  </motion.p>

                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto"
                  >
                    <Link
                      href="/academy/dashboard"
                      className="group flex items-center justify-center gap-3 px-8 py-4 font-bold text-white bg-[#0a192f] dark:bg-[#1e3a8a] hover:bg-[#0c1e3b] dark:hover:bg-[#1d4ed8] rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-[2px]"
                    >
                      <span>Explore Courses</span>
                      <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>

                    <Link
                      href="/academy/signup"
                      className="group flex items-center justify-center gap-3 px-8 py-4 font-bold text-[#0055ff] dark:text-blue-400 border border-blue-500/20 hover:border-blue-500/40 bg-card hover:bg-white dark:hover:bg-slate-900 rounded-xl shadow-xs transition-all duration-300 hover:-translate-y-[2px]"
                    >
                      <span>Join Academy</span>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>

              {/* Right Illustration Column */}
              <div className="lg:col-span-5 flex justify-center w-full">
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] as any }}
                  className="relative w-full aspect-[4/3] max-w-[540px] flex items-center justify-center"
                >
                  {/* Subtle glowing element behind the illustration */}
                  <div className="absolute inset-0 bg-accent/5 dark:bg-accent/15 blur-[60px] rounded-full pointer-events-none scale-90" />

                  <div className="relative w-full h-full border border-card-border bg-card rounded-3xl p-1.5 overflow-hidden shadow-md flex items-center justify-center">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                      <Image
                        src="/academy-hero-v3.webp"
                        alt="Mervox Academy Learning Platform"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 540px"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        priority
                      />
                    </div>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="py-24 bg-background border-t border-card-border/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

              {/* Text Column */}
              <div className="lg:col-span-5 text-left space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-card-border bg-card/45 backdrop-blur-md w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0055ff]" />
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    About Mervox Academy
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-black dark:text-foreground leading-tight">
                  Learn Practical Skills That Create Real Opportunities
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Mervox Academy is the training arm of Mervox Dynamics. We focus on practical, hands-on learning that prepares students for real jobs, freelancing, entrepreneurship and business growth.
                </p>
              </div>

              {/* Grid Column */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aboutFeatures.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={idx}
                      whileHover={cardHoverEffect}
                      className="p-6 rounded-2xl border border-card-border bg-card/45 hover:bg-card hover:border-accent/15 shadow-xs hover:shadow-md transition-all duration-300 text-left"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-heading font-bold text-black dark:text-foreground mb-2">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

            </div>
          </div>
        </section>

        {/* WHY LEARN WITH US SECTION */}
        <section className="py-24 bg-muted/20 dark:bg-muted/5 border-t border-b border-card-border/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-4xl mx-auto rounded-[24px] border border-card-border bg-card p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center gap-10 md:gap-12">

              {/* Icon Container Left */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#0055ff]/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#0055ff]" />
              </div>

              {/* Checklist Content Right */}
              <div className="text-left space-y-6 flex-1">
                <h3 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-black dark:text-foreground">
                  Why Learn With Us
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {whyLearnPoints.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4.5 h-4.5 text-[#0055ff] shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-black dark:text-slate-200">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* TRAINING PROGRAMS SECTION */}
        <section id="courses" className="py-24 bg-background border-t border-card-border/50">
          <div className="max-w-7xl mx-auto px-6">

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-xs font-bold text-[#0055ff] dark:text-blue-500 uppercase tracking-widest block mb-3">
                Academy Programs
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-black dark:text-foreground">
                Our Training Programs
              </h2>
              <div className="h-1 w-10 bg-blue-500/20 rounded-full mx-auto mt-4" />
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {courses.map((course, idx) => {
                const CourseIcon = course.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={cardHoverEffect}
                    className="p-8 rounded-[24px] border border-card-border bg-card/45 hover:bg-card hover:border-accent/15 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left h-full"
                  >
                    <div className="space-y-6">
                      {/* Course Image Header */}
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-card-border/50 bg-slate-50 dark:bg-slate-900">
                        <Image
                          src={course.image}
                          alt={course.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 360px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      {/* Badge & Icon */}
                      <div className="flex justify-between items-start gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${course.color.split(" ")[0]} ${course.color.split(" ")[1]}`}>
                          <CourseIcon className="w-5.5 h-5.5" />
                        </div>
                        <span className="text-[10px] font-bold text-black dark:text-slate-200 bg-card border border-card-border px-3 py-1 rounded-full uppercase tracking-wider">
                          {course.badge}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-3">
                        <h3 className="text-lg sm:text-xl font-heading font-extrabold text-black dark:text-white">
                          {course.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-black dark:text-slate-200 leading-relaxed leading-normal">
                          {course.desc}
                        </p>
                      </div>

                      {/* Bullet Highlights */}
                      <ul className="space-y-2.5 pt-2">
                        {course.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-3 text-xs text-black dark:text-white font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0055ff] dark:bg-blue-500 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-8">
                      <Link
                        href="/academy/signup"
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#0055ff] dark:text-blue-400 hover:gap-3 transition-all duration-200"
                      >
                        <span>Enroll in Program</span>
                        <ChevronRight className="w-4 h-4 text-[#0055ff] dark:text-blue-400" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section className="py-24 bg-muted/20 dark:bg-muted/5 border-t border-card-border/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, idx) => {
                const BenefitIcon = benefit.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={cardHoverEffect}
                    className="p-6 rounded-2xl border border-card-border bg-card/45 hover:bg-card hover:border-accent/15 shadow-xs hover:shadow-md transition-all duration-300 text-left flex flex-col gap-4"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#0055ff]/10 text-[#0055ff] flex items-center justify-center shrink-0">
                      <BenefitIcon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-heading font-bold text-black dark:text-foreground mb-1.5">
                        {benefit.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed leading-normal">
                        {benefit.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="py-20 bg-background border-t border-card-border/50">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as any }}
              className="relative rounded-[24px] border border-accent/20 bg-accent text-white py-16 px-8 sm:px-16 overflow-hidden flex flex-col items-center shadow-xl"
            >
              {/* Backdrops */}
              <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-white/5 blur-[80px] -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[80px] translate-x-1/2 translate-y-1/2" />

              <h3 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight mb-4 relative z-10 max-w-2xl leading-[1.2]">
                Ready To Build Your Future?
              </h3>
              <p className="text-white/80 text-sm max-w-lg mb-8 relative z-10 leading-relaxed">
                Start learning practical digital skills that open doors to new opportunities and long-term success.
              </p>

              <div className="relative z-10 w-full sm:w-auto">
                <Link
                  href="/academy/signup"
                  className="group flex items-center justify-center gap-3 px-10 py-4 font-bold text-slate-900 bg-white hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-xl shadow-md cursor-pointer"
                >
                  <span>Join Mervox Academy</span>
                  <ChevronRight className="w-4 h-4 text-slate-900 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
