import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BenefitProgressSummary } from "@/components/BenefitProgressSummary";
import type { BenefitProgress } from "@/lib/dummy-data";

function progress(overrides: Partial<BenefitProgress>): BenefitProgress {
  return {
    eligible: false,
    progressRatio: 0,
    missingPercentagePoints: 5,
    missingAmount: 500,
    ...overrides,
  };
}

describe("BenefitProgressSummary", () => {
  it("shows no urgency label below 50% progress", () => {
    render(<BenefitProgressSummary progress={progress({ progressRatio: 0.3 })} ticker="AURA" />);
    expect(screen.queryByText("Getting there")).not.toBeInTheDocument();
    expect(screen.queryByText("Almost unlocked!")).not.toBeInTheDocument();
  });

  it('shows "Getting there" between 50% and 80% progress', () => {
    render(<BenefitProgressSummary progress={progress({ progressRatio: 0.6 })} ticker="AURA" />);
    expect(screen.getByText("Getting there")).toBeInTheDocument();
  });

  it('shows "Almost unlocked!" at 80% progress or above', () => {
    render(<BenefitProgressSummary progress={progress({ progressRatio: 0.85 })} ticker="AURA" />);
    expect(screen.getByText("Almost unlocked!")).toBeInTheDocument();
  });

  it("renders the missing percentage, amount, and ticker in the copy", () => {
    render(
      <BenefitProgressSummary
        progress={progress({ progressRatio: 0.4, missingPercentagePoints: 3, missingAmount: 300 })}
        ticker="CSCO"
      />,
    );
    expect(
      screen.getByText(
        (content) =>
          content.includes("3%") && content.includes("300") && content.includes("CSCO"),
      ),
    ).toBeInTheDocument();
  });
});
