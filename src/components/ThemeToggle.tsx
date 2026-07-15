"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-full bg-muted/20 animate-pulse" />;
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full border border-card-border bg-card/45 hover:bg-card/80 text-foreground hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md cursor-pointer focus:outline-none flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {currentTheme === "dark" ? (
        <Sun className="w-[18px] h-[18px] text-yellow-400 transition-transform duration-300" />
      ) : (
        <Moon className="w-[18px] h-[18px] text-slate-700 transition-transform duration-300" />
      )}
    </button>
  );
}
