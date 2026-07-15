"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-20 bg-background relative overflow-hidden border-t border-card-border/50">
      {/* Background glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[24px] border border-accent/20 bg-accent text-white py-16 px-8 md:px-16 overflow-hidden flex flex-col items-center text-center shadow-xl"
        >
          {/* Internal abstract circles */}
          <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-white/5 blur-[80px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[80px] translate-x-1/2 translate-y-1/2" />

          <h3 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight mb-4 relative z-10 max-w-2xl leading-[1.2]">
            Ready to Transform Your Digital Presence?
          </h3>
          <p className="text-white/80 text-sm max-w-lg mb-8 relative z-10 leading-relaxed">
            Partner with Mervox Dynamics to build premium software solutions, custom designs, and automated marketing funnels that accelerate your growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full sm:w-auto">
            <Link
              href="#contact"
              className="group flex items-center justify-center gap-2 px-7 py-3.5 font-semibold text-accent bg-white hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-[18px] shadow-md cursor-pointer"
            >
              Start Your Project
              <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-7 py-3.5 font-semibold text-white border border-white/20 hover:border-white/50 hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-[18px] cursor-pointer"
            >
              Chat on WhatsApp
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
