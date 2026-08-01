import { getBrokers } from "@/features/referrals/data/catalog-server";
import { BrokerGrid } from "@/features/referrals/components/BrokerGrid";
import { ImportForm } from "@/features/portfolio-import/components/ImportForm";

export default async function ImportPage() {
  const brokers = await getBrokers();

  return (
    <div className="min-h-screen px-6 py-16 sm:px-12 sm:py-24 max-w-3xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Connect your portfolio
        </h1>
        <p className="mt-3 text-foreground/70">
          Head to your broker, download your holdings export, then come back here to import it.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-sm font-medium text-foreground/60 mb-4 uppercase tracking-wide">
          Your broker
        </h2>
        <BrokerGrid brokers={brokers} />
      </section>

      <section>
        <h2 className="text-sm font-medium text-foreground/60 mb-4 uppercase tracking-wide">
          Upload your holdings
        </h2>
        <ImportForm />
      </section>
    </div>
  );
}
