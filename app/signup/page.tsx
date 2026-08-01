"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { signUp } from "@/features/auth/data/auth";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signUp(email, password, name);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen px-6 py-16 sm:px-12 sm:py-24 max-w-md mx-auto">
      <div className="bg-glow pointer-events-none absolute inset-0 -z-10" aria-hidden />

      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
        Create your account
      </h1>
      <p className="mt-3 text-foreground/70">
        Start claiming perks for the shares you already hold.
      </p>

      <Card variant="elevated" className="mt-8">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-sm text-foreground/70">Name</span>
            <Input
              type="text"
              placeholder="Jane Investor"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm text-foreground/70">Email</span>
            <Input
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm text-foreground/70">Password</span>
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button variant="primary" type="submit" className="mt-2" disabled={loading}>
            {loading ? "Signing up…" : "Sign up"}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-sm text-foreground/60">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary underline underline-offset-4"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
