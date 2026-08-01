import type { IconType } from "react-icons";
import { PiShield, PiAirplaneTilt, PiSuitcaseRolling, PiFilmSlate, PiCpu, PiShoppingBag } from "react-icons/pi";
import type { Sector } from "@/lib/domain/eligibility";

export const SECTOR_META: Record<Sector, { label: string; Icon: IconType }> = {
  security: { label: "Security", Icon: PiShield },
  aviation: { label: "Aviation", Icon: PiAirplaneTilt },
  tourism: { label: "Tourism", Icon: PiSuitcaseRolling },
  leisure_entertainment: { label: "Leisure & Entertainment", Icon: PiFilmSlate },
  technology: { label: "Technology", Icon: PiCpu },
  retail: { label: "Retail", Icon: PiShoppingBag },
};

export const SECTOR_LABELS: Record<Sector, string> = Object.fromEntries(
  Object.entries(SECTOR_META).map(([sector, meta]) => [sector, meta.label]),
) as Record<Sector, string>;
