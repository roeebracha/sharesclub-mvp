import type { ReactNode } from "react";

export type BadgeVariant = "success" | "muted" | "accent";

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-success/10 text-success",
  muted: "bg-foreground/10 text-foreground/60",
  accent: "bg-primary/10 text-primary",
};

export function Badge({
  variant = "muted",
  className = "",
  children,
}: {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
