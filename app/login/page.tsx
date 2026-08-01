"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { signIn } from "@/features/auth/data/auth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-6 py-16 sm:px-12 sm:py-24 max-w-md mx-auto">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
        Log in
      </h1>
      <p className="mt-3 text-foreground/70">
        Welcome back. Pick up where you left off.
      </p>

      <Card className="mt-8">
        <form onSubmit={handleSubmit} className="grid gap-4">
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button variant="primary" type="submit" className="mt-2" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-sm text-foreground/60">
        No account yet?{" "}
        <Link
          href="/signup"
          className="text-primary underline underline-offset-4"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
