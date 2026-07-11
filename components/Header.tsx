import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-black/10 dark:border-white/15">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4 sm:px-12">
        <Link
          href="/"
          className="font-[family-name:var(--font-geist-mono)] text-sm font-semibold tracking-tight"
        >
          Share<span className="text-primary">Club</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-foreground/60">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <Link href="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
          <Link href="/login" className="hover:text-foreground">
            Log in
          </Link>
        </nav>
      </div>
    </header>
  );
}
