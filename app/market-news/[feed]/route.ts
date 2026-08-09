import { NextResponse, type NextRequest } from "next/server";
import { resolveMarketNews, type MarketNewsFeed } from "@/lib/market-news";

// Thin by design (see CLAUDE.md — app/ is routing-only): real logic lives in
// lib/market-news.ts. Exists purely because Google News RSS sends no CORS headers — a direct
// browser fetch is blocked, so the actual fetch has to happen server-side. Always responds 200
// with NewsItem[] — resolveMarketNews() never throws, so there's no separate error status.
export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: { feed: string } }) {
  const feed: MarketNewsFeed = params.feed === "israel" ? "israel" : "global";
  const items = await resolveMarketNews(feed);
  return NextResponse.json(items);
}
