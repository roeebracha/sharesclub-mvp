"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Company, Holding } from "@/lib/domain/eligibility";

type Slice = {
  label: string;
  ticker: string;
  percentage: number;
  value: number;
  color: string;
};

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];
const CASH_COLOR = "var(--chart-cash)";

const CX = 120;
const CY = 120;
const R = 100;
const INNER = 62;
const GAP = 0.03; // radians of spacing between slices

function polar(radius: number, angle: number): [number, number] {
  return [CX + radius * Math.sin(angle), CY - radius * Math.cos(angle)];
}

function arcPath(a0: number, a1: number): string {
  const [x0, y0] = polar(R, a0);
  const [x1, y1] = polar(R, a1);
  const [x2, y2] = polar(INNER, a1);
  const [x3, y3] = polar(INNER, a0);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} L ${x2} ${y2} A ${INNER} ${INNER} 0 ${large} 0 ${x3} ${y3} Z`;
}

export function PortfolioDonut({
  holdings,
  companies,
  portfolioWorth,
}: {
  holdings: Holding[];
  companies: Company[];
  portfolioWorth: number;
}) {
  const [active, setActive] = useState<number | null>(null);

  const slices: Slice[] = holdings.map((h, i) => {
    const company = companies.find((c) => c.id === h.companyId);
    return {
      label: company?.name ?? "Unknown",
      ticker: company?.ticker ?? "—",
      percentage: h.percentage,
      value: (h.percentage / 100) * portfolioWorth,
      color: COLORS[i % COLORS.length],
    };
  });

  const allocated = holdings.reduce((sum, h) => sum + h.percentage, 0);
  if (allocated < 100) {
    const cashPct = 100 - allocated;
    slices.push({
      label: "Cash / unallocated",
      ticker: "CASH",
      percentage: cashPct,
      value: (cashPct / 100) * portfolioWorth,
      color: CASH_COLOR,
    });
  }

  // Precompute angles (fractions of the full circle) with a small gap per slice.
  let cursor = 0;
  const arcs = slices.map((slice) => {
    const sweep = (slice.percentage / 100) * Math.PI * 2;
    const a0 = cursor + GAP / 2;
    const a1 = cursor + sweep - GAP / 2;
    cursor += sweep;
    const mid = (a0 + a1) / 2;
    const [mx, my] = polar(6, mid); // small outward offset for hover "explode"
    return { a0, a1, ox: mx - CX, oy: my - CY };
  });

  const focused = active !== null ? slices[active] : null;

  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      <svg viewBox="0 0 240 240" className="w-full">
        {slices.map((slice, i) => (
          <motion.path
            key={slice.ticker}
            d={arcPath(arcs[i].a0, arcs[i].a1)}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 120 }}
            whileHover={{ x: arcs[i].ox, y: arcs[i].oy }}
            drag
            dragSnapToOrigin
            dragConstraints={{ left: -10, right: 10, top: -10, bottom: 10 }}
            dragElastic={0.3}
            style={{ fill: slice.color, cursor: "grab" }}
            onHoverStart={() => setActive(i)}
            onHoverEnd={() => setActive(null)}
          />
        ))}
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        {focused ? (
          <>
            <span className="text-xs font-[family-name:var(--font-geist-mono)] text-foreground/60">
              {focused.ticker}
            </span>
            <span className="text-lg font-semibold">{focused.percentage}%</span>
            <span className="text-xs text-foreground/60">
              ~${Math.round(focused.value).toLocaleString()}
            </span>
          </>
        ) : (
          <>
            <span className="text-xs font-[family-name:var(--font-geist-mono)] text-foreground/60">
              Portfolio
            </span>
            <span className="text-lg font-semibold">
              ${portfolioWorth.toLocaleString()}
            </span>
            <span className="text-xs text-foreground/60">{slices.length} slices</span>
          </>
        )}
      </div>
    </div>
  );
}
