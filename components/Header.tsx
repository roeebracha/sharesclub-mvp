"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/login", label: "Log in" },
] as const;

export function Header() {
  const pathname = usePathname() ?? "";

  return (
    <header className="border-b border-black/10 dark:border-white/15">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4 sm:px-12">
        <Link
          href="/"
          className="font-[family-name:var(--font-geist-mono)] text-sm font-semibold tracking-tight"
        >
          Share<span className="text-primary">Club</span>
        </Link>
        <nav className="flex items-center gap-0.5 rounded-full bg-black/5 p-1 text-sm dark:bg-white/5 sm:gap-1">
          {NAV_ITEMS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-2.5 py-1.5 transition-colors sm:px-3 ${
                  active
                    ? "bg-primary text-white"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
