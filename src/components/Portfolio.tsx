"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export function Portfolio() {
  const projects = [
    {
      title: "Next.js Website Development",
      category: "Web Design & Development",
      description: "A modern website project built with Next.js, focused on creating a professional, responsive, and high-performing digital experience.",
      image: "/port1.png",
      link: "https://amphora-it.com/",
    },
    {
      title: "Etsy Shop Creation & Product Design",
      category: "E-commerce & Product Design",
      description: "An Etsy shop creation and product design project focused on building an attractive storefront and presenting digital products in a professional and engaging way.",
      image: "/port2.png",
      link: "https://www.etsy.com/shop/DreamGirlPlan?ref=shop-header-name&listing_id=4389994843&from_page=listing",
    },
    {
      title: "Shopify Website Design",
      category: "E-commerce & Shopify",
      description: "A Shopify e-commerce website design project focused on creating a premium, visually engaging online shopping experience with strong branding and user-friendly navigation.",
      image: "/port3.png",
      link: "https://www.rouje.com/",
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
            We partner with ambitious brands to build premium digital products and storefronts that scale operations and accelerate growth.
          </p>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => {
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
                {/* Visual Cover (Browser Mockup Style) */}
                <div className="relative w-full aspect-[16/10] bg-white dark:bg-black p-3 pb-0 border-b border-card-border/60 flex flex-col overflow-hidden">
                  {/* Browser Bar */}
                  <div className="flex items-center gap-2 mb-2 px-1">
                    {/* Window Controls */}
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-400/85 dark:bg-red-500/60" />
                      <span className="w-2 h-2 rounded-full bg-yellow-400/85 dark:bg-yellow-500/60" />
                      <span className="w-2 h-2 rounded-full bg-green-400/85 dark:bg-green-500/60" />
                    </div>
                    {/* URL bar */}
                    <div className="flex-1 max-w-[180px] mx-auto py-0.5 px-2 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/50 text-[9px] text-muted-foreground/80 truncate text-center select-none">
                      {project.link.replace("https://", "").replace("www.", "").split("/")[0]}
                    </div>
                  </div>
                  
                  {/* Screenshot Container */}
                  <div className="relative flex-1 w-full rounded-t-xl overflow-hidden border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-slate-950">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 33vw"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      priority={idx === 0}
                    />
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

                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-[#0055ff] hover:bg-[#0044dd] text-white font-bold text-xs rounded-xl shadow-[0_2px_8px_rgba(0,85,255,0.15)] hover:shadow-[0_4px_12px_rgba(0,85,255,0.25)] transition-all duration-300 cursor-pointer"
                  >
                    <span>View Live Project</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
