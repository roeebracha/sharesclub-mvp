import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { benefitProgress, benefits, demoUser } from "@/lib/dummy-data";

// canvas-confetti touches the DOM/canvas; it's only called on click, but stub
// it so importing the page never trips over jsdom's missing canvas support.
vi.mock("canvas-confetti", () => ({ default: vi.fn() }));

describe("Home", () => {
  it("groups benefits into ready-to-claim and locked sections", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /ready to claim/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /locked \/ almost there/i }),
    ).toBeInTheDocument();

    // demoUser is eligible for the AURA and BEAN perks, not the CSCO one.
    expect(screen.getByText("10% off any flight")).toBeInTheDocument();
    expect(screen.getByText("Free drink every visit")).toBeInTheDocument();
    expect(screen.getByText("20% off gear")).toBeInTheDocument();
  });

  it("shows progress copy that matches benefitProgress for a locked benefit", () => {
    render(<Home />);
    const gear = benefits.find((b) => b.id === "b3")!;
    const p = benefitProgress(gear, demoUser.portfolioWorth, demoUser.holdings);
    const dollars = Math.round(p.missingAmount).toLocaleString();

    expect(
      screen.getByText(
        (content) =>
          content.includes(`${p.missingPercentagePoints}%`) &&
          content.includes(dollars) &&
          content.includes("CSCO"),
      ),
    ).toBeInTheDocument();
  });
});
