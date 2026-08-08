import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrokerGrid } from "@/features/referrals/components/BrokerGrid";
import type { Broker } from "@/features/referrals/data/broker-mappers";

const brokers: Broker[] = [
  { id: "b1", slug: "meitav", name: "Meitav Trade", logoUrl: null, referralUrl: "https://www.meitav.co.il/trade" },
  { id: "b2", slug: "ibi", name: "IBI Trade", logoUrl: null, referralUrl: "https://www.ibi.co.il/" },
];

describe("BrokerGrid", () => {
  it("renders one card per broker", () => {
    render(<BrokerGrid brokers={brokers} />);
    expect(screen.getByText("Meitav Trade")).toBeInTheDocument();
    expect(screen.getByText("IBI Trade")).toBeInTheDocument();
  });

  it("links each card to its /go/[slug] redirect route, not the raw referral URL", () => {
    render(<BrokerGrid brokers={brokers} />);
    expect(screen.getByText("Meitav Trade").closest("a")).toHaveAttribute("href", "/go/meitav");
    expect(screen.getByText("IBI Trade").closest("a")).toHaveAttribute("href", "/go/ibi");
  });

  it("opens broker links in a new tab, without leaking a window.opener reference", () => {
    render(<BrokerGrid brokers={brokers} />);
    const link = screen.getByText("Meitav Trade").closest("a");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
