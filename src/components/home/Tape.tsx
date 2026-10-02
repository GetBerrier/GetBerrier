"use client";

import Link from "next/link";
import { TEMPLATES } from "@/config/protocol";
import { CHAIN } from "@/config/brand";
import { StockLogo } from "@/components/home/Templates";
import { Reveal } from "@/components/ui/Reveal";
import { ago, fmtUsd, useLive } from "@/lib/useLive";
import { useNowMs } from "@/lib/useNow";

function clock(ts: number | null) {
  if (!ts) return "--";
  return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(ts * 1000)) + " UTC";
}

export function Tape() {
  const { data, failed } = useLive();
  const feeds = data?.tape.feeds ?? [];
  const ms = useNowMs();
  const now = ms ? Math.floor(ms / 1000) : 0;
  const fresh = feeds.filter((f) => f.updatedAt && now - f.updatedAt < 26 * 3600).length;

  return (
    <section className="section-rule py-[var(--section)]" aria-labelledby="tape">
      <div className="wrap">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow" id="tape">
              Tape
            </p>
            <h2 className="h2 mt-7">Read at the official close.</h2>
          </div>
          <div className="text-right font-mono text-[12px] uppercase tracking-[0.08em]">
            <p className="text-ink-2">{CHAIN.name} mainnet</p>
            <p className="mt-2 normal-case tracking-normal text-ink-3">
              {failed && !data ? "Feeds unreachable right now" : data ? `Chainlink · ${fresh} of ${TEMPLATES.length} updated in 26 h` : "Reading eight feeds"}
            </p>
          </div>
        </Reveal>

        <Reveal className="panel mt-12 overflow-hidden">
          <div className="grid grid-cols-2 gap-px bg-white/[0.06] sm:grid-cols-4 lg:grid-cols-8">
            {TEMPLATES.map((t) => {
              const f = feeds.find((x) => x.ticker === t.ticker);
              const delta = f?.price && f.previous ? ((f.price - f.previous) / f.previous) * 100 : null;
              return (
                <div key={t.ticker} data-tape={t.ticker} className="flex flex-col bg-g2 p-4">
                  <div className="flex items-center gap-3">
                    <StockLogo ticker={t.ticker} size={34} />
                    <span className="text-[15px]">{t.ticker}</span>
                  </div>
                  <p className="mt-5 font-mono text-[12px] text-ink-3">Last print</p>
                  <p className="num mt-1 text-[16px]">{f?.price ? `$${fmtUsd(f.price)}` : "--"}</p>
                  <p className="font-mono text-[11px] text-ink-3">{f?.updatedAt && now ? ago(Math.max(0, now - f.updatedAt)) : "--"}</p>
                  <p className="mt-4 font-mono text-[12px] text-ink-3">Prior round</p>
                  <p className="num mt-1 text-[16px] text-ink-2">{f?.previous ? `$${fmtUsd(f.previous)}` : "--"}</p>
                  <p className="mb-4 font-mono text-[11px] text-ink-3">{clock(f?.previousAt ?? null)}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-3 font-mono text-[12px]">
                    <span className="text-ink-3">Delta</span>
                    <span className={delta === null ? "text-ink-3" : delta >= 0 ? "text-settle" : "text-breach"}>
                      {delta === null ? "--" : `${delta >= 0 ? "+" : ""}${delta.toFixed(2)}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        <p className="mt-8 max-w-[640px] text-[13px] leading-[1.6] text-ink-3">
          Live reads of the Chainlink &ldquo;Robinhood / USD&rdquo; equity feeds on {CHAIN.name} mainnet, refreshed every 30 seconds. The feeds update around the clock on weekdays; a note only ever observes the official close.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[12.5px]">
          <Link href="/docs/developers/addresses" className="border-b border-white/20 pb-0.5 text-ink-2 hover:text-ink">
            Contracts published at launch
          </Link>
          <span className="size-1 rounded-full bg-ink-3" />
          <Link href="/docs/security/audits" className="border-b border-white/20 pb-0.5 text-ink-2 hover:text-ink">
            External review before mainnet
          </Link>
          <span className="size-1 rounded-full bg-ink-3" />
          <Link href="/docs/security/bug-bounty" className="border-b border-white/20 pb-0.5 text-ink-2 hover:text-ink">
            Bug bounty
          </Link>
        </div>
      </div>
    </section>
  );
}
