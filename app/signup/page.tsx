import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function Signup() {
  return (
    <div className="min-h-screen px-6 py-16 sm:px-12 sm:py-24 max-w-md mx-auto">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
        Create your account
      </h1>
      <p className="mt-3 text-foreground/70">
        Start claiming perks for the shares you already hold.
      </p>

      <Card className="mt-8">
        <form className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-sm text-foreground/70">Name</span>
            <Input type="text" placeholder="Jane Investor" autoComplete="name" />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm text-foreground/70">Email</span>
            <Input type="email" placeholder="you@example.com" autoComplete="email" />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm text-foreground/70">Password</span>
            <Input type="password" placeholder="••••••••" autoComplete="new-password" />
          </label>
          <Button variant="primary" type="button" className="mt-2">
            Sign up
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
      <p className="mt-2 text-xs text-foreground/50">
        Auth isn&apos;t wired up yet — this form is a visual placeholder.
      </p>
    </div>
  );
}
