import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // background/foreground/primary/success/danger are RGB triples (see
        // globals.css) so opacity modifiers (bg-primary/10, text-foreground/60,
        // ...) actually generate CSS — a plain `var(--x)` hex string can't be
        // decomposed into an alpha channel, so Tailwind silently skips those
        // utilities otherwise.
        background: "rgb(var(--background-rgb) / <alpha-value>)",
        foreground: "rgb(var(--foreground-rgb) / <alpha-value>)",
        primary: "rgb(var(--primary-rgb) / <alpha-value>)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        "accent-hot": "var(--accent-hot)",
        success: "rgb(var(--success-rgb) / <alpha-value>)",
        danger: "rgb(var(--danger-rgb) / <alpha-value>)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        elevated: "var(--shadow-elevated)",
        glow: "var(--shadow-glow)",
      },
    },
  },
  plugins: [],
};
export default config;
