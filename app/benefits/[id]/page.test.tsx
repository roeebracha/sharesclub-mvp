import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import BenefitDetail from "@/app/benefits/[id]/page";
import { benefits, companies, tiers } from "@/lib/test-utils/fixtures";

const notFound = vi.fn(() => {
  throw new Error("notFound called");
});
vi.mock("next/navigation", () => ({ notFound: () => notFound() }));

const getBenefitById = vi.fn();
const getCompanyById = vi.fn();
const getMembershipTiers = vi.fn();

vi.mock("@/features/benefits/data/catalog-server", () => ({
  getBenefitById: (id: string) => getBenefitById(id),
  getCompanyById: (id: string) => getCompanyById(id),
  getMembershipTiers: () => getMembershipTiers(),
}));

const fakeClient = {
  auth: { getUser: vi.fn() },
};

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => Promise.resolve(fakeClient),
}));

beforeEach(() => {
  vi.clearAllMocks();
  fakeClient.auth.getUser.mockResolvedValue({ data: { user: null } });
  getMembershipTiers.mockResolvedValue(tiers);
});

function mockBenefitAndCompany(benefitId: string) {
  const benefit = benefits.find((b) => b.id === benefitId) ?? null;
  const company = benefit ? (companies.find((c) => c.id === benefit.companyId) ?? null) : null;
  getBenefitById.mockResolvedValue(benefit);
  getCompanyById.mockResolvedValue(company);
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
