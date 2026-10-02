import { NextResponse } from "next/server";
import { readChainFacts, readFeeds } from "@/lib/chain-server";

export const dynamic = "force-dynamic";

/* Chain facts and Chainlink equity feeds in one response, for pages that
   refresh live figures in the browser. Read-only; nothing here signs. */
export async function GET() {
  const [facts, tape] = await Promise.all([readChainFacts(), readFeeds()]);
  return NextResponse.json({ facts, tape }, { headers: { "cache-control": "no-store" } });
}
