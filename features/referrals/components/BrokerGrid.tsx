import type { Broker } from "@/features/referrals/data/broker-mappers";
import { Card } from "@/components/ui/Card";

export function BrokerGrid({ brokers }: { brokers: Broker[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {brokers.map((broker) => (
        <a key={broker.id} href={`/go/${broker.slug}`}>
          <Card className="flex h-full items-center justify-center p-4 text-center transition-colors hover:bg-black/5 dark:hover:bg-white/10">
            <span className="text-sm font-medium">{broker.name}</span>
          </Card>
        </a>
      ))}
    </div>
  );
}
