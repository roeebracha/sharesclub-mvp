import { NextResponse, type NextRequest } from "next/server";
import { getBrokerBySlug, recordReferralClick } from "@/features/referrals/data/catalog-server";

// Thin by design (see CLAUDE.md — app/ is routing-only): all real logic lives
// in features/referrals/data/catalog-server.ts. A logging failure must not
// block the redirect, so it's caught here rather than left to propagate.
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) {
    return NextResponse.redirect(new URL("/import", request.url));
  }

  try {
    await recordReferralClick(broker.id);
  } catch (err) {
    console.error(`Failed to log referral click for broker "${broker.slug}"`, err);
  }

  return NextResponse.redirect(broker.referralUrl);
}
