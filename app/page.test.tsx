import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { benefitProgress } from "@/lib/eligibility";
import { benefits, companies, demoUser } from "@/lib/fixtures";

// canvas-confetti touches the DOM/canvas; it's only called on click, but stub
// it so importing the page never trips over jsdom's missing canvas support.
vi.mock("canvas-confetti", () => ({ default: vi.fn() }));

vi.mock("@/lib/catalog-data", () => ({
  getCompanies: vi.fn(() => Promise.resolve(companies)),
  getBenefits: vi.fn(() => Promise.resolve(benefits)),
}));

vi.mock("@/lib/holdings-data", () => ({
  getHoldings: vi.fn(() => Promise.resolve(demoUser.holdings)),
  getPortfolioWorth: vi.fn(() => Promise.resolve(demoUser.portfolioWorth)),
}));

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(() =>
    Promise.resolve({ id: "u1", email: "jane@example.com", name: "Jane" }),
  ),
}));

describe("Home", () => {
  it("shows a welcome greeting with the current user's name", async () => {
    render(<Home />);
    expect(await screen.findByText("Welcome to ShareClub, Jane")).toBeInTheDocument();
  });

  it("groups benefits into ready-to-claim and locked sections", async () => {
    render(<Home />);
    expect(
      await screen.findByRole("heading", { name: /ready to claim/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /locked \/ almost there/i }),
    ).toBeInTheDocument();

    // demoUser is eligible for the AURA and BEAN perks, not the CSCO one.
    expect(await screen.findByText("10% off any flight")).toBeInTheDocument();
    expect(screen.getByText("Free drink every visit")).toBeInTheDocument();
    expect(screen.getByText("20% off gear")).toBeInTheDocument();
  });

  it("shows progress copy that matches benefitProgress for a locked benefit", async () => {
    render(<Home />);
    const gear = benefits.find((b) => b.id === "b3")!;
    const p = benefitProgress(gear, demoUser.portfolioWorth, demoUser.holdings);
    const dollars = Math.round(p.missingAmount).toLocaleString();

    expect(
      await screen.findByText(
        (content) =>
          content.includes(`${p.missingPercentagePoints}%`) &&
          content.includes(dollars) &&
          content.includes("CSCO"),
      ),
    ).toBeInTheDocument();
  });
});
