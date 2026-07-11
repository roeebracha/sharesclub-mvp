import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white border border-transparent hover:opacity-90",
  secondary:
    "border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10",
  danger:
    "text-danger border border-black/10 dark:border-white/15 hover:bg-danger/10",
};

export function Button({
  variant = "secondary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={`rounded-lg px-3 py-2 text-sm transition-colors disabled:opacity-40 disabled:pointer-events-none ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
