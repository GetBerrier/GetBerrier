import "server-only";
import { cache } from "react";
import { CHAIN, USDG, serverRpc } from "@/config/brand";
import { ETH_USD_FEED, TEMPLATES, USDG_USD_FEED } from "@/config/protocol";

/* Server-side chain reads. One JSON-RPC batch per request, configured
   endpoint first (ROBINHOOD_RPC_URL), public endpoints after. No key needed. */

type RpcCall = { method: string; params: unknown[] };

// An endpoint that just failed sits out for a minute, so every read does not
// pay its timeout again. Some networks intercept the primary host's DNS.
const benched = new Map<string, number>();
const BENCH_MS = 60_000;

function endpoints() {
  const all = [serverRpc(), CHAIN.publicRpc, CHAIN.fallbackRpc].filter((url, i, list) => list.indexOf(url) === i);
  const now = Date.now();
  const ready = all.filter((url) => (benched.get(url) ?? 0) < now);
  return ready.length ? ready : all;
}

/** Whether a private endpoint is configured (the value itself is never exposed). */
export const hasPrivateRpc = () => Boolean(process.env.ROBINHOOD_RPC_URL);

export async function batch(calls: RpcCall[]): Promise<(unknown | null)[]> {
  if (calls.length === 0) return [];
  let lastError: unknown;
  for (const url of endpoints()) {
    try {
      const out: (unknown | null)[] = new Array(calls.length).fill(null);
      // Chunked: public endpoints reject large batches with an HTML error page.
      for (let start = 0; start < calls.length; start += 20) {
        const chunk = calls.slice(start, start + 20);
        const res = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(chunk.map((c, i) => ({ jsonrpc: "2.0", id: start + i, method: c.method, params: c.params }))),
          cache: "no-store",
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) throw new Error(`rpc ${res.status}`);
        const body = (await res.json()) as { id: number; result?: unknown }[];
        if (!Array.isArray(body)) throw new Error("rpc batch unsupported");
        for (const item of body) out[item.id] = item.result ?? null;
      }
      return out;
    } catch (error) {
      benched.set(url, Date.now() + BENCH_MS);
      lastError = error;
    }
  }
  throw lastError;
}

export const ethCall = (to: string, data: string): RpcCall => ({ method: "eth_call", params: [{ to, data }, "latest"] });

const SEL = {
  totalSupply: "0x18160ddd",
  latestRoundData: "0xfeaf968c",
  getRoundData: "0x9a6fc8f5",
};

const word = (hex: string, i: number) => hex.slice(2 + i * 64, 2 + (i + 1) * 64);
const toSigned = (w: string) => {
  const v = BigInt("0x" + w);
  return v >= 1n << 255n ? v - (1n << 256n) : v;
};

export type ChainFacts = {
  ok: boolean;
  chainId: number | null;
  block: number | null;
  blockAge: number | null;
  blockTime: number | null;
  gasPriceGwei: number | null;
  usdgSupply: number | null;
  readAt: string;
  latencyMs: number | null;
};

/** Live chain facts: latest block and its age, block time, gas price, USDG supply. */
export const readChainFacts = cache(async (): Promise<ChainFacts> => {
  const readAt = new Date().toISOString();
  const started = Date.now();
  try {
    const [idHex, latestHex, gasHex, supplyHex] = (await batch([
      { method: "eth_chainId", params: [] },
      { method: "eth_blockNumber", params: [] },
      { method: "eth_gasPrice", params: [] },
      ethCall(USDG.address, SEL.totalSupply),
    ])) as (string | null)[];
    const latencyMs = Date.now() - started;
    const latest = latestHex ? Number(BigInt(latestHex)) : null;
    let blockTime: number | null = null;
    let blockAge: number | null = null;
    if (latest) {
      const span = 2000;
      const [a, b] = (await batch([
        { method: "eth_getBlockByNumber", params: ["0x" + latest.toString(16), false] },
        { method: "eth_getBlockByNumber", params: ["0x" + (latest - span).toString(16), false] },
      ])) as ({ timestamp: string } | null)[];
      const ta = a ? Number(BigInt(a.timestamp)) : null;
      const tb = b ? Number(BigInt(b.timestamp)) : null;
      if (ta && tb && ta > tb) blockTime = (ta - tb) / span;
      if (ta) blockAge = Math.max(0, Math.round(Date.now() / 1000 - ta));
    }
    return {
      ok: latest !== null,
      chainId: idHex ? Number(BigInt(idHex)) : null,
      block: latest,
      blockAge,
      blockTime,
      gasPriceGwei: gasHex ? Number(BigInt(gasHex)) / 1e9 : null,
      usdgSupply: supplyHex && supplyHex !== "0x" ? Number(BigInt(supplyHex)) / 10 ** USDG.decimals : null,
      readAt,
      latencyMs,
    };
  } catch {
    return { ok: false, chainId: null, block: null, blockAge: null, blockTime: null, gasPriceGwei: null, usdgSupply: null, readAt, latencyMs: null };
  }
});

export type FeedReading = {
  ticker: string;
  feed: string;
  price: number | null;
  updatedAt: number | null;
  previous: number | null;
  previousAt: number | null;
  roundId: string | null;
};

/**
 * Chainlink equity feeds on Robinhood Chain: the latest round and the one
 * before it. Prices carry 8 decimals. Missing or failed reads come back null.
 */
export const readFeeds = cache(async (): Promise<{ ok: boolean; feeds: FeedReading[]; eth: number | null; usdg: number | null; readAt: string }> => {
  const readAt = new Date().toISOString();
  const list = [...TEMPLATES.map((t) => ({ ticker: t.ticker, feed: t.feed })), { ticker: "ETH", feed: ETH_USD_FEED }, { ticker: "USDG", feed: USDG_USD_FEED }];
  try {
    const latest = (await batch(list.map((f) => ethCall(f.feed, SEL.latestRoundData)))) as (string | null)[];
    const parsed = latest.map((hex) => {
      if (!hex || hex.length < 2 + 64 * 5) return null;
      return { roundId: BigInt("0x" + word(hex, 0)), answer: toSigned(word(hex, 1)), updatedAt: Number(BigInt("0x" + word(hex, 3))) };
    });
    const prevCalls = parsed.map((p, i) =>
      p ? ethCall(list[i].feed, SEL.getRoundData + (p.roundId - 1n).toString(16).padStart(64, "0")) : ethCall(list[i].feed, SEL.latestRoundData),
    );
    const prev = (await batch(prevCalls).catch(() => prevCalls.map(() => null))) as (string | null)[];
    const feeds: FeedReading[] = list.map((f, i) => {
      const p = parsed[i];
      const q = prev[i];
      const prevAnswer = p && q && q.length >= 2 + 64 * 5 ? toSigned(word(q, 1)) : null;
      const prevAt = p && q && q.length >= 2 + 64 * 5 ? Number(BigInt("0x" + word(q, 3))) : null;
      return {
        ticker: f.ticker,
        feed: f.feed,
        price: p ? Number(p.answer) / 1e8 : null,
        updatedAt: p ? p.updatedAt : null,
        previous: prevAnswer !== null && prevAnswer > 0n ? Number(prevAnswer) / 1e8 : null,
        previousAt: prevAt && prevAt > 0 ? prevAt : null,
        roundId: p ? p.roundId.toString() : null,
      };
    });
    const eth = feeds.find((f) => f.ticker === "ETH")?.price ?? null;
    const usdg = feeds.find((f) => f.ticker === "USDG")?.price ?? null;
    return { ok: feeds.some((f) => f.price !== null), feeds: feeds.filter((f) => f.ticker !== "ETH" && f.ticker !== "USDG"), eth, usdg, readAt };
  } catch {
    return { ok: false, feeds: list.slice(0, TEMPLATES.length).map((f) => ({ ...f, price: null, updatedAt: null, previous: null, previousAt: null, roundId: null })), eth: null, usdg: null, readAt };
  }
});
