"use client";

import { useEffect, useState } from "react";
import { useNowMs } from "@/lib/useNow";
import { CHAIN, CONTRACTS, USDG, explorerAddress, shortAddress } from "@/config/brand";
import { BACKSTOP, FEES, GOVERNANCE, TEMPLATES } from "@/config/protocol";
import { ArrowUpRight } from "@/components/icons";
import { StockLogo } from "@/components/home/Templates";
import { marketState } from "@/lib/calendar";
import { ago, fmtUsd, useLive } from "@/lib/useLive";

const TABS = ["Overview", "Notes", "Backstop", "Credit", "Bonds", "BERRIER", "Governance", "Omnichain", "Oracle"] as const;
type Tab = (typeof TABS)[number];

type Metric = { k: string; v: React.ReactNode; note?: string; tag?: "LIVE" | "DESIGN" | "LAUNCH" | "EST." };

function Tag({ t }: { t: Metric["tag"] }) {
  if (!t) return null;
  const cls = t === "LIVE" ? "border-settle/40 text-settle" : t === "EST." ? "border-metal/40 text-metal" : "border-white/[0.12] text-ink-3";
  return <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] ${cls}`}>{t}</span>;
}

function Metrics({ title, rows }: { title: string; rows: Metric[] }) {
  return (
    <section>
      <h2 className="font-display text-[28px]">{title}</h2>
      <span aria-hidden className="mt-3 block h-px w-6 bg-metal" />
      <dl className="mt-6">
        {rows.map((r) => (
          <div key={r.k} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-white/[0.06] py-3.5">
            <dt className="flex items-center gap-2 text-[15px] text-ink-2">
              {r.k} <Tag t={r.tag} />
            </dt>
            <dd className="text-right">
              <span className="num text-[14px] text-ink">{r.v}</span>
              {r.note ? <span className="block text-[12px] text-ink-3">{r.note}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const pending = (k: string, note = "Read from contracts after launch"): Metric => ({ k, v: "--", note, tag: "LAUNCH" });

export function AnalyticsView() {
  const { data, failed } = useLive();
  const [tab, setTab] = useState<Tab>("Overview");
  const ms = useNowMs();
  const now = ms === null ? null : new Date(ms);
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.replace("#", "");
      const match = TABS.find((x) => x.toLowerCase() === h.toLowerCase());
      if (match) setTab(match);
    };
    // Deferred so the first paint matches the server render.
    const t = window.setTimeout(fromHash, 0);
    window.addEventListener("hashchange", fromHash);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", fromHash);
    };
  }, []);
  const select = (t: Tab) => {
    setTab(t);
    history.replaceState(null, "", `#${t.toLowerCase()}`);
  };

  const f = data?.facts;
  const feeds = data?.tape.feeds ?? [];
  const nowS = now ? Math.floor(now.getTime() / 1000) : 0;
  const fresh = feeds.filter((x) => x.updatedAt && nowS - x.updatedAt < 86400).length;
  const market = now ? marketState(now) : null;

  const strip: { k: string; v: React.ReactNode }[] = [
    { k: "Network", v: <span className="flex items-center gap-2"><span className={`size-1.5 rounded-full ${f?.ok ? "bg-settle" : "bg-ink-3"}`} />{CHAIN.name}</span> },
    { k: "Chain id", v: f?.chainId ?? "--" },
    { k: "Block", v: f?.block ? `${f.block.toLocaleString("en-US")} · ${f.blockAge ?? 0}s old` : failed ? "unreachable" : "reading…" },
    { k: "Refreshed", v: f ? new Date(f.readAt).toUTCString().replace("GMT", "UTC") : "--" },
    { k: "Contracts", v: <span className="chip !h-6 !text-[10.5px]">At launch</span> },
    { k: "Feeds fresh (24h)", v: data ? `${fresh} / ${TEMPLATES.length}` : "--" },
  ];

  const tabs: Record<Tab, Metric[]> = {
    Overview: [
      { k: "Latest block", v: f?.block?.toLocaleString("en-US") ?? "--", tag: "LIVE" },
      { k: "Average block time", v: f?.blockTime ? `${f.blockTime.toFixed(3)} s` : "--", note: "Over the last 2,000 blocks", tag: "LIVE" },
      { k: "Gas price", v: f?.gasPriceGwei !== null && f?.gasPriceGwei !== undefined ? `${f.gasPriceGwei.toFixed(4)} gwei` : "--", tag: "LIVE" },
      { k: "USDG in circulation", v: f?.usdgSupply ? `${fmtUsd(f.usdgSupply, 0)} USDG` : "--", note: shortAddress(USDG.address, 6, 4), tag: "LIVE" },
      { k: "ETH / USD", v: data?.tape.eth ? `$${fmtUsd(data.tape.eth)}` : "--", note: "Chainlink", tag: "LIVE" },
      { k: "RPC latency", v: f?.latencyMs ? `${f.latencyMs} ms` : "--", note: "Server to chain", tag: "LIVE" },
      pending("Protocol TVL"),
      pending("Matched notional"),
      pending("Coupons paid to date"),
    ],
    Notes: [
      { k: "Standing templates", v: TEMPLATES.length, tag: "DESIGN" },
      { k: "Closes per series", v: 13, tag: "DESIGN" },
      pending("Series opened"),
      pending("Live series"),
      pending("Autocalled"),
      pending("Matured with cash"),
      pending("Matured with stock delivery"),
    ],
    Backstop: [
      { k: "Total deployed cap", v: `${BACKSTOP.totalCap}%`, tag: "DESIGN" },
      { k: "Per underlying cap", v: `${BACKSTOP.perUnderlying}%`, tag: "DESIGN" },
      { k: "Per series cap", v: `${BACKSTOP.perSeries}%`, tag: "DESIGN" },
      pending("TVL"),
      pending("NAV per share"),
      pending("Queue"),
    ],
    Credit: [{ k: "LLTV", v: "40%", tag: "DESIGN" }, pending("Markets"), pending("Supplied"), pending("Borrowed"), pending("Utilisation", "EST. from supplied and borrowed")],
    Bonds: [{ k: "Vesting", v: "7 days", tag: "DESIGN" }, pending("Open markets"), pending("BERRIER sold"), pending("Proceeds to Treasury")],
    BERRIER: [
      { k: "Fee on coupons", v: `${FEES.couponShare}%`, tag: "DESIGN" },
      { k: "Fee on notional", v: `${FEES.notional.toFixed(2)}%`, tag: "DESIGN" },
      { k: "Split to buyback / Treasury", v: `${FEES.toBuyback} / ${FEES.toTreasury}`, tag: "DESIGN" },
      { k: "Floor redemptions", v: `≤ ${FEES.floorPerDay}% of reserves a day`, tag: "DESIGN" },
      pending("Supply"),
      pending("Floor price", "EST. reserves ÷ supply"),
      pending("Bought back"),
    ],
    Governance: [
      { k: "Max lock", v: `${GOVERNANCE.maxLockYears} years`, tag: "DESIGN" },
      { k: "Proposal threshold", v: `${GOVERNANCE.threshold}% veBERRIER`, tag: "DESIGN" },
      { k: "Weekly emission at start", v: `${GOVERNANCE.initialWeekly.toLocaleString("en-US")} BERRIER`, tag: "DESIGN" },
      pending("veBERRIER supply"),
      pending("Proposals"),
    ],
    Omnichain: [{ k: "Required verifiers", v: "2 of 2", tag: "DESIGN" }, pending("Legs away"), pending("Moves"), pending("Median delivery")],
    Oracle: [],
  };

  return (
    <>
      <div className="mt-14">
        <div className="ticks" />
        <dl className="grid grid-cols-2 border-b border-white/[0.06] md:grid-cols-3 xl:grid-cols-6">
          {strip.map((s) => (
            <div key={s.k} className="border-t border-white/[0.06] py-5 pr-4">
              <dt className="label !text-[11px]">{s.k}</dt>
              <dd className="mt-2.5 font-mono text-[13px] text-ink">{s.v}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] py-5">
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="label !text-[11px]">Market</p>
              <p className="mt-2.5">
                <span className="chip">
                  <span className={`size-1.5 rounded-full ${market?.open ? "bg-settle" : "bg-ink-3"}`} />
                  {market ? (market.open ? "Open" : "Closed") : "--"}
                </span>
              </p>
            </div>
            <div>
              <p className="label !text-[11px]">History</p>
              <p className="mt-3 font-mono text-[13px] text-ink-2">Starts with the first deployment</p>
            </div>
          </div>
          <div>
            <p className="label !text-[11px]">Reads</p>
            <p className="mt-2 flex gap-2">
              <span className="chip !border-metal/50 !text-ink">Live</span>
              <span className="chip">Every 30 s</span>
            </p>
          </div>
        </div>
      </div>

      <div role="tablist" className="scroll-x mt-10 flex gap-1 border-b border-white/[0.08]">
        {TABS.map((t) => (
          <button key={t} role="tab" type="button" aria-selected={tab === t} onClick={() => select(t)} className={`relative whitespace-nowrap px-4 py-3 text-[14.5px] ${tab === t ? "text-ink after:absolute after:inset-x-2 after:-bottom-px after:h-px after:bg-metal" : "text-ink-3 hover:text-ink-2"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {tab === "Oracle" ? (
          <section>
            <h2 className="font-display text-[28px]">Oracle</h2>
            <span aria-hidden className="mt-3 block h-px w-6 bg-metal" />
            <div className="scroll-x mt-6 rounded-[14px] border border-white/[0.08] bg-g2">
              <table className="w-full min-w-[760px] text-left text-[13.5px]">
                <thead className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                  <tr>
                    {["Feed", "Answer", "Updated", "Heartbeat", "Deviation", "Proxy"].map((h) => (
                      <th key={h} className="px-5 py-3.5 font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TEMPLATES.map((t) => {
                    const r = feeds.find((x) => x.ticker === t.ticker);
                    return (
                      <tr key={t.ticker} className="border-t border-white/[0.06]">
                        <td className="px-5 py-3">
                          <span className="flex items-center gap-3">
                            <StockLogo ticker={t.ticker} size={26} /> {t.ticker} / USD
                          </span>
                        </td>
                        <td className="num px-5 py-3">{r?.price ? `$${fmtUsd(r.price)}` : "--"}</td>
                        <td className="num px-5 py-3 text-ink-2">{r?.updatedAt && now ? ago(Math.max(0, nowS - r.updatedAt)) : "--"}</td>
                        <td className="num px-5 py-3 text-ink-2">24 h</td>
                        <td className="num px-5 py-3 text-ink-2">0.5%</td>
                        <td className="px-5 py-3">
                          <a href={explorerAddress(t.feed)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-[12px] text-ink-2 hover:text-metal">
                            {shortAddress(t.feed, 6, 4)} <ArrowUpRight className="size-3" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[13px] text-ink-3">Chainlink equity feeds on {CHAIN.name} mainnet, 8 decimals, read live through this site&apos;s RPC relay.</p>
          </section>
        ) : (
          <Metrics title={tab} rows={tabs[tab]} />
        )}
        {tab === "Overview" ? (
          <section className="mt-14">
            <h2 className="font-display text-[28px]">Protocol contracts</h2>
            <span aria-hidden className="mt-3 block h-px w-6 bg-metal" />
            <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
              {CONTRACTS.map((c) => (
                <div key={c.name} className="bg-g2 p-4">
                  <p className="text-[14.5px] text-ink">{c.name}</p>
                  <p className="text-[12.5px] text-ink-3">{c.role}</p>
                  <p className="mt-2 font-mono text-[11.5px] text-ink-3">{c.address ? shortAddress(c.address) : "Published at launch"}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
