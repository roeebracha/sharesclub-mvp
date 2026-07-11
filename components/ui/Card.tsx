import type { HTMLAttributes } from "react";

export function Card({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-black/10 dark:border-white/15 p-5 ${className}`}
      {...props}
    />
  );
}
