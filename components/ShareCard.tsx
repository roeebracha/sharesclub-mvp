export type ShareCardProps =
  | { variant: "benefit"; benefitTitle: string; companyName: string }
  | { variant: "portfolio"; unlockedCount: number; totalCount: number };

export function ShareCard(props: ShareCardProps) {
  return (
    <div className="relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-glow bg-surface p-8 text-center shadow-elevated">
      {props.variant === "benefit" ? (
        <>
          <span className="text-xs font-[family-name:var(--font-geist-mono)] text-foreground/60">
            {props.companyName}
          </span>
          <span className="mt-3 text-2xl font-semibold leading-tight">
            Unlocked: {props.benefitTitle}
          </span>
        </>
      ) : (
        <>
          <span className="text-xs font-[family-name:var(--font-geist-mono)] text-foreground/60">
            My ShareClub progress
          </span>
          <span className="mt-3 text-4xl font-semibold">
            {props.unlockedCount}/{props.totalCount}
          </span>
          <span className="mt-1 text-sm text-foreground/70">benefits unlocked</span>
        </>
      )}

      <span className="absolute bottom-4 right-4 font-[family-name:var(--font-geist-mono)] text-xs font-semibold tracking-tight">
        Share<span className="text-primary">Club</span>
      </span>
    </div>
  );
}
