"use client";

import { useEffect, useState } from "react";
import type { ChainFacts, FeedReading } from "@/lib/chain-server";

export type LiveData = {
  facts: ChainFacts;
  tape: { ok: boolean; feeds: FeedReading[]; eth: number | null; usdg: number | null; readAt: string };
};

const listeners = new Set<(d: LiveData | null, failed: boolean) => void>();
let last: LiveData | null = null;
let failed = false;
let timer: number | null = null;

async function load() {
  try {
    const res = await fetch("/api/live", { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    last = (await res.json()) as LiveData;
    failed = false;
  } catch {
    failed = true;
  }
  for (const l of listeners) l(last, failed);
}

/** Shared poller for /api/live: one request every 30 s however many readers. */
export function useLive() {
  const [state, setState] = useState<{ data: LiveData | null; failed: boolean }>({ data: last, failed });
  useEffect(() => {
    const listener = (d: LiveData | null, f: boolean) => setState({ data: d, failed: f });
    listeners.add(listener);
    if (listeners.size === 1) {
      void load();
      timer = window.setInterval(load, 30_000);
    }
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0 && timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };
  }, []);
  return state;
}

export function fmtUsd(v: number | null | undefined, digits = 2) {
  if (v === null || v === undefined || !Number.isFinite(v)) return "--";
  return v.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function ago(seconds: number) {
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
