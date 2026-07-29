"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export function SplashGateway() {
  const [mounted, setMounted] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Retrieve splash entry state from localStorage
    const splashDone = localStorage.getItem("mervox_splash_done");
    if (splashDone === "true") {
      setHasEntered(true);
    } else {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleEnter = () => {
    setHasEntered(true);
    localStorage.setItem("mervox_splash_done", "true");
    document.body.style.overflow = "";
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {!hasEntered && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -100,
            transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as any }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white text-[#0f172a] px-6 overflow-hidden select-none"
        >
          {/* Faint premium background accents */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
            <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px]" />
          </div>

          <div className="max-w-xl text-center space-y-8 relative z-10 flex flex-col items-center">

            {/* Logo box with animated circling rings */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
              className="relative w-24 h-24 mb-4 transition-transform duration-300 hover:scale-105 flex items-center justify-center p-2"
            >
              {/* Outer Slow Dashed Orbiting Ring */}
              <div className="absolute -inset-3 rounded-full border border-dashed border-[#0055ff]/30 animate-spin [animation-duration:9s]" />

              {/* Inner Fast Accent Orbiting Ring */}
              <div className="absolute -inset-1 rounded-full border border-t-purple-500 border-r-transparent border-b-[#0055ff] border-l-transparent animate-spin [animation-duration:3s]" />

              {/* Radial backdrop light */}
              <div className="absolute inset-0 bg-[#0055ff]/10 blur-xl rounded-full scale-125" />

              {/* Logo Image */}
              <div className="relative w-14 h-14">
                <Image
                  src="/logo.png"
                  alt="Mervox Dynamic Logo"
                  fill
                  sizes="56px"
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            {/* Glowing Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] as any }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-slate-50/80 backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0055ff] animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold tracking-wider text-slate-500 uppercase">
                Welcome to Mervox Dynamic
              </span>
            </motion.div>

            {/* Main Title & Description */}
            <div className="space-y-4">
              {/* Staggered text entrance reveal */}
              <motion.h1
                className="text-3xl sm:text-4xl font-heading font-black tracking-wider text-slate-900 uppercase flex items-center justify-center gap-[0.12em] flex-wrap"
              >
                {Array.from("MERVOX DYNAMIC").map((char, i) => (
                  <motion.span
                    key={i}
                    animate={char === " " ? {} : {
                      scale: [1, 1.4, 1],
                    }}
                    transition={char === " " ? {} : {
                      duration: 0.8,
                      repeat: Infinity,
                      repeatDelay: 30,
                      delay: i * 0.25,
                      ease: "easeInOut",
                    }}
                    className={char === " " ? "w-2.5" : "inline-block bg-gradient-to-r from-[#0055ff] to-purple-600 bg-clip-text text-transparent"}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] as any }}
                className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium"
              >
                We design beautiful websites and mobile apps, branding, graphics, online stores, marketing, and business automation, we help turn ideas into successful digital businesses.
              </motion.p>
            </div>

            {/* Pulsing/Blinking CTA Enter Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] as any }}
              className="pt-4 w-full sm:w-auto"
            >
              <motion.button
                onClick={handleEnter}
                animate={{
                  scale: [1, 1.02, 1],
                  boxShadow: [
                    "0 4px 15px rgba(0, 85, 255, 0.25)",
                    "0 8px 30px rgba(0, 85, 255, 0.5)",
                    "0 4px 15px rgba(0, 85, 255, 0.25)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="group flex items-center justify-center gap-3 w-full sm:w-auto px-12 py-4.5 font-bold text-white bg-[#0055ff] hover:bg-[#0044dd] rounded-xl transition-all duration-300 hover:-translate-y-[2px] cursor-pointer"
              >
                <span>Enter Website</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
