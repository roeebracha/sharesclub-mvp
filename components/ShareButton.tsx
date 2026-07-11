"use client";

// Visual-only share affordance. Hovering reveals a bar of social platform chips.
// No real sharing happens in this pass — publishing a portfolio is a deferred v2
// decision (privacy). See architecture/BRAND.md and DECISIONS.md.

const SOCIALS: { name: string; color: string; glyph: string }[] = [
  { name: "Twitter", color: "#1DA1F2", glyph: "t" },
  { name: "Instagram", color: "#E1306C", glyph: "○" },
  { name: "Facebook", color: "#1877F2", glyph: "f" },
  { name: "WhatsApp", color: "#25D366", glyph: "✆" },
  { name: "LinkedIn", color: "#0A66C2", glyph: "in" },
];

export function ShareButton() {
  return (
    <div className="group relative inline-flex items-center">
      <button
        type="button"
        className="rounded-lg border border-black/10 dark:border-white/15 px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
      >
        Share
      </button>

      <div
        className="pointer-events-none absolute left-full top-1/2 z-10 ml-2 flex -translate-y-1/2 items-center gap-2 rounded-full border border-black/10 bg-background px-2 py-1.5 opacity-0 shadow-sm transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100 dark:border-white/15"
        role="menu"
        aria-label="Share to social media"
      >
        {SOCIALS.map((s) => (
          <span
            key={s.name}
            aria-label={s.name}
            title={s.name}
            className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: s.color }}
          >
            {s.glyph}
          </span>
        ))}
      </div>
    </div>
  );
}
