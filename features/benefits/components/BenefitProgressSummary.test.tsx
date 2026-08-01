import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BenefitProgressSummary } from "@/features/benefits/components/BenefitProgressSummary";
import type { BenefitProgress } from "@/lib/domain/eligibility";

function progress(overrides: Partial<BenefitProgress>): BenefitProgress {
  return {
    eligible: false,
    requiredTierName: "Gold",
    progressRatio: 0,
    amountToRequiredTier: 5000,
    ...overrides,
  };
}

describe("BenefitProgressSummary", () => {
  it("shows no urgency label below 50% progress", () => {
    render(<BenefitProgressSummary progress={progress({ progressRatio: 0.3 })} />);
    expect(screen.queryByText("Getting there")).not.toBeInTheDocument();
    expect(screen.queryByText("Almost unlocked!")).not.toBeInTheDocument();
  });

  it('shows "Getting there" between 50% and 80% progress', () => {
    render(<BenefitProgressSummary progress={progress({ progressRatio: 0.6 })} />);
    expect(screen.getByText("Getting there")).toBeInTheDocument();
  });

  it('shows "Almost unlocked!" at 80% progress or above', () => {
    render(<BenefitProgressSummary progress={progress({ progressRatio: 0.85 })} />);
    expect(screen.getByText("Almost unlocked!")).toBeInTheDocument();
  });

  it("renders the required tier name and remaining amount in the copy", () => {
    render(
      <BenefitProgressSummary
        progress={progress({ progressRatio: 0.4, requiredTierName: "Platinum", amountToRequiredTier: 3000 })}
      />,
    );
    // Testing Library's getByText matcher only sees a node's *direct* text-node
    // children (not nested elements) via its `content` argument — the tier name is
    // rendered inside a nested <span> for styling, so `content` alone never
    // contains both "Platinum" and "3,000". Checking `element.textContent`
    // (recursive) inside the matcher instead is the documented workaround for
    // text split across multiple elements.
    expect(
      screen.getByText(
        (_content, element) =>
          !!element?.textContent?.includes("Platinum") &&
          !!element?.textContent?.includes("3,000"),
        { selector: "p" },
      ),
    ).toBeInTheDocument();
  });
});
