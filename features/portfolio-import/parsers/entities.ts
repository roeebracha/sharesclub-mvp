// The canonical, broker-agnostic shape every adapter extracts a raw row into.
// normalize.ts only ever reads these fields — never a raw column name — so
// adding a broker is a new adapter (a mapping into this shape), never a
// change to normalize.ts itself.

export type SecurityEntity = {
  name: string;
  ticker?: string;
  securityNumber?: string;
  quantity?: number;
  price?: number;
  marketValue?: number;
  precomputedPercentage?: number;
  securityType?: string;
  currency?: string;
};
