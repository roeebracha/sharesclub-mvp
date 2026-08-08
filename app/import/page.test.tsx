import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ImportPage from "@/app/import/page";
import { brokers } from "@/lib/test-utils/fixtures";

const getBrokers = vi.fn();

vi.mock("@/features/referrals/data/catalog-server", () => ({
  getBrokers: () => getBrokers(),
}));

describe("ImportPage", () => {
  it("shows the unlock-your-perks subtitle copy", async () => {
    getBrokers.mockResolvedValue(brokers);
    const jsx = await ImportPage();
    render(jsx);

    expect(
      screen.getByText(
        "Head to your broker, download your holdings export, then come back to unlock your perks.",
      ),
    ).toBeInTheDocument();
  });
});
