"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useNowMs } from "@/lib/useNow";
import { GOVERNANCE, BACKSTOP, TEMPLATES } from "@/config/protocol";
import { useWallet } from "@/components/wallet/WalletProvider";
import { ConnectButton } from "@/components/wallet/WalletButton";
import { AmountField, Empty, LinkTabs, Notice, PageHead, Panel, Row, StatStrip } from "@/components/app/ui";

const TABS = [
  { href: "/app/governance", label: "Overview" },
  { href: "/app/governance/lock", label: "Lock" },
  { href: "/app/governance/proposals", label: "Proposals" },
  { href: "/app/governance/gauges", label: "Gauges" },
];

const WEEK = 7 * 86400;

/** Next Thursday 00:00 UTC, the weekly epoch boundary. */
function nextEpoch(now: number) {
  // Unix epoch 0 was a Thursday, so week boundaries are multiples of WEEK.
  return (Math.floor(now / WEEK) + 1) * WEEK;
}

function useNow() {
  const ms = useNowMs();
  return ms === null ? null : Math.floor(ms / 1000);
}

function GovHead({ eyebrow, title, active, right }: { eyebrow: string; title: string; active: string; right?: React.ReactNode }) {
  return (
    <>
      <PageHead eyebrow={eyebrow} title={title} right={right} />
      <div className="-mt-2 mb-8">
        <LinkTabs items={TABS} active={active} />
      </div>
    </>
  );
}

export function GovernanceOverview() {
  return (
    <>
      <GovHead eyebrow="veBERRIER · two governors · two timelocks" title="Governance" active="/app/governance" />
      <StatStrip
        stats={[
          { label: "veBERRIER supply", value: "0", sub: "Locks open at launch" },
          { label: "Proposal threshold", value: `${GOVERNANCE.threshold}%`, sub: "of veBERRIER" },
          { label: "Open proposals", value: "0" },
          { label: "Max lock", value: `${GOVERNANCE.maxLockYears}`, unit: "years", sub: "Min 1 week" },
        ]}
      />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[
          { name: "BerrierGovernor", what: "Parameters: templates, caps, fees, gauges", steps: [["Voting delay", "1 day"], ["Voting period", "5 days"], ["Timelock", "48 hours"], ["End to end", "about 8 days"]] },
          { name: "UpgradeGovernor", what: "Contract upgrades and recovery", steps: [["Voting delay", "1 day"], ["Voting period", "7 days"], ["Timelock", "7 days"], ["End to end", "about 15 days"]] },
        ].map((g) => (
          <Panel key={g.name} title={g.name} right="Launch design">
            <p className="text-[14.5px] text-ink-2">{g.what}</p>
            <div className="mt-4">
              {g.steps.map(([k, v]) => (
                <Row key={k} k={k} v={v} />
              ))}
            </div>
          </Panel>
        ))}
      </div>
      <Panel title="Lifecycle" className="mt-6">
        <ol className="flex flex-wrap items-center gap-2 font-mono text-[12px] uppercase tracking-[0.08em]">
          {["Pending", "Active", "Succeeded", "Queued", "Executed"].map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span className="chip">{s}</span>
              {i < 4 ? <span className="text-ink-3">→</span> : null}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-[14px] leading-[1.6] text-ink-2">A proposal that fails quorum or loses the vote is Defeated. Anything queued can be inspected for the full timelock before it runs.</p>
      </Panel>
    </>
  );
}

export function LockPage() {
  const { address } = useWallet();
  const [weeks, setWeeks] = useState(104);
  const now = useNow();
  const unlock = now ? Math.floor((now + weeks * WEEK) / WEEK) * WEEK : null;
  const maxW = GOVERNANCE.maxLockYears * 52;
  const weightNow = unlock && now ? Math.max(0, (unlock - now) / (maxW * WEEK)) : weeks / maxW;
  const pts = useMemo(() => {
    const out: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = (i / 40) * weeks;
      const w = Math.max(0, (weeks - t) / maxW);
      out.push(`${20 + (i / 40) * 560},${170 - w * 150}`);
    }
    return out.join(" ");
  }, [weeks, maxW]);
  const presets = [
    { l: "1 m", w: 4 },
    { l: "6 m", w: 26 },
    { l: "1 y", w: 52 },
    { l: "2 y", w: 104 },
    { l: "4 y", w: 208 },
  ];
  return (
    <>
      <GovHead eyebrow="veBERRIER · lock BERRIER or sBERRIER for voting weight" title="Lock" active="/app/governance/lock" right={<span className="chip">Max 4 y · min 1 week</span>} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Panel title="Voting weight over time" right="weight = amount × time left ÷ 4 y">
          <svg viewBox="0 0 600 200" className="h-auto w-full" aria-label="Voting weight per BERRIER decaying to zero at unlock">
            {[0, 0.25, 0.5, 0.75, 1].map((v) => (
              <g key={v}>
                <line x1="20" x2="580" y1={170 - v * 150} y2={170 - v * 150} stroke="rgba(255,255,255,0.06)" />
                <text x="2" y={174 - v * 150} fill="#83817b" style={{ fontFamily: "var(--font-mono)", fontSize: 9 }}>
                  {v.toFixed(2)}
                </text>
              </g>
            ))}
            <polyline points={pts} fill="none" stroke="#e3c892" strokeWidth="1.8" />
            <text x="20" y="194" fill="#83817b" style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>
              NOW
            </text>
            <text x="580" y="194" textAnchor="end" fill="#83817b" style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>
              UNLOCK
            </text>
          </svg>
          <p className="mt-3 text-[14px] leading-[1.6] text-ink-2">
            Shown per 1 BERRIER. A four-year lock starts at 1 veBERRIER per token and halves after two years. Unlocks round down to a Thursday 00:00 UTC boundary. Weight cannot be transferred or delegated in the first version.
          </p>
        </Panel>
        <div className="grid gap-6">
          <Panel title="Your lock" right={address ? "Connected" : "Not connected"}>
            {address ? <Row k="Locked" v="0 BERRIER" /> : (
              <div className="text-[14px] text-ink-2">
                Connect a wallet to see and manage your lock.
                <ConnectButton className="btn btn-metal mt-4 w-full" />
              </div>
            )}
          </Panel>
          <Panel>
            <AmountField label="Amount" unit="BERRIER" balance="Token at launch" />
            <p className="label mt-5">Lock for</p>
            <p className="mt-2 text-[14px] text-ink">
              {weeks} weeks{unlock ? ` · unlock ${new Date(unlock * 1000).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" })}` : ""}
            </p>
            <input type="range" min={1} max={maxW} value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} aria-label="Lock length in weeks" className="mt-3 w-full accent-[#cba86a]" />
            <div className="mt-2 grid grid-cols-5 gap-1.5">
              {presets.map((p) => (
                <button key={p.l} type="button" onClick={() => setWeeks(p.w)} className={`rounded-md border px-2 py-1.5 font-mono text-[11.5px] ${weeks === p.w ? "border-metal/60 text-metal" : "border-white/[0.1] text-ink-2"}`}>
                  {p.l}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <Row k="Weight per BERRIER now" v={`${weightNow.toFixed(3)} veBERRIER`} />
              <Row k="Function" v="createLock(amount, unlockTime)" />
            </div>
            <button type="button" disabled className="btn btn-ghost mt-5 w-full">
              Locks open at launch
            </button>
          </Panel>
        </div>
      </div>
      <Notice>Weights here are computed in the browser from the veBERRIER formula. Once deployed, the contract&apos;s balanceOf is the only authority.</Notice>
    </>
  );
}

export function ProposalsPage() {
  const [filter, setFilter] = useState("All");
  return (
    <>
      <GovHead eyebrow="BerrierGovernor · UpgradeGovernor" title="Proposals" active="/app/governance/proposals" right={<span className="chip">Threshold {GOVERNANCE.threshold}% veBERRIER</span>} />
      <div className="flex flex-wrap gap-2">
        {["All", "Open", "Queued", "Closed"].map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} className={`chip !h-8 !px-3 ${filter === f ? "!border-metal/60 !text-metal" : ""}`}>
            {f} <span className="text-ink-3">0</span>
          </button>
        ))}
      </div>
      <Panel className="mt-6" bodyClass="p-0">
        <Empty title="No proposals yet" body="Governance opens with the first veBERRIER locks after launch. Proposals from both governors will be listed here.">
          <Link href="/docs/governance/proposals" className="btn btn-ghost">
            How proposals work
          </Link>
        </Empty>
      </Panel>
      <Notice>
        Lifecycle: Pending → Active → Succeeded → Queued → Executed. Parameter changes take about 8 days end to end (1 d delay, 5 d vote, 48 h timelock); upgrades about 15 days (1 d, 7 d, 7 d). Proposal ids are the uint256 hash of targets, values, calldatas and the description hash.
      </Notice>
    </>
  );
}

export function ProposalDetail({ id }: { id: string }) {
  return (
    <>
      <GovHead eyebrow="Proposal" title={`Proposal ${id.length > 14 ? id.slice(0, 8) + "…" + id.slice(-4) : id}`} active="/app/governance/proposals" />
      <Panel bodyClass="p-0">
        <Empty title="No proposal with this id" body="No proposal has been created yet. Once governance is live, every proposal gets a page here with its actions, votes and timelock.">
          <Link href="/app/governance/proposals" className="btn btn-ghost">
            All proposals
          </Link>
        </Empty>
      </Panel>
    </>
  );
}

export function GaugesPage() {
  const { address } = useWallet();
  const now = useNow();
  const end = now ? nextEpoch(now) : null;
  const left = end && now ? end - now : null;
  const fmt = (s: number) => `${Math.floor(s / 86400)}d ${Math.floor((s % 86400) / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
  const decayPeriods = Math.ceil(Math.log(GOVERNANCE.floorWeekly / GOVERNANCE.initialWeekly) / Math.log(1 - GOVERNANCE.decayPct / 100));
  const gauges = [
    { name: "Backstop", kind: "Vault deposits" },
    { name: "Staking · sBERRIER", kind: "Stakers" },
    ...TEMPLATES.map((t) => ({ name: `Series · ${t.ticker}`, kind: "Series legs staked" })),
  ];
  return (
    <>
      <GovHead eyebrow="Weekly BERRIER emissions · Backstop cap allocation" title="Gauges" active="/app/governance/gauges" />
      <StatStrip
        stats={[
          { label: "Epoch ends", value: left !== null ? fmt(left) : "--", sub: end ? new Date(end * 1000).toUTCString().replace(":00 GMT", " UTC").slice(0, 22) : "Thursday 00:00 UTC" },
          { label: "Weekly emission", value: GOVERNANCE.initialWeekly.toLocaleString("en-US"), unit: "BERRIER", sub: "First week after launch" },
          { label: "Gauges", value: String(gauges.length), sub: "8 series · 1 Backstop · 1 staking" },
          { label: "Your voting power", value: "--", sub: address ? "No lock yet" : "Connect to allocate" },
        ]}
      />
      <Panel title="Gauge weights" right="Relative weight · BERRIER per week" className="mt-6" bodyClass="p-0">
        <div className="scroll-x">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
              <tr>
                {["Gauge", "This week", "Next week", "Backstop cap"].map((h) => (
                  <th key={h} className="px-5 py-3.5 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gauges.map((g) => (
                <tr key={g.name} className="border-t border-white/[0.06]">
                  <td className="px-5 py-3.5">
                    <p className="text-ink">{g.name}</p>
                    <p className="text-[12.5px] text-ink-3">{g.kind}</p>
                  </td>
                  <td className="num px-5 py-3.5 text-ink-3">--</td>
                  <td className="num px-5 py-3.5 text-ink-3">--</td>
                  <td className="num px-5 py-3.5 text-ink-3">{g.name.startsWith("Series") ? `≤ ${BACKSTOP.perUnderlying}%` : "--"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-white/[0.06] px-5 py-4 text-[12.5px] leading-[1.6] text-ink-3">
          Weight is each gauge&apos;s share of all veBERRIER votes. Once a week the Minter splits the emission by these weights, and the series weights set each stock&apos;s Backstop cap: its share of {BACKSTOP.totalCap}% total, floored at 1%, capped at 40%, and never above the governed {BACKSTOP.perUnderlying}%. Votes can only tighten a cap.
        </p>
      </Panel>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Emission schedule" right={`−${GOVERNANCE.decayPct}% every ${GOVERNANCE.decayEveryWeeks} weeks`}>
          <Row k="Initial weekly" v={`${GOVERNANCE.initialWeekly.toLocaleString("en-US")} BERRIER`} />
          <Row k="Floor" v={`${GOVERNANCE.floorWeekly.toLocaleString("en-US")} BERRIER · after ≈ ${decayPeriods} decay periods`} />
          <Row k="Budget each week" v="min(schedule, epoch cap left)" />
        </Panel>
        <Panel title="Your allocation" right="0% / 100%">
          {address ? (
            <p className="text-[14px] text-ink-2">This wallet has no veBERRIER lock yet. Lock BERRIER to direct emissions.</p>
          ) : (
            <div className="text-[14px] text-ink-2">
              Connect a wallet with an active veBERRIER lock to direct emissions.
              <ConnectButton className="btn btn-metal mt-4 w-full" />
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
