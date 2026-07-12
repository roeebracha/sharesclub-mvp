import type { HTMLAttributes } from "react";

export type CardVariant = "flat" | "elevated";

const variantClasses: Record<CardVariant, string> = {
  flat: "",
  elevated: "bg-surface shadow-soft hover:shadow-elevated transition-shadow",
};

export function Card({
  variant = "flat",
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & { variant?: CardVariant }) {
  return (
    <div
      className={`rounded-xl border border-black/10 dark:border-white/15 p-5 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
