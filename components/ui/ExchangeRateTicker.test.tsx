import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ExchangeRateTicker } from "./ExchangeRateTicker";
import * as fxRate from "@/lib/fx-rate";

beforeEach(() => {
  // shouldAdvanceTime keeps Testing Library's real-time-based findBy*/waitFor
  // polling working, while still letting advanceTimersByTimeAsync fast-forward
  // the refresh interval below.
  vi.useFakeTimers({ shouldAdvanceTime: true });
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("ExchangeRateTicker", () => {
  it("shows the ILS value of one USD and one EUR, not the raw ILS-per-foreign-unit rate", async () => {
    vi.spyOn(fxRate, "getFxRates").mockResolvedValue({ usdPerIls: 0.27, eurPerIls: 0.25 });
    render(<ExchangeRateTicker />);
    // 1 / 0.27 ≈ 3.70, 1 / 0.25 = 4.00
    expect(await screen.findByText("$1 = ₪3.70")).toBeInTheDocument();
    expect(await screen.findByText("€1 = ₪4.00")).toBeInTheDocument();
  });

  it("re-checks the rate on an interval while mounted (getFxRates' own cache decides if that's a real network hit)", async () => {
    const getFxRates = vi.spyOn(fxRate, "getFxRates").mockResolvedValue({
      usdPerIls: 0.27,
      eurPerIls: 0.25,
    });
    render(<ExchangeRateTicker />);
    await screen.findByText("$1 = ₪3.70");
    expect(getFxRates).toHaveBeenCalledTimes(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5 * 60 * 1000 + 1000);
    });
    expect(getFxRates).toHaveBeenCalledTimes(2);
  });
});
