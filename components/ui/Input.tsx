import type { InputHTMLAttributes } from "react";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`rounded-lg border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${className}`}
      {...props}
    />
  );
}
