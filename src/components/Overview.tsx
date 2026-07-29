"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Layout,
  Laptop,
  Layers,
  Palette,
  Smartphone,
  ShoppingBag,
  Megaphone,
  ShieldCheck,
  FileText,
  GraduationCap,
  ArrowRight
} from "lucide-react";

export function Overview() {
  const cards = [
    {
      title: "Web Design",
      desc: "We design beautiful websites that help your business make a great first impression.",
      icon: Layout,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "Web Development",
      desc: "We build fast, secure, and professional websites that work on every device.",
      icon: Laptop,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      title: "UI/UX Design",
      desc: "We design websites and apps that are simple, attractive, and easy for people to use.",
      icon: Layers,
      color: "text-purple-500 bg-purple-500/10",
    },
    {
      title: "Graphic Design",
      desc: "We create logos, flyers, social media designs, brochures, and other visuals that help your brand stand out.",
      icon: Palette,
      color: "text-pink-500 bg-pink-500/10",
    },
    {
      title: "Mobile App Development",
      desc: "We build mobile applications that help businesses connect with customers and simplify everyday tasks.",
      icon: Smartphone,
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      title: "E-commerce Solutions",
      desc: "We create online stores where customers can browse products and buy from you anytime.",
      icon: ShoppingBag,
      color: "text-cyan-500 bg-cyan-500/10",
    },
    {
      title: "Digital Marketing",
      desc: "We help your business reach more people through online advertising and marketing.",
      icon: Megaphone,
      color: "text-indigo-500 bg-indigo-500/10",
    },
    {
      title: "Brand Identity",
      desc: "We help businesses create a professional image people can trust and remember.",
      icon: ShieldCheck,
      color: "text-rose-500 bg-rose-500/10",
    },
    {
      title: "Business Brochure Design",
      desc: "We design professional brochures, company profiles, and business documents that showcase your business.",
      icon: FileText,
      color: "text-teal-500 bg-teal-500/10",
    },
    {
      title: "Mervox Academy",
      desc: "Learn practical digital skills through Mervox Academy and build a successful career or business.",
      icon: GraduationCap,
      color: "text-violet-500 bg-violet-500/10",
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
    <section id="overview" className="py-24 bg-background relative border-t border-card-border/50">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Main Grid: Left sticky text, Right service cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column (Sticky Title & Description) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-card-border bg-card/45 backdrop-blur-md w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                What We Do
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-foreground leading-[1.15]">
              Helping Businesses Grow Through Smart Digital Solutions
            </h2>
            
            <div className="h-1 w-10 bg-accent/20 rounded-full my-4" />
            
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                Whether you're starting a new business, growing an existing one, or looking to improve your online presence, Mervox Dynamics provides the tools, designs, and technology you need to succeed.
              </p>
              <p>
                From beautiful websites and mobile apps to branding, graphics, online stores, marketing, and business automation, we help turn ideas into successful digital businesses.
              </p>
            </div>
          </div>

          {/* Right Column (Cards Grid) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {cards.map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <motion.div
                  key={idx}
                  variants={cardVariants}
                  whileHover={{ y: -4 }}
                  className="group p-6 rounded-2xl border border-card-border bg-card/45 hover:bg-card hover:border-accent/15 transition-all duration-300 flex flex-col items-start text-left shadow-xs hover:shadow-md"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-heading font-extrabold text-foreground mb-2 group-hover:text-accent transition-colors duration-200">
                    {card.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    {card.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

        </div>

        {/* Bottom Full-Width Highlight Section */}
        <div className="mt-24 pt-16 border-t border-card-border/40">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h3 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-foreground">
              Everything Your Business Needs In One Place
            </h3>
            
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Instead of working with different companies for your website, branding, marketing, graphics, online store, or mobile app, Mervox Dynamics brings everything together under one trusted team—saving you time, ensuring consistency, and helping your business grow with confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-6">
              <Link
                href="#services"
                className="group flex items-center justify-center gap-3 px-7 py-3.5 font-semibold text-white bg-[#0a192f] dark:bg-[#1e3a8a] hover:bg-[#0c1e3b] dark:hover:bg-[#1d4ed8] rounded-[14px] shadow-[0_2px_8px_rgba(10,25,47,0.15)] dark:shadow-[0_2px_8px_rgba(30,58,138,0.18)] hover:shadow-[0_4px_15px_rgba(10,25,47,0.25)] dark:hover:shadow-[0_4px_15px_rgba(30,58,138,0.3)] transition-all duration-300 hover:-translate-y-[2px]"
              >
                <span>Explore Our Services</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              
              <Link
                href="#contact"
                className="group flex items-center justify-center gap-3 px-7 py-3.5 font-semibold text-foreground border border-card-border bg-card hover:bg-white dark:hover:bg-slate-900 rounded-[14px] shadow-xs transition-all duration-300 hover:-translate-y-[2px]"
              >
                <span>Book a Free Call</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
