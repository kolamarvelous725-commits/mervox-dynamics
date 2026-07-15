"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[64px] h-[30px] rounded-full bg-muted/20 animate-pulse" />;
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="w-[64px] h-[30px] rounded-full border border-card-border bg-card/45 backdrop-blur-md flex items-center justify-between p-[3px] cursor-pointer relative focus:outline-none select-none overflow-hidden hover:scale-105 active:scale-95 transition-transform duration-200"
      aria-label="Toggle theme"
    >
      {/* Sliding Active Indicator */}
      <motion.div
        animate={{ x: currentTheme === "dark" ? 0 : 34 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="w-6 h-6 rounded-full bg-foreground shadow-sm absolute"
      />

      {/* Moon Icon */}
      <Moon
        className={`z-10 w-[14px] h-[14px] pointer-events-none transition-colors duration-300 ml-1.5 ${
          currentTheme === "dark" ? "text-background" : "text-muted-foreground"
        }`}
      />

      {/* Sun Icon */}
      <Sun
        className={`z-10 w-[14px] h-[14px] pointer-events-none transition-colors duration-300 mr-1.5 ${
          currentTheme === "light" ? "text-background" : "text-muted-foreground"
        }`}
      />
    </button>
  );
}
