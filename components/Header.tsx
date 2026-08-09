"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/features/auth/data/auth";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CurrencyToggle } from "@/components/ui/CurrencyToggle";
import { ExchangeRateTicker } from "@/components/ui/ExchangeRateTicker";

export function Header() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (pathname === "/login" || pathname === "/signup") return null;

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/benefits", label: "Benefits" },
    ...(loggedIn
      ? [
          { href: "/dashboard", label: "Dashboard" } as const,
          { href: "/import", label: "Import" } as const,
          { href: "/tiers", label: "Tiers" } as const,
        ]
      : []),
  ];

  return (
    <header className="border-b border-black/10 dark:border-white/15">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-4 sm:flex-nowrap sm:px-12">
        <Link
          href="/"
          className="whitespace-nowrap font-[family-name:var(--font-geist-mono)] text-lg font-bold tracking-tight sm:text-xl"
        >
          Shares<span className="text-primary">Club</span>
        </Link>
        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-0.5 rounded-full bg-black/5 p-1 text-sm dark:bg-white/5 sm:gap-1">
            {navItems.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`whitespace-nowrap rounded-full px-2.5 py-1.5 transition-colors sm:px-3 ${
                    active
                      ? "bg-primary text-white"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            {loggedIn ? (
              <button
                onClick={handleLogout}
                className="whitespace-nowrap rounded-full px-2.5 py-1.5 text-foreground/60 transition-colors hover:text-foreground sm:px-3"
              >
                Log out
              </button>
            ) : (
              <Link
                href="/login"
                className={`whitespace-nowrap rounded-full px-2.5 py-1.5 transition-colors sm:px-3 ${
                  pathname === "/login"
                    ? "bg-primary text-white"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                Log in
              </Link>
            )}
          </nav>
          <ExchangeRateTicker />
          <ThemeToggle />
          <CurrencyToggle />
        </div>
      </div>
    </header>
  );
}
