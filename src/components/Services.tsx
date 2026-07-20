"use client";

import { motion } from "framer-motion";
import {
  MonitorSmartphone,
  ShoppingCart,
  PenTool,
  Send,
  MessageSquareHeart,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export function Services() {
  const services = [
    {
      icon: MonitorSmartphone,
      title: "Web Design & Development",
      description: "Modern, responsive websites built to convert and scale.",
      link: "#",
    },
    {
      icon: ShoppingCart,
      title: "E-Commerce Development",
      description: "High-performing online stores that drive sales.",
      link: "#",
    },
    {
      icon: PenTool,
      title: "Branding & Identity",
      description: "Build a brand your audience remembers and trusts.",
      link: "#",
    },
    {
      icon: Send,
      title: "Digital Marketing",
      description: "Strategic marketing that brings traffic and generates leads.",
      link: "#",
    },
    {
      icon: MessageSquareHeart,
      title: "Social Media Management",
      description: "Grow your brand and engage your audience consistently.",
      link: "#",
    },
    {
      icon: TrendingUp,
      title: "SEO & Performance Optimization",
      description: "Rank higher and load faster for better results.",
      link: "#",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
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
    <section id="services" className="py-24 bg-background relative border-y border-card-border">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-3">
              WHAT WE DO
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-foreground">
              Services That Solve Real Business Problems
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              We combine creativity, technology and strategy to deliver digital solutions that help your business grow.
            </p>
            <a
              href="#services"
              className="inline-flex items-center text-xs font-bold text-accent hover:text-accent-hover transition-colors gap-1 group/btn"
            >
              View All Services{" "}
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
        >
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                className="p-6 rounded-[16px] border border-card-border bg-card/50 hover:bg-card hover:border-accent/10 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col items-start text-left relative overflow-hidden group"
              >
                {/* Subtle Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-accent/5 text-accent flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300 shrink-0">
                  <IconComponent className="w-5 h-5 stroke-[1.75]" />
                </div>

                <h4 className="text-sm font-heading font-bold text-foreground mb-3 group-hover:text-accent transition-colors duration-300">
                  {service.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6 flex-grow">
                  {service.description}
                </p>
                <a
                  href={service.link}
                  className="inline-flex items-center text-xs font-bold text-accent group-hover:text-accent-hover transition-colors duration-300 gap-1 mt-auto"
                >
                  Learn more{" "}
                  <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

