import type { BrokerAdapter } from "./types";
import { ibiAdapter } from "./ibi";

// Every supported broker, in the order shown in the upload form's dropdown. Add a broker by
// adding an adapter file + one entry here — normalize.ts never changes.
export const BROKER_ADAPTERS: BrokerAdapter[] = [ibiAdapter];

export function getBrokerAdapter(id: string): BrokerAdapter | null {
  return BROKER_ADAPTERS.find((adapter) => adapter.id === id) ?? null;
}
