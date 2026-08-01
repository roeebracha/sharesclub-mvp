import type { Company } from "@/lib/domain/eligibility";
import type { SecurityEntity } from "./entities";
import type { BrokerAdapter, NormalizeResult, RawRow } from "./types";

function toNumber(value: string | undefined): number | undefined {
  if (value === undefined || value === "") return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

function extractEntity(adapter: BrokerAdapter, row: RawRow): SecurityEntity {
  const get = (column?: string) => (column ? row[column] : undefined);
  return {
    name: get(adapter.columns.name) ?? "",
    ticker: get(adapter.columns.ticker) || undefined,
    securityNumber: get(adapter.columns.securityNumber) || undefined,
    quantity: toNumber(get(adapter.columns.quantity)),
    price: toNumber(get(adapter.columns.price)),
    marketValue: toNumber(get(adapter.columns.marketValue)),
    precomputedPercentage: toNumber(get(adapter.columns.precomputedPercentage)),
    securityType: get(adapter.columns.securityType) || undefined,
    currency: get(adapter.columns.currency) || undefined,
  };
}

// Best-effort only — a miss just means no benefit badge for this row, never a broken row (see
// "Portfolio import" in DECISIONS.md: a company match is enrichment, never a requirement).
function matchCompany(entity: SecurityEntity, ticker: string | null, companies: Company[]): string | null {
  if (ticker) {
    const byTicker = companies.find((c) => c.ticker.toUpperCase() === ticker.toUpperCase());
    if (byTicker) return byTicker.id;
  }
  const byName = companies.find(
    (c) => entity.name.includes(c.name) || c.name.includes(entity.name),
  );
  return byName?.id ?? null;
}

// The generic engine: knows nothing about any specific broker — every broker-specific behavior
// comes from `adapter`. See "Portfolio import" in architecture/DECISIONS.md for the full design.
export function normalize(
  adapter: BrokerAdapter,
  rawRows: RawRow[],
  companies: Company[],
): NormalizeResult {
  const entities = rawRows.map((row) => extractEntity(adapter, row));
  const totalValue = entities.reduce((sum, e) => sum + (e.marketValue ?? 0), 0);

  const holdings: NormalizeResult["holdings"] = [];
  const skipped: NormalizeResult["skipped"] = [];

  entities.forEach((entity, i) => {
    if (!entity.name) {
      skipped.push({ row: rawRows[i], reason: "missing security name" });
      return;
    }

    const percentage =
      entity.precomputedPercentage ??
      (totalValue > 0 && entity.marketValue !== undefined
        ? (entity.marketValue / totalValue) * 100
        : undefined);
    if (percentage === undefined) {
      skipped.push({ row: rawRows[i], reason: "no value or percentage found" });
      return;
    }

    const ticker = adapter.extractTicker(entity);
    holdings.push({
      rawName: entity.name,
      ticker,
      isIsraeli: adapter.isIsraeli(entity),
      companyId: matchCompany(entity, ticker, companies),
      percentage,
    });
  });

  return { holdings, totalValue, skipped };
}
