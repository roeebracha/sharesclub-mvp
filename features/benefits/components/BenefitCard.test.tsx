import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BenefitCard } from "@/features/benefits/components/BenefitCard";
import type { Benefit, Company } from "@/lib/domain/eligibility";

const company: Company = { id: "c1", name: "Aurora Airlines", ticker: "AURA", sector: "aviation" };
const benefit: Benefit = {
  id: "b1",
  companyId: "c1",
  title: "10% off any flight",
  description: "Redeem a one-time discount code.",
  minTierId: "t-silver",
};

describe("BenefitCard", () => {
  it("shows the Eligible badge when eligible", () => {
    render(<BenefitCard benefit={benefit} company={company} eligible />);
    expect(screen.getByText("Eligible")).toBeInTheDocument();
    expect(screen.getByText("10% off any flight")).toBeInTheDocument();
  });

  it("hides the badge when not eligible", () => {
    render(<BenefitCard benefit={benefit} company={company} eligible={false} />);
    expect(screen.queryByText("Eligible")).not.toBeInTheDocument();
  });
});
