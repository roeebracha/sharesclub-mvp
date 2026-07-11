import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BenefitDetail from "@/app/benefits/[id]/page";
import { benefits } from "@/lib/dummy-data";

const notFound = vi.fn(() => {
  throw new Error("notFound called");
});
vi.mock("next/navigation", () => ({ notFound: () => notFound() }));

describe("BenefitDetail", () => {
  it("renders the benefit title, terms and an inert Redeem CTA", () => {
    render(<BenefitDetail params={{ id: "b1" }} />);
    const benefit = benefits.find((b) => b.id === "b1")!;
    expect(
      screen.getByRole("heading", { name: benefit.title }),
    ).toBeInTheDocument();
    expect(screen.getByText("Terms")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Redeem" }),
    ).toBeInTheDocument();
  });

  it("calls notFound for an unknown benefit id", () => {
    expect(() =>
      render(<BenefitDetail params={{ id: "does-not-exist" }} />),
    ).toThrow();
    expect(notFound).toHaveBeenCalled();
  });
});
