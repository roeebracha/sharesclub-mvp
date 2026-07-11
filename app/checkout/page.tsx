import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function Checkout() {
  return (
    <div className="min-h-screen px-6 py-16 sm:px-12 sm:py-24 max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Checkout
        </h1>
        <Badge variant="accent">v2 preview</Badge>
      </div>
      <p className="mt-3 text-foreground/70">
        A look at where platform-processed purchases will live.
      </p>

      <Card className="mt-8">
        <h2 className="text-sm font-medium text-foreground/60 uppercase tracking-wide">
          Order summary
        </h2>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-foreground/70">ShareClub membership</span>
          <span className="font-[family-name:var(--font-geist-mono)]">$0.00</span>
        </div>
      </Card>

      <Card className="mt-6">
        <form className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-sm text-foreground/70">Cardholder name</span>
            <Input type="text" placeholder="Jane Investor" />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm text-foreground/70">Card number</span>
            <Input type="text" inputMode="numeric" placeholder="4242 4242 4242 4242" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-1.5">
              <span className="text-sm text-foreground/70">Expiry</span>
              <Input type="text" placeholder="MM / YY" />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm text-foreground/70">CVC</span>
              <Input type="text" inputMode="numeric" placeholder="123" />
            </label>
          </div>
          <Button variant="primary" type="button" disabled className="mt-2">
            Pay
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-xs text-foreground/50">
        Payments aren&apos;t processed — this page is a non-functional visual
        scaffold for v2. Don&apos;t enter real card details.
      </p>
    </div>
  );
}
