"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/features/auth/data/auth";

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
    ...(loggedIn ? [{ href: "/dashboard", label: "Dashboard" } as const] : []),
  ];

  return (
    <header className="border-b border-black/10 dark:border-white/15">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4 sm:px-12">
        <Link
          href="/"
          className="font-[family-name:var(--font-geist-mono)] text-lg font-bold tracking-tight sm:text-xl"
        >
          Shares<span className="text-primary">Club</span>
        </Link>
        <nav className="flex items-center gap-0.5 rounded-full bg-black/5 p-1 text-sm dark:bg-white/5 sm:gap-1">
          {navItems.map(({ href, label }) => {
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
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="rounded-full px-2.5 py-1.5 text-foreground/60 transition-colors hover:text-foreground sm:px-3"
            >
              Log out
            </button>
          ) : (
            <Link
              href="/login"
              className={`rounded-full px-2.5 py-1.5 transition-colors sm:px-3 ${
                pathname === "/login"
                  ? "bg-primary text-white"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
