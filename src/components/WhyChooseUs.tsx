"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Cpu,
  Search,
  Monitor,
  Zap,
  LifeBuoy,
} from "lucide-react";

export function WhyChooseUs() {
  const items = [
    {
      icon: Calendar,
      title: "6+ Years Experience",
      description:
        "Years of refined practice delivering clean, modern digital products across various industries.",
    },
    {
      icon: Cpu,
      title: "Modern Technology",
      description:
        "Building with cutting-edge frameworks like Next.js, React, Tailwind, and Framer Motion for premium experiences.",
    },
    {
      icon: Search,
      title: "SEO Optimized",
      description:
        "Engineered with clean semantic markup, fast loading times, and SEO best practices to ensure high rank.",
    },
    {
      icon: Monitor,
      title: "Responsive Design",
      description:
        "Optimized layouts crafted meticulously for desktop, tablet, and mobile screens to look stunning everywhere.",
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description:
        "Efficient agile processes ensure rapid, reliable delivery times without ever compromising visual or code quality.",
    },
    {
      icon: LifeBuoy,
      title: "Long-term Support",
      description:
        "We stand by our clients post-launch, offering comprehensive maintenance, support, and consulting.",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
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
    <section className="py-24 bg-muted/20 dark:bg-muted/5 relative border-t border-card-border/50">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-accent mb-3">
            Why Partner With Us
          </h2>
          <h3 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-foreground">
            Our Key Brand Pillars
          </h3>
          <div className="h-1 w-10 bg-accent/20 rounded-full mx-auto mt-4" />
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={cardVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                className="p-8 rounded-[18px] border border-card-border bg-card/45 hover:bg-card hover:border-accent/15 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col gap-4 text-left relative overflow-hidden group"
              >
                {/* Micro Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="w-10 h-10 rounded-[12px] bg-accent/5 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
