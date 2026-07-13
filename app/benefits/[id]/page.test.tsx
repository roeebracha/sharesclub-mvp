import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import BenefitDetail from "@/app/benefits/[id]/page";
import { benefits, companies } from "@/lib/fixtures";
import { createFakeQueryBuilder } from "@/lib/test-utils/fake-supabase-client";

const notFound = vi.fn(() => {
  throw new Error("notFound called");
});
vi.mock("next/navigation", () => ({ notFound: () => notFound() }));

const fakeClient = {
  from: vi.fn(),
  auth: { getUser: vi.fn() },
};

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => Promise.resolve(fakeClient),
}));

beforeEach(() => {
  vi.clearAllMocks();
  fakeClient.auth.getUser.mockResolvedValue({ data: { user: null } });
});

function mockBenefitAndCompany(benefitId: string) {
  const benefitRow = benefits.find((b) => b.id === benefitId);
  const companyRow = benefitRow ? companies.find((c) => c.id === benefitRow.companyId) : null;

  fakeClient.from.mockImplementation((table: string) => {
    if (table === "benefits") {
      return createFakeQueryBuilder({
        data: benefitRow
          ? {
              id: benefitRow.id,
              company_id: benefitRow.companyId,
              title: benefitRow.title,
              description: benefitRow.description,
              threshold_type: benefitRow.thresholdType,
              threshold_value: benefitRow.thresholdValue,
            }
          : null,
        error: null,
      });
    }
    if (table === "companies") {
      return createFakeQueryBuilder({
        data: companyRow
          ? { id: companyRow.id, name: companyRow.name, ticker: companyRow.ticker }
          : null,
        error: null,
      });
    }
    return createFakeQueryBuilder({ data: null, error: null });
  });
}

describe("BenefitDetail", () => {
  it("renders the benefit title, terms and an inert Redeem CTA", async () => {
    mockBenefitAndCompany("b1");
    const jsx = await BenefitDetail({ params: { id: "b1" } });
    render(jsx);

    const benefit = benefits.find((b) => b.id === "b1")!;
    expect(
      screen.getByRole("heading", { name: benefit.title }),
    ).toBeInTheDocument();
    expect(screen.getByText("Terms")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Redeem" }),
    ).toBeInTheDocument();
  });

  it("calls notFound for an unknown benefit id", async () => {
    mockBenefitAndCompany("does-not-exist");
    await expect(BenefitDetail({ params: { id: "does-not-exist" } })).rejects.toThrow(
      "notFound called",
    );
    expect(notFound).toHaveBeenCalled();
  });
});
