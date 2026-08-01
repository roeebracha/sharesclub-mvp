import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createFakeSupabaseClient,
  createFakeQueryBuilder,
} from "@/lib/test-utils/fake-supabase-client";
import { companies } from "@/lib/test-utils/fixtures";
import type { RawRow } from "@/features/portfolio-import/parsers/types";

const fakeClient = createFakeSupabaseClient();

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => Promise.resolve(fakeClient),
}));

vi.mock("@/features/benefits/data/catalog-server", () => ({
  getCompanies: () => Promise.resolve(companies),
}));

// parseFile touches real file bytes (exceljs) — mocked here so this test exercises
// import-server.ts's own orchestration; parse-file.ts and normalize.ts have their own tests.
const parseFileMock = vi.fn();
vi.mock("@/features/portfolio-import/parsers/parse-file", () => ({
  parseFile: (...args: unknown[]) => parseFileMock(...args),
}));

import { importPortfolio } from "./import-server";

const USER_ID = "u1";

const amdRow: RawRow = {
  "שם נייר": "ADV MICRO(AMD)",
  "מספר נייר": "102202",
  סימבול: "",
  "סוג נייר": "מניה זרה בחו״ל",
  מטבע: "דולר אמריקאי               001",
  "כמות נוכחית": "8",
  שער: "485.39",
  "שווי נוכחי": "11932.83",
  "אחוז אחזקה": "5.55",
};

function uploadForm(brokerId: string, file: File | null) {
  const formData = new FormData();
  formData.set("brokerId", brokerId);
  if (file) formData.set("file", file);
  return formData;
}

beforeEach(() => {
  vi.clearAllMocks();
  fakeClient.auth.getUser.mockResolvedValue({ data: { user: { id: USER_ID } } });
  parseFileMock.mockResolvedValue([amdRow]);
});

describe("importPortfolio", () => {
  it("rejects when no broker is selected", async () => {
    const file = new File(["x"], "data.xlsx");
    await expect(importPortfolio(uploadForm("", file))).rejects.toThrow("Pick a broker.");
  });

  it("rejects an unknown broker id", async () => {
    const file = new File(["x"], "data.xlsx");
    await expect(importPortfolio(uploadForm("not-a-real-broker", file))).rejects.toThrow(
      'Unknown broker "not-a-real-broker".',
    );
  });

  it("rejects when no file is attached", async () => {
    await expect(importPortfolio(uploadForm("ibi", null))).rejects.toThrow(
      "Choose a file to upload.",
    );
  });

  it("rejects when signed out", async () => {
    fakeClient.auth.getUser.mockResolvedValue({ data: { user: null } });
    const file = new File(["x"], "data.xlsx");
    await expect(importPortfolio(uploadForm("ibi", file))).rejects.toThrow("Not signed in.");
  });

  it("deletes existing holdings, inserts the normalized set, and updates portfolio_worth", async () => {
    const holdingsBuilder = createFakeQueryBuilder({ data: null, error: null });
    const usersBuilder = createFakeQueryBuilder({ data: null, error: null });
    fakeClient.from.mockImplementation((table: string) =>
      table === "users" ? usersBuilder : holdingsBuilder,
    );

    const file = new File(["x"], "data.xlsx");
    const result = await importPortfolio(uploadForm("ibi", file));

    expect(fakeClient.from).toHaveBeenCalledWith("holdings");
    expect(holdingsBuilder.delete).toHaveBeenCalled();
    expect(holdingsBuilder.eq).toHaveBeenCalledWith("user_id", USER_ID);
    expect(holdingsBuilder.insert).toHaveBeenCalledWith([
      {
        user_id: USER_ID,
        company_id: null,
        raw_name: "ADV MICRO(AMD)",
        ticker: "AMD",
        is_israeli: false,
        percentage: 5.55,
      },
    ]);
    expect(usersBuilder.update).toHaveBeenCalledWith({ portfolio_worth: 11932.83 });
    expect(result).toEqual({ saved: 1, skipped: 0, skippedReasons: [] });
  });

  it("reports skipped rows without failing the whole upload", async () => {
    const blankRow: RawRow = { ...amdRow, "שם נייר": "" };
    parseFileMock.mockResolvedValue([amdRow, blankRow]);
    fakeClient.from.mockReturnValue(createFakeQueryBuilder({ data: null, error: null }));

    const file = new File(["x"], "data.xlsx");
    const result = await importPortfolio(uploadForm("ibi", file));

    expect(result.saved).toBe(1);
    expect(result.skipped).toBe(1);
    expect(result.skippedReasons).toEqual(["missing security name"]);
  });
});
