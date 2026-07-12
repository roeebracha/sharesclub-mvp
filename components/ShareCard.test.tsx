import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ShareCard } from "@/components/ShareCard";

describe("ShareCard", () => {
  it("renders the benefit title and company name for the benefit variant", () => {
    render(<ShareCard variant="benefit" benefitTitle="10% off any flight" companyName="Aurora Airlines" />);
    expect(screen.getByText("Aurora Airlines")).toBeInTheDocument();
    expect(screen.getByText(/10% off any flight/)).toBeInTheDocument();
  });

  it("renders the unlocked/total count for the portfolio variant", () => {
    render(<ShareCard variant="portfolio" unlockedCount={3} totalCount={8} />);
    expect(screen.getByText("3/8")).toBeInTheDocument();
  });

  it("never renders a dollar amount, for either variant", () => {
    const { container: benefitContainer } = render(
      <ShareCard variant="benefit" benefitTitle="10% off any flight" companyName="Aurora Airlines" />,
    );
    expect(benefitContainer.textContent).not.toContain("$");

    const { container: portfolioContainer } = render(
      <ShareCard variant="portfolio" unlockedCount={3} totalCount={8} />,
    );
    expect(portfolioContainer.textContent).not.toContain("$");
  });
});
