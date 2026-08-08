import { NextResponse, type NextRequest } from "next/server";
import { resolveStockQuote } from "@/lib/stock-quote";

// Thin by design (see CLAUDE.md — app/ is routing-only): real logic lives in
// lib/stock-quote.ts. Exists purely because Yahoo's endpoint sends no CORS headers — a direct
// browser fetch to Yahoo is blocked, so the actual Yahoo call has to happen server-side. Always
// responds 200 with StockQuote | null in the body — resolveStockQuote() never throws, so there's
// no separate error status to surface.
export const dynamic = "force-dynamic"; // explicit: this is "live" data, never statically cached

export async function GET(request: NextRequest, { params }: { params: { ticker: string } }) {
  const isIsraeli = request.nextUrl.searchParams.get("israeli") !== "false";
  const quote = await resolveStockQuote(params.ticker, isIsraeli);
  return NextResponse.json(quote);
}
