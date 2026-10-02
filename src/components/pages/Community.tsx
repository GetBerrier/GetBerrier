"use client";

import Link from "next/link";
import { useState } from "react";
import { BRAND, shortAddress } from "@/config/brand";
import { useWallet } from "@/components/wallet/WalletProvider";
import { useWalletModal } from "@/components/wallet/WalletButton";
import { ArrowRight } from "@/components/icons";
import { Reveal } from "@/components/ui/Reveal";

function useSignIn() {
  const { address, signMessage } = useWallet();
  const { open } = useWalletModal();
  const [signed, setSigned] = useState<{ address: string; at: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const signIn = async () => {
    if (!address) return open();
    setBusy(true);
    setError(null);
    try {
      const at = new Date().toISOString();
      await signMessage(`Sign in to ${BRAND.name} Community\n\nWallet: ${address}\nIssued: ${at}\n\nThis signature proves you own the wallet. It is not a transaction and costs no gas.`);
      setSigned({ address, at });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Signature refused.");
    } finally {
      setBusy(false);
    }
  };
  return { address, signed: signed && address && signed.address.toLowerCase() === address.toLowerCase() ? signed : null, busy, error, signIn };
}

function SignInButton({ s, className = "btn btn-metal" }: { s: ReturnType<typeof useSignIn>; className?: string }) {
  if (s.signed) return <span className="chip !border-settle/40 !text-settle">Signed in · {shortAddress(s.signed.address, 6, 4)}</span>;
  return (
    <button type="button" onClick={s.signIn} disabled={s.busy} className={className} data-signin>
      {s.busy ? "Check your wallet…" : s.address ? "Sign in with wallet" : "Connect wallet to sign in"}
    </button>
  );
}

const LADDER = [
  { n: 1, m: "1×" },
  { n: 3, m: "1.5×" },
  { n: 6, m: "2.5×" },
  { n: 12, m: "5×" },
];

const TIERS = [
  { name: "Wide", dist: "−30%", mult: "1.0×", risk: null },
  { name: "Standard", dist: "−20%", mult: "1.3×", risk: null },
  { name: "Close", dist: "−15%", mult: "1.8×", risk: "A breach zeroes points on that note" },
  { name: "Tight", dist: "−8%", mult: "3.0×", risk: "A breach zeroes points on that note" },
];

const REFERRALS = [
  ["Multiplier", "1 + 0.10 per active referee, up to 2×"],
  ["Yield", "10% of each active referee's base points"],
  ["Welcome boost", "Referee earns +25% on the first note, first 4 closes"],
  ["Same stock", "+5% for both when you hold the same underlying"],
  ["Weekly pool", "100,000 points a week, shared by new activations"],
  ["Badges", "3 Link · 10 Ring · 25 Web"],
];

export function CommunityView() {
  const s = useSignIn();
  return (
    <>
      <section className="relative overflow-hidden pt-32">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_75%_30%,rgba(203,168,106,0.09),transparent_70%)]" />
        <div className="wrap">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
            <p className="label">Community · points, streaks, referrals, leaderboard</p>
            <SignInButton s={s} className="btn btn-sm btn-ghost" />
          </div>
          <div className="grid grid-cols-1 gap-12 py-20 lg:grid-cols-[minmax(0,1fr)_440px]">
            <div>
              <p className="eyebrow">Community · {BRAND.symbol} points</p>
              <h1 className="h-display mt-7 text-[clamp(40px,5.4vw,72px)]">Points for calling it right, not just for showing up.</h1>
              <p className="lead mt-7 max-w-[600px]">
                Put USDG on the CARRY side, or stock on the GUARD side, of any {BRAND.name} note. Every day the position is live, it earns points. The first season starts when the protocol launches on mainnet; nothing accrues before then.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <SignInButton s={s} />
                <Link href="/app" className="btn btn-ghost">
                  Open the app <ArrowRight />
                </Link>
              </div>
              {s.error ? <p className="mt-4 text-[13.5px] text-breach">{s.error}</p> : null}
            </div>
            <div className="panel figure-grid self-start p-6">
              <div className="flex items-center justify-between">
                <p className="mono-label">Streak ladder</p>
                <p className="mono-label">12 closes · one series</p>
              </div>
              <div className="mt-6 grid grid-cols-12 items-end gap-1.5">
                {Array.from({ length: 12 }, (_, i) => {
                  const step = LADDER.filter((l) => l.n <= i + 1).pop();
                  const h = step?.m === "5×" ? 100 : step?.m === "2.5×" ? 60 : step?.m === "1.5×" ? 38 : 22;
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="w-full rounded-sm bg-[linear-gradient(180deg,#e3c892,#9a7a44)]" style={{ height: h, opacity: 0.35 + (i / 12) * 0.65 }} />
                      <span className="font-mono text-[10px] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 flex justify-between font-mono text-[11.5px] text-ink-2">
                {LADDER.map((l) => (
                  <span key={l.n}>
                    {l.n} → <span className="text-metal">{l.m}</span>
                  </span>
                ))}
              </div>
              <p className="mt-5 text-[13.5px] leading-[1.6] text-ink-2">Every close your note survives above the barrier adds one to the streak. A breach or an early exit resets it; badges you earned stay.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-rule">
        <div className="wrap">
        <div className="grid grid-cols-2 gap-px bg-white/[0.06] md:grid-cols-4">
          {[
            ["Depositors", "0"],
            ["Guards", "0"],
            ["Notes", "0"],
            ["Points issued", "0"],
          ].map(([k, v]) => (
            <div key={k} className="bg-g0 px-2 py-7 sm:px-6">
              <p className="label !text-[11px]">{k}</p>
              <p className="num mt-2 text-[26px]">{v}</p>
            </div>
          ))}
        </div>
        </div>
        <p className="wrap pb-6 pt-3 font-mono text-[11.5px] text-ink-3">Counters read from BarrierCore once it is deployed; season one opens at launch.</p>
      </section>

      <section className="section-rule py-[var(--section)]">
        <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Your profile</p>
            <h2 className="h2 mt-7">Your points, your streak, your rank.</h2>
            <p className="lead mt-6 max-w-[520px]">Sign in with the wallet you deposit from. The signature only proves the wallet is yours: no transaction, no gas. Every figure on your profile is read from chain, never self-reported.</p>
          </Reveal>
          <Reveal className="panel p-7">
            {s.signed ? (
              <>
                <p className="mono-label">Signed in</p>
                <p className="mt-2 font-mono text-[15px]">{shortAddress(s.signed.address, 10, 8)}</p>
                <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-[10px] bg-white/[0.06]">
                  {[
                    ["Points", "0"],
                    ["Streak", "0"],
                    ["Rank", "--"],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-g3 p-4">
                      <p className="label !text-[10.5px]">{k}</p>
                      <p className="num mt-2 text-[22px]">{v}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-[13.5px] text-ink-3">Season one has not started. Your points begin with your first deposit after launch.</p>
              </>
            ) : (
              <>
                <p className="font-display text-[22px]">Not signed in</p>
                <p className="mt-2 text-[14.5px] text-ink-2">Connect and sign once to see your profile.</p>
                <div className="mt-6">
                  <SignInButton s={s} />
                </div>
              </>
            )}
          </Reveal>
        </div>
      </section>

      <section className="section-rule py-[var(--section)]">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">How it works</p>
            <h2 className="h2 mt-7 max-w-[760px]">Deposit. Choose your barrier. Keep the streak alive.</h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border border-white/[0.08] bg-white/[0.06] md:grid-cols-3">
            {[
              { t: "Deposit into a note", b: "USDG on the CARRY side, or stock plus prefund on the GUARD side, of any series that is open for subscription." },
              { t: "Points accrue daily", b: "One point per USDG of position value per live day, scaled by your barrier tier and your streak. GUARD positions count at the strike price once the note strikes." },
              { t: "Season rules first", b: "Any future conversion of points would be announced well in advance, with a per-wallet cap, and would open on this page for every signed-in wallet." },
            ].map((c, i) => (
              <div key={c.t} className="bg-g2 p-7">
                <p className="num text-[13px] text-metal">0{i + 1}</p>
                <p className="mt-4 font-display text-[22px]">{c.t}</p>
                <p className="mt-3 text-[15px] leading-[1.65] text-ink-2">{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-rule py-[var(--section)]">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Streaks</p>
            <h2 className="h2 mt-7">Stack closes, stack multipliers.</h2>
            <p className="lead mt-6">Each scheduled close your note survives above the barrier counts once. A breach or an early exit resets the multiplier; badges stay.</p>
            <div className="scroll-x mt-8 rounded-[14px] border border-white/[0.08] bg-g2">
              <table className="w-full min-w-[420px] text-left text-[14px]">
                <thead className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                  <tr>
                    <th className="px-5 py-3 font-normal">In a row</th>
                    <th className="px-5 py-3 font-normal">Multiplier</th>
                    <th className="px-5 py-3 font-normal">Reward</th>
                  </tr>
                </thead>
                <tbody>
                  {LADDER.map((l) => (
                    <tr key={l.n} className="border-t border-white/[0.06]">
                      <td className="num px-5 py-3">{l.n}</td>
                      <td className="num px-5 py-3 text-metal">{l.m}</td>
                      <td className="px-5 py-3 text-ink-2">{l.n === 12 ? "Full Term badge, permanent and carried into later seasons" : "–"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <Reveal>
            <p className="eyebrow">Barriers</p>
            <h2 className="h2 mt-7">Pick how close you stand to the line.</h2>
            <p className="lead mt-6">Closer barriers earn more points, but a breach wipes the points on that note.</p>
            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-white/[0.08] bg-white/[0.06]">
              {TIERS.map((t) => (
                <div key={t.name} className="bg-g2 p-5">
                  <p className="text-[15px]">{t.name}</p>
                  <p className="num mt-3 text-[24px]">{t.mult}</p>
                  <p className="font-mono text-[12px] text-ink-3">barrier {t.dist}</p>
                  {t.risk ? <p className="mt-3 text-[12.5px] text-breach">{t.risk}</p> : null}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-rule py-[var(--section)]">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-2">
          <Reveal className="panel p-8">
            <p className="eyebrow">Breached?</p>
            <h2 className="h3 mt-6">Use the recovery window.</h2>
            <p className="mt-4 text-[15px] leading-[1.65] text-ink-2">After a breach you have 48 hours to re-deposit at the same size or larger. Do that and you keep half your streak, and the new note earns double for its first week.</p>
            <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-[10px] bg-white/[0.06]">
              {[
                ["48h", "to re-deposit"],
                ["50%", "streak kept"],
                ["2×", "first week"],
              ].map(([v, k]) => (
                <div key={k} className="bg-g3 p-4">
                  <p className="num text-[22px] text-metal">{v}</p>
                  <p className="mt-1 text-[12.5px] text-ink-3">{k}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="panel p-8">
            <p className="eyebrow">Bonuses that stack</p>
            <h2 className="h3 mt-6">Stay, spread out, add liquidity.</h2>
            <ul className="mt-6 grid gap-4">
              {[
                ["+50%", "Keep your deposit through the season's claim date"],
                ["+25%", "Hold three or more different notes in the season"],
                ["+20%", `Hold a live ${BRAND.symbol}/ETH liquidity position`],
              ].map(([v, t]) => (
                <li key={t} className="flex items-baseline gap-4 border-b border-white/[0.06] pb-4 last:border-b-0">
                  <span className="num w-16 shrink-0 text-[20px] text-metal">{v}</span>
                  <span className="text-[15px] text-ink-2">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section-rule py-[var(--section)]">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <Reveal>
            <p className="eyebrow">Referrals</p>
            <h2 className="h2 mt-7">Bring a wallet. You both earn more.</h2>
            <p className="lead mt-6">Share your link. A wallet that signs in through it before its first deposit becomes your referee, and turns active once it holds 250 USDG or more in a note that survives one close. One level only; two wallets funded from the same source earn nothing.</p>
          </Reveal>
          <Reveal className="scroll-x rounded-[14px] border border-white/[0.08] bg-g2">
            <table className="w-full min-w-[460px] text-left text-[14px]">
              <thead className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                <tr>
                  <th className="px-5 py-3 font-normal">Term</th>
                  <th className="px-5 py-3 font-normal">Rule</th>
                </tr>
              </thead>
              <tbody>
                {REFERRALS.map(([k, v]) => (
                  <tr key={k} className="border-t border-white/[0.06]">
                    <td className="px-5 py-3.5 text-ink">{k}</td>
                    <td className="px-5 py-3.5 text-ink-2">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      <section className="section-rule py-[var(--section)]">
        <div className="wrap">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Leaderboard</p>
              <h2 className="h2 mt-7">Ranked by points, not by size.</h2>
            </div>
            <p className="max-w-[420px] text-[14.5px] leading-[1.6] text-ink-2">Points scale with days survived, barrier and streak, so a small, sharp depositor can outrank a large, cautious one. Ties break on streak, then deposit.</p>
          </Reveal>
          <div className="mt-10 overflow-hidden rounded-[14px] border border-white/[0.08] bg-g2">
            <div className="grid grid-cols-[48px_minmax(0,1fr)_80px_110px] gap-2 border-b border-white/[0.06] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
              <span>#</span>
              <span>Wallet</span>
              <span>Streak</span>
              <span className="text-right">Points</span>
            </div>
            <div className="px-6 py-14 text-center">
              <p className="font-display text-[22px]">The board is empty</p>
              <p className="mx-auto mt-2 max-w-[460px] text-[14.5px] text-ink-2">Season one begins with the first mainnet deposits. Wallets appear here as soon as they earn their first point.</p>
            </div>
          </div>
          <p className="mt-6 max-w-[900px] font-mono text-[12px] leading-[1.7] text-ink-3">
            points = deposit (USDG) × days live × barrier multiplier × streak multiplier × (1 + bonuses) × referral multiplier, plus referral yield, welcome boost, same-stock bonus and the weekly pool.
          </p>
        </div>
      </section>

      <section className="section-rule py-[var(--section)]">
        <div className="wrap">
          <Reveal className="panel figure-grid flex flex-col items-start gap-6 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow">Claim</p>
              <h2 className="h2 mt-6">Nothing to claim yet.</h2>
              <p className="lead mt-5 max-w-[620px]">Points do not exist before launch. If a conversion is ever offered, it will be announced in advance, capped per wallet, and opened here for every signed-in participant.</p>
            </div>
            <div className="flex flex-col items-start gap-3">
              <span className="chip">Locked · season not started</span>
              <button type="button" disabled className="btn btn-ghost">
                Claim {BRAND.symbol}
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
