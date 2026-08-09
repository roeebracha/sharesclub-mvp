import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  parseGoogleNewsRss,
  resolveMarketNews,
  getMarketNews,
  resetMarketNewsCache,
} from "./market-news";

const ITEM = (title: string, pubDate = "Sat, 08 Aug 2026 21:40:00 GMT") => `
  <item>
    <title>${title}</title>
    <link>https://news.google.com/rss/articles/abc123?oc=5</link>
    <guid isPermaLink="false">abc123</guid>
    <pubDate>${pubDate}</pubDate>
  </item>
`;

function rss(items: string): string {
  return `<?xml version="1.0"?><rss><channel>${items}</channel></rss>`;
}

function mockFetchResolved(body: string, ok = true) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok, text: () => Promise.resolve(body) }));
}

beforeEach(() => resetMarketNewsCache());
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("parseGoogleNewsRss", () => {
  it("extracts title, link, and an ISO pubDate from each <item>", () => {
    const items = parseGoogleNewsRss(rss(ITEM("Tel Aviv shares rally")));
    expect(items).toHaveLength(1);
    expect(items[0]).toEqual({
      title: "Tel Aviv shares rally",
      link: "https://news.google.com/rss/articles/abc123?oc=5",
      pubDate: new Date("Sat, 08 Aug 2026 21:40:00 GMT").toISOString(),
    });
  });

  it("decodes common HTML entities in the title", () => {
    const items = parseGoogleNewsRss(rss(ITEM("Buffett&#39;s successor &amp; Berkshire&apos;s cash")));
    expect(items[0].title).toBe("Buffett's successor & Berkshire's cash");
  });

  it("caps results at 5 items even if the feed returns more", () => {
    const items = parseGoogleNewsRss(rss(Array.from({ length: 20 }, (_, i) => ITEM(`Headline ${i}`)).join("")));
    expect(items).toHaveLength(5);
  });

  it("skips a malformed item (missing a required field) without throwing", () => {
    const brokenItem = `<item><title>No link or date here</title></item>`;
    const items = parseGoogleNewsRss(rss(brokenItem + ITEM("Good headline")));
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe("Good headline");
  });

  it("returns [] for garbage/empty input, never throws", () => {
    expect(parseGoogleNewsRss("")).toEqual([]);
    expect(parseGoogleNewsRss("not xml at all")).toEqual([]);
    expect(parseGoogleNewsRss(rss(""))).toEqual([]);
  });
});

describe("resolveMarketNews", () => {
  it("fetches the israel feed URL for feed='israel'", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve(rss(ITEM("x"))) });
    vi.stubGlobal("fetch", fetchMock);
    await resolveMarketNews("israel");
    expect(fetchMock.mock.calls[0][0]).toContain("Israel");
  });

  it("fetches the global business feed URL for feed='global'", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve(rss(ITEM("x"))) });
    vi.stubGlobal("fetch", fetchMock);
    await resolveMarketNews("global");
    expect(fetchMock.mock.calls[0][0]).toContain("BUSINESS");
  });

  it("returns [] (not a throw) when the fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    await expect(resolveMarketNews("global")).resolves.toEqual([]);
  });

  it("returns [] when the response is not ok", async () => {
    mockFetchResolved(rss(ITEM("x")), false);
    expect(await resolveMarketNews("global")).toEqual([]);
  });
});

describe("getMarketNews", () => {
  it("calls our own same-origin /market-news/{feed} route, not Google directly", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    vi.stubGlobal("fetch", fetchMock);
    await getMarketNews("israel");
    expect(fetchMock).toHaveBeenCalledWith("/market-news/israel");
  });

  it("caches per feed and does not re-fetch within the TTL", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    vi.stubGlobal("fetch", fetchMock);
    await getMarketNews("global");
    await getMarketNews("global");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("resolves to [] if the route call fails, never throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("boom")));
    await expect(getMarketNews("global")).resolves.toEqual([]);
  });
});
