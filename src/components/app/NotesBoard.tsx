"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TEMPLATES } from "@/config/protocol";
import { StockLogo } from "@/components/home/Templates";
import { useCountdown } from "@/components/home/Backstop";
import { Notice, PageHead, StatStrip, Tabs } from "@/components/app/ui";
import { formatUtc } from "@/lib/calendar";
import { fmtUsd, useLive } from "@/lib/useLive";

function MarketLine() {
  const cd = useCountdown();
  if (!cd) return <span className="chip">Reading the calendar…</span>;
  return (
    <span className="chip !h-auto !whitespace-normal !py-1.5 !normal-case !tracking-normal" data-market>
      <span className={`size-1.5 shrink-0 rounded-full ${cd.open ? "bg-settle" : "bg-ink-3"}`} />
      {cd.open
        ? `Market open · official close ${formatUtc(cd.nextClose)}`
        : `Market closed · last official close ${formatUtc(cd.lastClose)} · reopens ${cd.nextOpen ? formatUtc(cd.nextOpen) : "--"}`}
    </span>
  );
}

export function NotesBoard() {
  const { data } = useLive();
  const cd = useCountdown();
  const [view, setView] = useState("By stock");
  const [q, setQ] = useState("");
  const list = useMemo(() => TEMPLATES.filter((t) => !q || t.ticker.toLowerCase().includes(q.toLowerCase()) || t.name.toLowerCase().includes(q.toLowerCase())), [q]);
  const price = (ticker: string) => data?.tape.feeds.find((f) => f.ticker === ticker)?.price ?? null;

  return (
    <>
      <PageHead eyebrow="Autocallable barrier notes on Robinhood Chain Stock Tokens" title="Notes">
        <div className="flex flex-wrap items-center gap-2">
          <MarketLine />
          <Link href="/app/desk" className="btn btn-sm btn-ghost !h-8">
            Backstop
          </Link>
        </div>
      </PageHead>

      <StatStrip
        stats={[
          { label: "Live series", value: "0", sub: "First series opens at launch" },
          { label: "Matched notional", value: "0", unit: "USDG", sub: "Read from BarrierCore once deployed" },
          { label: "Open subscriptions", value: "0", sub: "Daily from the 8 templates" },
          { label: "Next official close", value: cd ? cd.text : "--", unit: "h:m:s", sub: "US session, 16:00 New York" },
        ]}
      />

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by stock"
          aria-label="Search by stock"
          className="h-10 w-full max-w-[260px] rounded-[9px] border border-white/[0.1] bg-g1 px-3.5 text-[14.5px] text-ink outline-none placeholder:text-ink-3 focus:border-metal/60"
        />
        <Tabs items={["By stock", "Table"]} active={view} onChange={setView} />
      </div>

      {view === "By stock" ? (
        <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2 xl:grid-cols-4">
          {list.map((t) => {
            const p = price(t.ticker);
            return (
              <div key={t.ticker} className="flex flex-col bg-g2 p-5" data-template={t.ticker}>
                <div className="flex items-center gap-3">
                  <StockLogo ticker={t.ticker} size={36} />
                  <div className="min-w-0">
                    <p className="text-[15.5px] text-ink">{t.ticker}</p>
                    <p className="text-[12.5px] text-ink-3">{t.name}</p>
                  </div>
                  <span className="ml-auto chip !h-6 !text-[10px]">Template</span>
                </div>
                <p className="num mt-5 text-[22px]">{p ? `$${fmtUsd(p)}` : "--"}</p>
                <p className="font-mono text-[11px] text-ink-3">Chainlink last print</p>
                <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
                  <div>
                    <dt className="text-ink-3">Autocall</dt>
                    <dd className="num text-ink">
                      {t.autocall}% {p ? <span className="text-ink-3">· ${fmtUsd((p * t.autocall) / 100)}</span> : null}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-3">Barrier</dt>
                    <dd className="num text-ink">
                      {t.barrier}% {p ? <span className="text-ink-3">· ${fmtUsd((p * t.barrier) / 100)}</span> : null}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-3">Coupon band</dt>
                    <dd className="num text-metal">
                      {t.band[0].toFixed(2)}–{t.band[1].toFixed(2)}%/wk
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-3">Backstop min</dt>
                    <dd className="num text-ink">{t.backstopMin.toFixed(2)}%</dd>
                  </div>
                </dl>
                <button type="button" disabled className="btn btn-sm btn-ghost mt-6 w-full">
                  Subscriptions open at launch
                </button>
              </div>
            );
          })}
          {list.length === 0 ? <p className="col-span-full bg-g2 p-8 text-center text-ink-3">No template matches “{q}”.</p> : null}
        </div>
      ) : (
        <div className="scroll-x mt-6 rounded-[14px] border border-white/[0.08] bg-g2">
          <table className="w-full min-w-[760px] text-left text-[13.5px]">
            <thead className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
              <tr>
                {["Stock", "Last print", "Autocall", "Barrier", "Coupon band / wk", "Backstop min", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3.5 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((t) => {
                const p = price(t.ticker);
                return (
                  <tr key={t.ticker} className="border-t border-white/[0.06]">
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-3">
                        <StockLogo ticker={t.ticker} size={28} /> {t.ticker}
                      </span>
                    </td>
                    <td className="num px-5 py-3.5">{p ? `$${fmtUsd(p)}` : "--"}</td>
                    <td className="num px-5 py-3.5">{t.autocall}%</td>
                    <td className="num px-5 py-3.5">{t.barrier}%</td>
                    <td className="num px-5 py-3.5 text-metal">
                      {t.band[0].toFixed(2)} to {t.band[1].toFixed(2)}%
                    </td>
                    <td className="num px-5 py-3.5">{t.backstopMin.toFixed(2)}%</td>
                    <td className="px-5 py-3.5 text-ink-3">At launch</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Notice>
        Prices are live Chainlink reads on Robinhood Chain. Autocall and barrier prices are indicative, computed as if a series struck at the last print; a real series fixes them at its own strike close. Coupons are discovered per series inside the band when its subscription closes.
      </Notice>
    </>
  );
}
