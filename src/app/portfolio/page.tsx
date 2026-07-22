"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, MonitorSmartphone, Code, ShoppingCart, Paintbrush, Calendar, ExternalLink, Star } from "lucide-react";

// Developer Toggle: Set to true to display actual screenshots (/port1.png, /port2.png, /port3.png)
// Set to false to display the clean browser mockup placeholders
const USE_FINAL_IMAGES = false;

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Projects");

  const categories = ["All Projects", "Web Development", "E-commerce", "Shopify", "Design"];

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

  const projects = [
    {
      id: 1,
      title: "Next.js Website Development",
      category: "Web Development",
      categories: ["Web Development"],
      description: "A modern, high-performance website built with Next.js, focused on creating a professional, responsive, and high-performing digital experience.",
      highlights: [
        "Next.js App Router & TypeScript",
        "Sleek and responsive digital craftsmanship",
        "Speed optimized for sub-second load times",
      ],
      image: "/port1.png",
      link: "https://amphora-it.com/",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      icon: Code,
    },
    {
      id: 2,
      title: "Etsy Shop Creation & Product Design",
      category: "E-commerce",
      categories: ["E-commerce", "Design"],
      description: "A professional Etsy shop setup and digital product design project focused on creating an attractive storefront and presenting products in a clear and engaging way.",
      highlights: [
        "Bespoke storefront banner and branding",
        "Strategic SEO tags and catalog organization",
        "Clean digital product templates and previews",
      ],
      image: "/port2.png",
      link: "https://www.etsy.com/shop/DreamGirlPlan?ref=shop-header-name&listing_id=4389994843&from_page=listing",
      tech: ["Store Setup", "Product Design", "E-commerce SEO", "Digital Assets"],
      icon: Paintbrush,
    },
    {
      id: 3,
      title: "Shopify Website Design",
      category: "Shopify / E-commerce",
      categories: ["Shopify", "E-commerce"],
      description: "A premium Shopify website design focused on creating a clean, visually engaging, and user-friendly online shopping experience.",
      highlights: [
        "Headless checkout layout configuration",
        "Premium font hierarchy and brand palette layout",
        "Conversion rate optimization (CRO) audit assets",
      ],
      image: "/port3.png",
      link: "https://www.rouje.com/",
      tech: ["Shopify Liquid", "UI/UX Design", "Brand Identity", "Store Customization"],
      icon: ShoppingCart,
    },
  ];

  const filteredProjects = projects.filter((project) => {
    if (selectedCategory === "All Projects") return true;
    return project.categories.includes(selectedCategory);
  });

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background text-foreground transition-colors duration-300">
        
        {/* HERO SECTION — Harmonized with Home Page Hero */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden border-b border-card-border/50 bg-background/50">
          {/* Faint ambient glows */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[130px]" />
            <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[130px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 w-full relative z-10 text-left">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-3xl"
            >
              {/* Eyebrow Label */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-card-border bg-card/45 backdrop-blur-md w-fit mb-4"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Our Work
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-foreground leading-[1.1] mb-5"
              >
                Our{" "}
                <span className="text-accent relative inline-block">
                  Portfolio
                  <span className="absolute bottom-1.5 left-0 w-full h-[3px] bg-accent/20 rounded-full" />
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl"
              >
                Real projects. Real results. Built with creativity, strategy, and precision. We partner with ambitious businesses to engineer high-conversion digital experiences.
              </motion.p>

              {/* Trust Indicator */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3.5 mt-8 pt-6 border-t border-card-border/30 max-w-sm"
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

                <div className="flex flex-col items-start gap-0.5">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-[#0055ff] text-[#0055ff] dark:fill-[#3b82f6] dark:text-[#3b82f6]"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                    Trusted by 100+ Brands & Businesses
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* Category Filter */}
            <div className="flex flex-wrap items-center justify-start gap-2.5 mb-16 border-b border-card-border/30 pb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#0055ff] text-white shadow-md shadow-blue-500/15"
                      : "border border-card-border hover:border-slate-350 dark:hover:border-slate-700 bg-card hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Staggered Projects Grid */}
            <div className="space-y-24 md:space-y-32">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, idx) => {
                  const isEven = idx % 2 === 0;
                  const ProjectIcon = project.icon;

                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
                    >
                      {/* Image or Placeholder Column */}
                      <div className={`lg:col-span-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                        <div className="relative w-full aspect-[16/10] rounded-[24px] border border-card-border/60 bg-white dark:bg-black shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden flex flex-col group p-3 pb-0">
                          
                          {/* Browser mockup bar */}
                          <div className="flex items-center gap-2 mb-2 px-1 shrink-0 select-none">
                            <div className="flex gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-red-400/80 dark:bg-red-500/60" />
                              <span className="w-2 h-2 rounded-full bg-yellow-400/80 dark:bg-yellow-500/60" />
                              <span className="w-2 h-2 rounded-full bg-green-400/80 dark:bg-green-500/60" />
                            </div>
                            <div className="flex-1 max-w-[200px] mx-auto py-0.5 px-2 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/50 text-[9px] text-muted-foreground/80 truncate text-center font-medium">
                              {project.link.replace("https://", "").replace("www.", "").split("/")[0]}
                            </div>
                          </div>

                          {/* Preview container */}
                          <div className="relative flex-1 w-full rounded-t-xl overflow-hidden border border-slate-200/40 dark:border-slate-800/60 bg-white dark:bg-black flex items-center justify-center">
                            {USE_FINAL_IMAGES ? (
                              <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                sizes="(max-w-768px) 100vw, 50vw"
                                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                              />
                            ) : (
                              /* Clean, premium typographic placeholder */
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-black select-none">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/50 dark:border-slate-800/80 flex items-center justify-center mb-3">
                                  <ProjectIcon className="w-5 h-5 text-[#0055ff] dark:text-blue-400" />
                                </div>
                                <h4 className="text-sm font-heading font-extrabold text-foreground tracking-tight mb-1">
                                  {project.title}
                                </h4>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-slate-200/40 dark:bg-slate-800/40 px-2 py-0.5 rounded border border-card-border/50">
                                  Screenshot Placement
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content Column */}
                      <div className={`lg:col-span-6 flex flex-col justify-center text-left ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                        {/* Category tag */}
                        <span className="text-[11px] font-bold text-[#0055ff] dark:text-blue-400 mb-2.5 uppercase tracking-widest">
                          {project.category}
                        </span>

                        {/* Title */}
                        <h3 className="text-xl sm:text-2xl font-heading font-black text-foreground mb-4 leading-tight">
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-foreground/80 dark:text-slate-200 leading-relaxed mb-6">
                          {project.description}
                        </p>

                        {/* Highlights list */}
                        <div className="space-y-2.5 mb-8">
                          {project.highlights.map((h, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-xs text-foreground/90 dark:text-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0055ff] dark:bg-blue-500 mt-1.5 shrink-0" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>

                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-1.5 mb-8">
                          {project.tech.map((t) => (
                            <span
                              key={t}
                              className="text-[9px] font-bold uppercase tracking-wider text-foreground/80 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 border border-card-border px-2.5 py-1 rounded-md"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Button Link */}
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-5 py-3 bg-[#0055ff] hover:bg-[#0044dd] text-white font-bold text-xs rounded-xl shadow-[0_2px_8px_rgba(0,85,255,0.18)] hover:shadow-[0_4px_15px_rgba(0,85,255,0.28)] transition-all duration-300 cursor-pointer"
                        >
                          <span>View Live Project</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION SECTION */}
        <section className="py-24 bg-card border-t border-card-border/40 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[120px]" />
          </div>

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-foreground tracking-tight">
              Have a Project in Mind?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Let's turn your ideas into powerful digital solutions that drive real results. Get in touch for a free strategy session.
            </p>
            <div className="pt-4">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#0055ff] hover:bg-[#0044dd] text-white font-bold text-xs rounded-2xl shadow-[0_4px_18px_rgba(0,85,255,0.2)] hover:shadow-[0_6px_22px_rgba(0,85,255,0.3)] transition-all duration-300 cursor-pointer hover:-translate-y-[2px]"
              >
                <span>Book a Free Call</span>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
