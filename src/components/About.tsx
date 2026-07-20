"use client";

import { motion } from "framer-motion";
import { Shield, Sparkles, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

export function About() {
  const values = [
    {
      icon: Shield,
      title: "Reliable Partner",
      description:
        "We prioritize transparency, timely delivery, and dependable support so you can scale with total peace of mind.",
    },
    {
      icon: Sparkles,
      title: "Creative Solutions",
      description:
        "Our custom designs and bespoke architectures ensure your brand stands out in a crowded digital landscape.",
    },
    {
      icon: Award,
      title: "Results-Driven Focus",
      description:
        "Every line of code and pixel we design is aligned directly with your strategic business goals and conversions.",
    },
  ];

  return (
    <section id="about" className="py-24 bg-background relative border-t border-card-border/50">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Vision & Stats */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-accent mb-3">
                Who We Are
              </h2>
              <h3 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-foreground leading-[1.25]">
                Introducing Mervox Dynamics
              </h3>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-xl mb-6">
                We are a creative digital studio helping businesses establish and grow a powerful, scalable online presence. Over the years, we have worked with organizations of all sizes to design and develop products that convert.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0a192f] dark:bg-[#1e3a8a] hover:bg-[#0c1e3b] dark:hover:bg-[#1d4ed8] text-white text-xs font-semibold rounded-[12px] shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-[1px]"
              >
                <span>Read More About Us</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-card-border">
              <div className="space-y-1">
                <span className="text-3xl font-heading font-extrabold text-accent">6+</span>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Years Exp
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-heading font-extrabold text-accent">180+</span>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Clients Helped
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-heading font-extrabold text-accent">99%</span>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Success Rate
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Values Cards */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="p-6 rounded-[18px] border border-card-border bg-card/20 backdrop-blur-sm flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-[12px] bg-accent/5 text-accent flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-heading font-bold text-foreground mb-1.5">
                      {value.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
