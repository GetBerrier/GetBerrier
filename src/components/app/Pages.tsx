"use client";

import Link from "next/link";
import { useState } from "react";
import { BACKSTOP, FEES, TEMPLATES } from "@/config/protocol";
import { CHAIN, explorerAddress, shortAddress } from "@/config/brand";
import { useWallet } from "@/components/wallet/WalletProvider";
import { ConnectButton } from "@/components/wallet/WalletButton";
import { AmountField, Empty, Notice, PageHead, Panel, Row, StatStrip, Tabs } from "@/components/app/ui";
import { StockLogo } from "@/components/home/Templates";

function useBalances() {
  const { address, balance, usdg } = useWallet();
  return {
    address,
    usdgText: address ? (usdg === null ? "Reading…" : `Balance ${usdg} USDG`) : "Balance not connected",
    ethText: address ? (balance === null ? "Reading…" : `${balance} ETH`) : "Not connected",
    usdg,
    balance,
  };
}

/* ------------------------------- Portfolio ------------------------------ */

const SAMPLE = [
  { series: "Sample A · NVDA", leg: "CARRY", size: "1,000.00 USDG", coupon: "0.62% / wk", paid: "4 of 12", cushion: "21.4%", status: "Live" },
  { series: "Sample B · AAPL", leg: "CARRY", size: "2,500.00 USDG", coupon: "0.31% / wk", paid: "9 of 12", cushion: "12.8%", status: "Live" },
  { series: "Sample C · TSLA", leg: "GUARD", size: "6.00 TSLA", coupon: "0.88% / wk", paid: "2 of 12", cushion: "26.0%", status: "Live" },
];

export function PortfolioPage() {
  const { address, usdg, balance } = useBalances();
  const [sample, setSample] = useState(false);
  return (
    <>
      <PageHead eyebrow="Positions, health, cash flows and activity" title="Portfolio" />
      {!address && !sample ? (
        <Panel bodyClass="p-0">
          <Empty title="No wallet connected" body="Connect a wallet to see your note legs, Backstop shares, sBERRIER, bonds and veBERRIER lock in one view. Or look around a sample portfolio first.">
            <ConnectButton className="btn btn-metal" />
            <button type="button" onClick={() => setSample(true)} className="btn btn-ghost">
              Browse a sample portfolio
            </button>
          </Empty>
        </Panel>
      ) : (
        <>
          {sample && !address ? (
            <p className="mb-4 flex flex-wrap items-center gap-3 text-[13.5px] text-ink-2">
              <span className="chip !border-dashed">Sample data</span> Illustrative positions only, not read from any wallet.
              <button type="button" onClick={() => setSample(false)} className="text-metal hover:underline">
                Hide sample
              </button>
            </p>
          ) : null}
          <StatStrip
            stats={
              address
                ? [
                    { label: "Wallet", value: shortAddress(address, 6, 4), sub: <a className="hover:text-ink" href={explorerAddress(address)} target="_blank" rel="noreferrer">View on explorer</a> },
                    { label: "ETH on " + CHAIN.name, value: balance ?? "…", sub: "Live balance" },
                    { label: "USDG", value: usdg ?? "…", sub: "Live balance" },
                    { label: "Note legs", value: "0", sub: "Notes open at launch" },
                  ]
                : [
                    { label: "Position value", value: "9,812.40", unit: "USDG", sub: "Sample" },
                    { label: "Coupons received", value: "131.06", unit: "USDG", sub: "Sample" },
                    { label: "Lowest cushion", value: "12.8%", sub: "Sample · AAPL" },
                    { label: "Next close", value: "Mon", sub: "Sample" },
                  ]
            }
          />
          <Panel title="Note legs" className="mt-6" bodyClass="p-0">
            {address ? (
              <Empty title="No legs yet" body="Once the protocol is live, every CARRY and GUARD leg this wallet holds appears here with its coupons, cushion to the barrier and next close." />
            ) : (
              <div className="scroll-x">
                <table className="w-full min-w-[720px] text-left text-[13.5px]">
                  <thead className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                    <tr>
                      {["Series", "Leg", "Size", "Coupon", "Coupons paid", "Cushion", "Status"].map((h) => (
                        <th key={h} className="px-5 py-3.5 font-normal">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE.map((r) => (
                      <tr key={r.series} className="border-t border-white/[0.06]">
                        <td className="px-5 py-3.5">{r.series}</td>
                        <td className="px-5 py-3.5 font-mono text-[12px] text-metal">{r.leg}</td>
                        <td className="num px-5 py-3.5">{r.size}</td>
                        <td className="num px-5 py-3.5">{r.coupon}</td>
                        <td className="num px-5 py-3.5">{r.paid}</td>
                        <td className="num px-5 py-3.5">{r.cushion}</td>
                        <td className="px-5 py-3.5 text-settle">{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {[
              { t: "Backstop shares", b: "Deposits into the USDG vault." },
              { t: "Staking", b: "sBERRIER and cooldowns." },
              { t: "Bonds and lock", b: "Vesting bonds and veBERRIER." },
            ].map((c) => (
              <Panel key={c.t} title={c.t}>
                <p className="num text-[22px] text-ink-2">0</p>
                <p className="mt-2 text-[13px] text-ink-3">{c.b} Opens at launch.</p>
              </Panel>
            ))}
          </div>
        </>
      )}
    </>
  );
}

/* -------------------------------- Backstop ------------------------------- */

function Ring({ pct, label }: { pct: number; label: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 128 128" className="size-[128px] shrink-0" aria-label={`${pct}% ${label}`}>
      <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
      <circle cx="64" cy="64" r={r} fill="none" stroke="#cba86a" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${(c * pct) / 100} ${c}`} transform="rotate(-90 64 64)" />
      <text x="64" y="64" textAnchor="middle" fill="#f4f2ee" style={{ fontFamily: "var(--font-mono)", fontSize: 18 }}>
        {pct}%
      </text>
      <text x="64" y="82" textAnchor="middle" fill="#83817b" style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em" }}>
        {label}
      </text>
    </svg>
  );
}

export function BackstopPage() {
  const { usdgText, address } = useBalances();
  const [tab, setTab] = useState("Deposit");
  return (
    <>
      <PageHead eyebrow="Buyer of last resort. Capped, public, on-chain." title="Backstop" right={<span className="chip">ERC-4626 · USDG</span>} />
      <StatStrip
        stats={[
          { label: "NAV per share", value: "1.0000", unit: "USDG", sub: "Starting value by design" },
          { label: "TVL", value: "0", unit: "USDG", sub: "Vault deploys at launch" },
          { label: "Deployed", value: "0", unit: "USDG", sub: "0 series · 0% utilisation" },
          { label: "Withdrawal queue", value: "0", unit: "shares", sub: "FIFO, filled from idle USDG" },
        ]}
      />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid min-w-0 gap-6">
          <Panel title="Utilisation and caps" right="Governed, on-chain">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <Ring pct={0} label="DEPLOYED" />
              <div className="min-w-0 flex-1">
                <Row k="Total deployed cap" v={`${BACKSTOP.totalCap}% of TVL`} hint="The vault never commits more than this share of its assets to live series." />
                <Row k="Per underlying cap" v={`${BACKSTOP.perUnderlying}%`} hint="Gauge votes can tighten this per stock, never loosen it." />
                <Row k="Per series cap" v={`${BACKSTOP.perSeries}%`} />
                <Row k="Minimum hold" v={`${BACKSTOP.minHoldDays}d`} />
                <Row k="Queue processing" v="10 per pass · 50 max" />
                <Row k="Fills" v="Published rules only" />
              </div>
            </div>
          </Panel>
          <Panel title="NAV per share · 30 d" right="1.0000 → 1.0000">
            <svg viewBox="0 0 600 90" className="h-[90px] w-full" aria-hidden>
              <line x1="0" x2="600" y1="45" y2="45" stroke="#cba86a" strokeOpacity="0.6" strokeDasharray="3 5" />
            </svg>
            <p className="mt-2 flex justify-between font-mono text-[11px] text-ink-3">
              <span>30 d ago</span>
              <span>History starts at launch</span>
              <span>Today</span>
            </p>
          </Panel>
        </div>
        <Panel bodyClass="p-6">
          <Tabs items={["Deposit", "Withdraw"]} active={tab} onChange={setTab} />
          <p className="mt-5 text-[14px] leading-[1.6] text-ink-2">
            {tab === "Deposit"
              ? "Deposit USDG for Backstop shares. The vault buys CARRY legs where GUARD demand runs ahead, inside its caps and never below each template's minimum coupon."
              : "Redeem shares for USDG. Up to the idle balance settles at once after the minimum hold; the rest joins the FIFO queue."}
          </p>
          <div className="mt-5">
            <AmountField label="Amount" unit={tab === "Deposit" ? "USDG" : "Shares"} balance={usdgText} />
          </div>
          <div className="mt-4">
            <Row k="You receive" v={tab === "Deposit" ? "0.0000 shares" : "0.00 USDG"} />
            <Row k="NAV per share" v="1.0000 USDG" />
          </div>
          {address ? (
            <button type="button" disabled className="btn btn-ghost mt-5 w-full">
              Deposits open at launch
            </button>
          ) : (
            <ConnectButton className="btn btn-metal mt-5 w-full" />
          )}
        </Panel>
      </div>
      <Panel title="Deployed series" right="0 series" className="mt-6" bodyClass="p-0">
        <Empty title="Nothing deployed yet" body="Each series the Backstop fills will be listed here with its stock, amount, share of TVL and accrued coupons." />
      </Panel>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="How the Backstop deploys" right="BackstopPolicy">
          <ol className="grid gap-3 text-[14px] leading-[1.6] text-ink-2">
            <li>1. A series closes subscriptions with more GUARD than CARRY demand.</li>
            <li>2. If the discovered coupon is at or above the template&apos;s Backstop minimum, the vault takes the gap.</li>
            <li>3. Fills stop at the per-series, per-stock and total caps, whichever binds first.</li>
            <li>4. Coupons and redemptions flow back to the vault and lift NAV per share.</li>
          </ol>
        </Panel>
        <Panel title="Withdrawal queue" right="FIFO">
          <p className="font-display text-[20px]">Queue is empty</p>
          <p className="mt-2 text-[14px] leading-[1.6] text-ink-2">Requests are paid at the NAV of the moment they fill and land in a claimable balance. Open requests can be cancelled by their owner, returning the shares.</p>
        </Panel>
      </div>
      <Notice>Figures switch to live reads of the vault once it is deployed. Junior or first-loss tranches are out of scope for the first version.</Notice>
    </>
  );
}

/* --------------------------------- Stake --------------------------------- */

export function StakePage() {
  const { address } = useBalances();
  const [tab, setTab] = useState("Stake");
  return (
    <>
      <PageHead eyebrow="sBERRIER · protocol revenue streamed to stakers" title="Stake" right={<span className="chip">Cooldown 1h · then 48h window</span>} />
      <StatStrip
        stats={[
          { label: "Exchange rate", value: "1.0000", unit: "BERRIER / sBERRIER", sub: "Starts at 1, only rises" },
          { label: "APY · est.", value: "--", sub: "Needs 30 d of rewards" },
          { label: "Total staked", value: "0", unit: "BERRIER", sub: "Staking opens at launch" },
          { label: "Streaming", value: "0", unit: "BERRIER", sub: "No active stream" },
        ]}
      />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid min-w-0 gap-6">
          <Panel title="Exchange rate · 120 d" right="1.0000 → 1.0000">
            <svg viewBox="0 0 600 90" className="h-[90px] w-full" aria-hidden>
              <line x1="0" x2="600" y1="60" y2="60" stroke="#cba86a" strokeOpacity="0.6" strokeDasharray="3 5" />
            </svg>
            <p className="mt-2 text-[13px] text-ink-3">sBERRIER does not rebase. Rewards raise how much BERRIER each sBERRIER redeems for, so the rate can only go up.</p>
          </Panel>
          <Panel title="Current reward stream" right={`Epoch ${FEES.streamDays}d`}>
            <Row k="Status" v="No active stream" />
            <Row k="Starts when" v="FeeRouter forwards buybacks" />
            <Row k="Remaining" v="0 BERRIER" />
            <Row k="Source" v="Buyback auction proceeds" />
            <Row k="Cooldown" v="1h, then a 48 h unstake window" hint="Unstaking needs a cooldown first; the unstake must happen inside the window that follows." />
          </Panel>
        </div>
        <div className="grid gap-6">
          <Panel title="Your position" right={address ? shortAddress(address, 6, 4) : "Not connected"}>
            {address ? (
              <>
                <Row k="Staked" v="0 BERRIER" />
                <Row k="sBERRIER" v="0" />
                <Row k="Cooldown" v="Not started" />
              </>
            ) : (
              <div className="text-[14px] text-ink-2">
                Connect a wallet to see staked BERRIER, sBERRIER and cooldown state.
                <ConnectButton className="btn btn-metal mt-4 w-full" />
              </div>
            )}
          </Panel>
          <Panel>
            <Tabs items={["Stake", "Unstake"]} active={tab} onChange={setTab} />
            <p className="mt-5 text-[14px] leading-[1.6] text-ink-2">{tab === "Stake" ? "Stake BERRIER for sBERRIER. Buybacks stream to stakers and lift the exchange rate." : "Start a cooldown, then unstake inside the window that follows."}</p>
            <div className="mt-5">
              <AmountField label="Amount" unit={tab === "Stake" ? "BERRIER" : "sBERRIER"} balance="Token at launch" />
            </div>
            <div className="mt-4">
              <Row k="You receive" v={tab === "Stake" ? "0.0000 sBERRIER" : "0.0000 BERRIER"} />
              <Row k="Exchange rate" v="1.0000" />
            </div>
            <button type="button" disabled className="btn btn-ghost mt-5 w-full">
              Staking opens at launch
            </button>
          </Panel>
        </div>
      </div>
      <Notice>APY will be an estimate from trailing rewards and current total staked. It is never a promise.</Notice>
    </>
  );
}

/* --------------------------------- Bonds --------------------------------- */

const BOND_MARKETS = [
  { asset: "USDG", kind: "Stablecoin", vest: "7 days", note: "Paid straight into Treasury reserves." },
  { asset: "Stock Tokens", kind: "8 templates", vest: "7 days", note: "Valued at the Chainlink close." },
  { asset: "CARRY legs", kind: "Live series", vest: "7 days", note: "Valued at the treasury mark." },
];

export function BondsPage() {
  return (
    <>
      <PageHead eyebrow="Buy BERRIER at a discount, vest it linearly. The Treasury keeps what you pay." title="Bonds" />
      <StatStrip
        stats={[
          { label: "Open markets", value: "0", sub: "3 planned at launch" },
          { label: "Discount", value: "--", sub: "Set per market by governance" },
          { label: "Vesting", value: "7", unit: "days", sub: "Linear" },
          { label: "Sold to date", value: "0", unit: "BERRIER" },
        ]}
      />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Panel title="Bond markets" right="Launch design" bodyClass="p-0">
          <div className="scroll-x">
            <table className="w-full min-w-[560px] text-left text-[14px]">
              <thead className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                <tr>
                  {["Pay with", "Type", "Vesting", "Discount", ""].map((h) => (
                    <th key={h} className="px-5 py-3.5 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BOND_MARKETS.map((m) => (
                  <tr key={m.asset} className="border-t border-white/[0.06]">
                    <td className="px-5 py-4">
                      <p className="text-ink">{m.asset}</p>
                      <p className="text-[12.5px] text-ink-3">{m.note}</p>
                    </td>
                    <td className="px-5 py-4 text-ink-2">{m.kind}</td>
                    <td className="num px-5 py-4">{m.vest}</td>
                    <td className="num px-5 py-4 text-ink-3">--</td>
                    <td className="px-5 py-4 text-right">
                      <span className="chip">At launch</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title="Your bonds">
          <Empty title="Nothing vesting" body="Bonds you buy vest linearly over seven days and can be claimed as they unlock." />
        </Panel>
      </div>
      <Notice>The discount on each market is quoted against the buyback auction price and is published with the market. Proceeds go to the Treasury and back the floor.</Notice>
    </>
  );
}

/* -------------------------------- Buyback -------------------------------- */

export function BuybackPage() {
  const pts = Array.from({ length: 41 }, (_, i) => {
    const t = i / 40;
    const price = Math.max(0.28, 1 - 0.9 * t);
    return `${20 + t * 560},${20 + (1 - price) * 140}`;
  }).join(" ");
  return (
    <>
      <PageHead eyebrow="A continuous Dutch auction. Fees buy BERRIER; the Treasury sets the floor." title="Buyback" />
      <StatStrip
        stats={[
          { label: "Auction price", value: "--", unit: "USDG", sub: "Auction starts at launch" },
          { label: "Floor", value: "--", unit: "USDG", sub: "Reserves ÷ supply" },
          { label: "Fee share", value: `${FEES.toBuyback}%`, sub: "Of every protocol fee" },
          { label: "Bought to date", value: "0", unit: "BERRIER" },
        ]}
      />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Panel title="How a lot clears" right={<span className="chip !border-dashed">Illustrative</span>}>
          <svg viewBox="0 0 600 190" className="h-auto w-full" aria-label="Illustrative auction price decaying toward the floor">
            <line x1="20" x2="580" y1={20 + 0.72 * 140} y2={20 + 0.72 * 140} stroke="#e0574f" strokeOpacity="0.6" strokeDasharray="4 5" />
            <text x="580" y={14 + 0.72 * 140} textAnchor="end" fill="#e0574f" style={{ fontFamily: "var(--font-mono)", fontSize: 10.5 }}>
              FLOOR
            </text>
            <polyline points={pts} fill="none" stroke="#e3c892" strokeWidth="1.6" />
            <text x="24" y="16" fill="#a6a39c" style={{ fontFamily: "var(--font-mono)", fontSize: 10.5 }}>
              START PRICE
            </text>
            <text x="20" y="182" fill="#83817b" style={{ fontFamily: "var(--font-mono)", fontSize: 10.5 }}>
              LOT OPENS
            </text>
            <text x="580" y="182" textAnchor="end" fill="#83817b" style={{ fontFamily: "var(--font-mono)", fontSize: 10.5 }}>
              TIME
            </text>
          </svg>
          <p className="mt-3 text-[14px] leading-[1.6] text-ink-2">Each lot of fees opens above market and decays until a buyer takes it. The price stops at the floor: it can wait there, but never sell BERRIER for less than its share of reserves.</p>
        </Panel>
        <Panel title="Where it goes">
          <Row k="Fees to auction" v={`${FEES.toBuyback}%`} />
          <Row k="Fees to Treasury" v={`${FEES.toTreasury}%`} />
          <Row k="Bought BERRIER" v={`Streams to sBERRIER over ${FEES.streamDays} d`} />
          <Row k="Floor redemptions" v={`Max ${FEES.floorPerDay}% of reserves / day`} />
          <Link href="/docs/token/buyback-auction" className="link-arrow mt-5">
            Read the auction rules
          </Link>
        </Panel>
      </div>
    </>
  );
}

/* --------------------------------- Series -------------------------------- */

export function SeriesPage({ id }: { id: string }) {
  return (
    <>
      <PageHead eyebrow="Series detail" title={`Series ${id}`} right={<span className="chip">Not opened yet</span>} />
      <Panel bodyClass="p-0">
        <Empty
          title="This series does not exist yet"
          body="Series are numbered by BarrierCore as they open, one per template each trading day, starting at launch. Until then, the standing templates below show what each series will look like."
        >
          <Link href="/app" className="btn btn-ghost">
            Back to Notes
          </Link>
        </Empty>
      </Panel>
      <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-white/[0.08] bg-white/[0.06] md:grid-cols-4">
        {TEMPLATES.map((t) => (
          <div key={t.ticker} className="flex items-center gap-3 bg-g2 p-4">
            <StockLogo ticker={t.ticker} size={30} />
            <div>
              <p className="text-[14px]">{t.ticker}</p>
              <p className="font-mono text-[11px] text-ink-3">
                AC {t.autocall}% · B {t.barrier}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
