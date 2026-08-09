// Live market-news fetch+cache, mirroring lib/stock-quote.ts's two-layer style: a server-side
// resolver behind a same-origin proxy Route Handler, since Google News RSS sends no
// Access-Control-Allow-Origin header (confirmed via a direct header check, same finding as
// Yahoo Finance in SHR-007) — a direct browser fetch() would be CORS-blocked.
//
// Provider: Google News RSS (free, no API key). Its own feed copyright notice states it's "made
// available solely for... personal, non-commercial use" — an accepted-risk caveat in the same
// category as Yahoo Finance's "unofficial endpoint" risk already accepted for stock quotes; no
// free official real-time market-news API exists as an alternative.

export type NewsItem = {
  title: string;
  link: string;
  pubDate: string; // ISO string
};

export type MarketNewsFeed = "israel" | "global";

const FEED_URLS: Record<MarketNewsFeed, string> = {
  israel:
    "https://news.google.com/rss/search?q=Israel%20stock%20market%20OR%20Tel%20Aviv%20Stock%20Exchange&hl=en-US&gl=US&ceid=US:en",
  global: "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-US&gl=US&ceid=US:en",
};

const MAX_ITEMS = 5;

const ENTITY_PATTERN = /&amp;|&lt;|&gt;|&quot;|&#39;|&apos;/g;
const ENTITY_MAP: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
};

function decodeEntities(text: string): string {
  return text.replace(ENTITY_PATTERN, (match) => ENTITY_MAP[match]);
}

// Pure parser — extracts up to MAX_ITEMS <item> blocks from raw RSS XML. Never throws: returns []
// for malformed/empty input rather than a guessed placeholder — there's no sensible fallback
// headline to show.
export function parseGoogleNewsRss(xml: string): NewsItem[] {
  try {
    const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
    const items: NewsItem[] = [];

    for (const block of itemBlocks) {
      if (items.length >= MAX_ITEMS) break;

      const title = block.match(/<title>([\s\S]*?)<\/title>/)?.[1];
      const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1];
      const pubDateRaw = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1];
      if (!title || !link || !pubDateRaw) continue;

      const pubDate = new Date(pubDateRaw.trim());
      if (Number.isNaN(pubDate.getTime())) continue;

      items.push({
        title: decodeEntities(title.trim()),
        link: link.trim(),
        pubDate: pubDate.toISOString(),
      });
    }

    return items;
  } catch {
    return [];
  }
}

async function fetchFeed(feed: MarketNewsFeed): Promise<NewsItem[]> {
  try {
    const res = await fetch(FEED_URLS[feed], { cache: "no-store" });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseGoogleNewsRss(xml);
  } catch {
    return [];
  }
}

// SERVER-SIDE ONLY (called from app/market-news/[feed]/route.ts) — talks to Google News directly.
export async function resolveMarketNews(feed: MarketNewsFeed): Promise<NewsItem[]> {
  return fetchFeed(feed);
}

// News doesn't need second-by-second freshness like a stock price — a longer TTL than
// STOCK_QUOTE_CACHE_TTL_MS is deliberate, not an oversight.
const MARKET_NEWS_CACHE_TTL_MS = 15 * 60 * 1000;
type CacheEntry = { items: NewsItem[]; fetchedAt: number };
const cache = new Map<MarketNewsFeed, CacheEntry>();

// CLIENT-SIDE — used by MarketNewsPanel
export async function getMarketNews(feed: MarketNewsFeed): Promise<NewsItem[]> {
  const cached = cache.get(feed);
  if (cached && Date.now() - cached.fetchedAt < MARKET_NEWS_CACHE_TTL_MS) {
    return cached.items;
  }

  let items: NewsItem[] = [];
  try {
    const res = await fetch(`/market-news/${feed}`);
    if (res.ok) items = await res.json();
  } catch {
    items = [];
  }
  cache.set(feed, { items, fetchedAt: Date.now() });
  return items;
}

export function resetMarketNewsCache(): void {
  cache.clear();
}
