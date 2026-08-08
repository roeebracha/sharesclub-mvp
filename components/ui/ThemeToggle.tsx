"use client";

import { useEffect, useState } from "react";
import { PiMoon, PiSun } from "react-icons/pi";
import { resolveTheme, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const resolved = resolveTheme(
      localStorage.getItem(THEME_STORAGE_KEY),
      window.matchMedia("(prefers-color-scheme: dark)").matches,
    );
    setTheme(resolved);
    document.documentElement.classList.toggle("dark", resolved === "dark");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem(THEME_STORAGE_KEY, next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to day mode" : "Switch to night mode"}
      className={`rounded-full p-2 text-foreground/60 transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10 ${className}`}
    >
      {theme === "dark" ? <PiSun size={18} aria-hidden /> : <PiMoon size={18} aria-hidden />}
    </button>
  );
}
