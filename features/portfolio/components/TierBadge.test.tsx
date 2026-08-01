import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TierBadge } from "@/features/portfolio/components/TierBadge";
import { tiers, benefits } from "@/lib/test-utils/fixtures";

describe("TierBadge", () => {
  it("shows the current tier and progress-to-next-tier copy", () => {
    render(<TierBadge portfolioWorth={35000} tiers={tiers} />);
    expect(screen.getByText("Gold member")).toBeInTheDocument();
    expect(screen.getByText(/to Platinum/)).toBeInTheDocument();
  });

  it("marks proximity to the next tier with milestone ticks on the bar, not just a smooth fill", () => {
    const { container } = render(<TierBadge portfolioWorth={35000} tiers={tiers} />);
    const ticks = container.querySelectorAll('[role="progressbar"] span[aria-hidden]');
    expect(ticks).toHaveLength(2);
    expect((ticks[0] as HTMLElement).style.left).toBe("50%");
    expect((ticks[1] as HTMLElement).style.left).toBe("80%");
  });

  it("shows a highest-tier message with no milestones left once at Platinum", () => {
    render(<TierBadge portfolioWorth={60000} tiers={tiers} />);
    expect(screen.getByText("Platinum member")).toBeInTheDocument();
    expect(screen.getByText("Highest tier reached")).toBeInTheDocument();
  });

  it("tapping/clicking the tier pill reveals which benefits the next tier unlocks", () => {
    render(<TierBadge portfolioWorth={5000} tiers={tiers} benefits={benefits} />);
    expect(screen.queryByText("Free cloud storage upgrade")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /silver member/i }));
    expect(screen.getByText("20% off gear")).toBeInTheDocument();
    expect(screen.getByText("Free cloud storage upgrade")).toBeInTheDocument();
    expect(screen.getByText("Free personal training session")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /silver member/i }));
    expect(screen.queryByText("Free cloud storage upgrade")).not.toBeInTheDocument();
  });

  it("isn't interactive when there's no next tier (Platinum) even if benefits are passed", () => {
    render(<TierBadge portfolioWorth={60000} tiers={tiers} benefits={benefits} />);
    expect(screen.queryByRole("button", { name: /platinum member/i })).not.toBeInTheDocument();
  });
});
