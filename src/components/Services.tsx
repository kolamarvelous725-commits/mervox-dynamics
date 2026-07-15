"use client";

import { motion } from "framer-motion";
import {
  Layout,
  Code2,
  ShoppingBag,
  TrendingUp,
  Mail,
  Sparkles,
  Palette,
  Megaphone,
} from "lucide-react";

export function Services() {
  const services = [
    {
      icon: Layout,
      title: "Web Design",
      description:
        "High-end bespoke UI/UX designs that captivate visitors and establish immediate digital authority.",
    },
    {
      icon: Code2,
      title: "Web Development",
      description:
        "Clean, optimized Next.js and React applications built for ultimate speed, security, and scalability.",
    },
    {
      icon: ShoppingBag,
      title: "Store Creation",
      description:
        "Premium e-commerce store setups designed to maximize conversion rates and simplify checkout paths.",
    },
    {
      icon: TrendingUp,
      title: "Digital Marketing",
      description:
        "Strategic campaigns that increase search visibility, drive quality traffic, and multiply revenue.",
    },
    {
      icon: Mail,
      title: "Email Marketing",
      description:
        "Automated retention workflows and newsletter campaigns that build lifetime customer value.",
    },
    {
      icon: Sparkles,
      title: "Brand Identity",
      description:
        "Consistent and memorable logo design, guidelines, typography, and visual styling for your business.",
    },
    {
      icon: Palette,
      title: "Graphic Design",
      description:
        "Sophisticated vector graphics, marketing materials, and digital assets that represent your brand.",
    },
    {
      icon: Megaphone,
      title: "Social Media Ads",
      description:
        "Data-driven paid advertising campaigns across key networks to acquire customers profitably.",
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
    <section id="services" className="py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-accent mb-3">
            Core Expertise
          </h2>
          <h3 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-foreground">
            Services We Provide to Scale Your Business
          </h3>
          <div className="h-1 w-10 bg-accent/20 rounded-full mx-auto mt-4" />
        </div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                whileHover={{ y: -5, scale: 1.01 }}
                className="p-8 rounded-[18px] border border-card-border bg-card/40 hover:bg-card hover:border-accent/20 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col items-start text-left relative overflow-hidden group"
              >
                {/* Subtle Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Icon Container */}
                <div className="w-12 h-12 rounded-[14px] bg-accent/5 text-accent flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300 shrink-0">
                  <IconComponent className="w-5 h-5 stroke-[1.75]" />
                </div>

                <h4 className="text-base font-heading font-bold text-foreground mb-3 group-hover:text-accent transition-colors duration-300">
                  {service.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
