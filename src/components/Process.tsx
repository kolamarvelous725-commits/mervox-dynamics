"use client";

import { motion } from "framer-motion";
import { Search, Compass, PenTool, Terminal, Rocket, BarChart3 } from "lucide-react";

export function Process() {
  const steps = [
    {
      num: "01",
      title: "Discovery",
      description: "We deep-dive into your business, research competitors, and define user persona requirements.",
      icon: Search,
    },
    {
      num: "02",
      title: "Strategy",
      description: "We establish site architectures, choose tech stacks, and formulate project milestones.",
      icon: Compass,
    },
    {
      num: "03",
      title: "Design",
      description: "We craft custom, modern UI/UX design mockups and iterate until they look expensive and perfect.",
      icon: PenTool,
    },
    {
      num: "04",
      title: "Development",
      description: "We write clean, high-performance TypeScript code using Next.js and Tailwind CSS.",
      icon: Terminal,
    },
    {
      num: "05",
      title: "Launch",
      description: "We run quality checks, optimize speed, and deploy your product to Vercel/production securely.",
      icon: Rocket,
    },
    {
      num: "06",
      title: "Growth",
      description: "We audit analytics, run marketing/email campaigns, and continuously refine based on data.",
      icon: BarChart3,
    },
  ];

  return (
    <section className="py-24 bg-muted/20 dark:bg-muted/5 relative border-t border-card-border/50">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-accent mb-3">
            Workflow Path
          </h2>
          <h3 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-foreground">
            Our Step-by-Step Process
          </h3>
          <div className="h-1 w-10 bg-accent/20 rounded-full mx-auto mt-4" />
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Connection Line */}
          <div className="absolute left-[20px] md:left-1/2 top-4 bottom-4 w-[1px] bg-card-border/60 -translate-x-[0.5px]" />

          <div className="space-y-12">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={step.title}
                  className="flex flex-col md:flex-row relative"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-[20px] md:left-1/2 top-6 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-[32px] h-[32px] rounded-full bg-background border border-card-border flex items-center justify-center text-[10px] font-bold text-muted-foreground shadow-sm">
                      {step.num}
                    </div>
                  </div>

                  {/* Card Content Container */}
                  <div
                    className={`w-full md:w-1/2 pl-12 md:pl-0 flex ${
                      isEven ? "md:justify-end md:pr-12" : "md:justify-start md:pl-12 md:ml-auto"
                    }`}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      className="p-6 rounded-[18px] border border-card-border bg-card/45 hover:bg-card hover:border-accent/15 transition-all duration-300 shadow-sm max-w-md w-full text-left"
                    >
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/5 text-accent flex items-center justify-center shrink-0">
                          <StepIcon className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-heading font-bold text-foreground">
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
