"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Globe, Layers, Sparkles } from "lucide-react";
import Link from "next/link";

export function Portfolio() {
  const projects = [
    {
      title: "Apex SaaS Platform",
      category: "Web Development / UI UX",
      description: "A high-performance SaaS dashboard featuring real-time collaborative workflows and minimal interfaces.",
      gradient: "from-blue-600/20 via-indigo-600/10 to-transparent",
      accentColor: "text-blue-500",
      tag: "SaaS App",
      icon: Globe,
    },
    {
      title: "Nova Brand Identity",
      category: "Brand Design / Strategy",
      description: "Visual identity system, corporate guidelines, and assets crafted for an AI-native infrastructure startup.",
      gradient: "from-purple-600/20 via-pink-600/10 to-transparent",
      accentColor: "text-purple-500",
      tag: "Branding",
      icon: Sparkles,
    },
    {
      title: "Velo E-commerce",
      category: "Store Creation / Headless",
      description: "A headless commerce storefront built on Shopify and Next.js, achieving sub-second load times.",
      gradient: "from-emerald-600/20 via-teal-600/10 to-transparent",
      accentColor: "text-emerald-500",
      tag: "E-Commerce",
      icon: Layers,
    },
  ];

  return (
    <section id="portfolio" className="py-24 bg-background relative border-t border-card-border/50">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-accent mb-3">
              Selected Work
            </h2>
            <h3 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-foreground">
              Our Recent Digital Creations
            </h3>
            <div className="h-1 w-10 bg-accent/20 rounded-full mt-4" />
          </div>
          <p className="text-sm text-muted-foreground max-w-md md:text-right">
            We partner with ambitious startups and enterprises to build premium software products that unlock compounding growth.
          </p>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, idx) => {
            const ProjectIcon = project.icon;
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                className="group rounded-[18px] border border-card-border bg-card/45 hover:bg-card hover:border-accent/15 transition-all duration-500 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-lg"
              >
                {/* Visual Cover (Abstract Gradient/Illustration) */}
                <div className={`relative w-full aspect-[16/10] bg-gradient-to-br ${project.gradient} border-b border-card-border/60 flex items-center justify-center p-8 overflow-hidden`}>
                  {/* Glowing ambient background element */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {/* Floating abstract decorative box */}
                  <div className="w-full h-full rounded-2xl border border-card-border/80 bg-card/60 backdrop-blur-md shadow-inner flex flex-col justify-between p-5 relative z-10 transition-transform duration-500 group-hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-background/50 border border-card-border/50 flex items-center justify-center">
                        <ProjectIcon className={`w-4 h-4 ${project.accentColor}`} />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/65 px-2.5 py-1 rounded-full border border-card-border/40">
                        {project.tag}
                      </span>
                    </div>

                    <div className="space-y-1 text-left">
                      <span className="text-[10px] text-muted-foreground font-semibold">Active Case Study</span>
                      <p className="text-xs font-bold text-foreground">Interactive Demo Dashboard</p>
                    </div>
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-8 flex flex-col flex-grow items-start text-left">
                  <span className="text-[11px] font-semibold text-accent mb-2 uppercase tracking-wide">
                    {project.category}
                  </span>
                  <h4 className="text-lg font-heading font-bold text-foreground mb-3 group-hover:text-accent transition-colors duration-300">
                    {project.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-6 flex-grow">
                    {project.description}
                  </p>

                  <Link 
                    href="#contact" 
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-accent group/btn transition-colors"
                  >
                    Discuss This Project 
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
