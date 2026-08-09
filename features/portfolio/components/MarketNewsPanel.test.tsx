import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MarketNewsPanel } from "./MarketNewsPanel";
import { resetMarketNewsCache } from "@/lib/market-news";

const ISRAEL_ITEM = {
  title: "Tel Aviv shares rally",
  link: "https://news.google.com/israel-1",
  pubDate: "2026-08-08T21:40:00.000Z",
};
const GLOBAL_ITEM = {
  title: "Global markets steady",
  link: "https://news.google.com/global-1",
  pubDate: "2026-08-08T21:00:00.000Z",
};

function mockFetch() {
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string) =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(url.includes("israel") ? [ISRAEL_ITEM] : [GLOBAL_ITEM]),
      }),
    ),
  );
}

beforeEach(() => {
  resetMarketNewsCache();
  mockFetch();
});
afterEach(() => vi.unstubAllGlobals());

describe("MarketNewsPanel", () => {
  it("shows both an Israel and a Global section", async () => {
    render(<MarketNewsPanel />);
    expect(await screen.findByText("Israel")).toBeInTheDocument();
    expect(screen.getByText("Global")).toBeInTheDocument();
  });

  it("renders each headline as a new-tab link to the real article", async () => {
    render(<MarketNewsPanel />);
    const link = await screen.findByRole("link", { name: "Tel Aviv shares rally" });
    expect(link).toHaveAttribute("href", "https://news.google.com/israel-1");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows both feeds' headlines at once", async () => {
    render(<MarketNewsPanel />);
    expect(await screen.findByText("Tel Aviv shares rally")).toBeInTheDocument();
    expect(await screen.findByText("Global markets steady")).toBeInTheDocument();
  });

  it("shows an empty-state message when a feed returns no headlines", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) }));
    render(<MarketNewsPanel />);
    expect(await screen.findAllByText("No headlines right now.")).toHaveLength(2);
  });
});
