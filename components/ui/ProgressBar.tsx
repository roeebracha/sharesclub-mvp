export function ProgressBar({
  value,
  milestones,
  className = "",
}: {
  /** Progress ratio between 0 and 1. Values outside the range are clamped. */
  value: number;
  /** Ratios (0..1) at which to render a thin tick mark inside the track. */
  milestones?: number[];
  className?: string;
}) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const hot = pct >= 80;
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`relative h-2 w-full overflow-hidden rounded-full bg-foreground/10 ${className}`}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-500 ${
          hot ? "bg-accent-hot motion-safe:animate-pulse" : "bg-accent"
        }`}
        style={{ width: `${pct}%` }}
      />
      {milestones?.map((m) => (
        <span
          key={m}
          aria-hidden
          className="absolute top-0 h-full w-px bg-background/70"
          style={{ left: `${Math.max(0, Math.min(100, m * 100))}%` }}
        />
      ))}
    </div>
  );
}
