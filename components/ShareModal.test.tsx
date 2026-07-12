import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ShareModal } from "@/components/ShareModal";
import { Button } from "@/components/ui/Button";

describe("ShareModal", () => {
  it("does not show the dialog before the trigger is clicked", () => {
    render(
      <ShareModal
        variant="portfolio"
        unlockedCount={2}
        totalCount={5}
        trigger={<Button variant="primary">Share your progress</Button>}
      />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the dialog and renders the portfolio ShareCard when the trigger is clicked", () => {
    render(
      <ShareModal
        variant="portfolio"
        unlockedCount={2}
        totalCount={5}
        trigger={<Button variant="primary">Share your progress</Button>}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Share your progress" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("2/5")).toBeInTheDocument();
  });

  it("renders the benefit ShareCard variant when opened", () => {
    render(
      <ShareModal
        variant="benefit"
        benefitTitle="10% off any flight"
        companyName="Aurora Airlines"
        trigger={<Button variant="secondary">Share</Button>}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Share" }));
    expect(screen.getByText("Aurora Airlines")).toBeInTheDocument();
  });
});
