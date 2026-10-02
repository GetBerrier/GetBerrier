import { FEES } from "@/config/protocol";
import { Corners, SectionHead } from "@/components/home/parts";
import { Reveal } from "@/components/ui/Reveal";

const mono = { fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.05em" } as const;

function Node({ x, y, w, title, lines, hot = false }: { x: number; y: number; w: number; title: string; lines: string[]; hot?: boolean }) {
  const h = 22 + lines.length * 14;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="5" fill="#141416" stroke={hot ? "rgba(224,189,122,0.7)" : "rgba(255,255,255,0.18)"} />
      {hot ? <line x1={x + 6} x2={x + w - 6} y1={y} y2={y} stroke="#ebcf98" strokeWidth="1.5" /> : null}
      <text x={x + 12} y={y + 18} fill="#f4f2ee" style={mono}>{title}</text>
      {lines.map((l, i) => (
        <text key={l} x={x + 12} y={y + 32 + i * 14} fill="#83817b" style={mono}>{l}</text>
      ))}
    </g>
  );
}

function Flow() {
  const pulse = (d: string, delay: number) => (
    <circle r="3" fill="#ebcf98">
      <animateMotion dur="3.2s" begin={`${delay}s`} repeatCount="indefinite" path={d} />
    </circle>
  );
  const a = "M290 160 H400";
  const b = "M552 150 H580 V70 H690";
  const c = "M552 172 H580 V280 H690";
  const d = "M886 70 H1020";
  const e = "M836 280 H1020";
  const f = "M575 360 H700 V306";
  return (
    <svg viewBox="0 0 1180 420" className="h-auto w-full min-w-[860px]" aria-label="Value flow: fees to the FeeRouter, to the buyback auction and the Treasury">
      {[a, b, c, d, e, f].map((p) => (
        <path key={p} d={p} fill="none" stroke="rgba(255,255,255,0.22)" />
      ))}
      {pulse(a, 0)}
      {pulse(b, 0.8)}
      {pulse(c, 1.1)}
      {pulse(d, 1.7)}
      {pulse(e, 2.1)}
      {pulse(f, 0.4)}
      <text x="562" y="140" fill="#ebcf98" style={mono}>{FEES.toBuyback}%</text>
      <text x="562" y="196" fill="#a6a39c" style={mono}>{FEES.toTreasury}%</text>
      <Node x={130} y={130} w={160} title="FEES" lines={[`${FEES.couponShare}% OF COUPONS`, `${FEES.notional.toFixed(2)}% OF NOTIONAL`]} />
      <Node x={400} y={134} w={152} title="FEEROUTER" lines={["SPLITS EVERY FEE"]} hot />
      <Node x={690} y={40} w={196} title="DUTCH AUCTION" lines={["BUYS BERRIER", "NEVER UNDER THE FLOOR"]} />
      <Node x={1020} y={48} w={150} title="sBERRIER" lines={[`STREAMS OVER ${FEES.streamDays} DAYS`]} />
      <Node x={690} y={258} w={146} title="TREASURY" lines={["HOLDS RESERVES"]} />
      <Node x={1020} y={250} w={150} title="FLOOR" lines={["REDEEM FOR RESERVES", `${FEES.floorPerDay}% A DAY, MAX`]} />
      <Node x={400} y={340} w={175} title="BONDS" lines={["DISCOUNTED, VESTED"]} />
    </svg>
  );
}

const CARDS = [
  { k: "Bonds", t: "BERRIER at a discount, vested.", b: "Pay with USDG, Stock Tokens or CARRY legs and receive BERRIER below the auction price, released over a week. Proceeds go to the Treasury." },
  { k: "Staking", t: "sBERRIER collects the buybacks.", b: `Every BERRIER the auction buys back streams to sBERRIER holders over ${FEES.streamDays} days.` },
  { k: "Buyback auction", t: "Always on. Never under the floor.", b: `${FEES.toBuyback}% of protocol fees buy BERRIER through a Dutch auction whose price cannot fall below the floor.` },
  { k: "Treasury floor", t: "Redeemable for reserves.", b: `Burn BERRIER for its share of the reserves, up to ${FEES.floorPerDay}% of reserves per day.` },
];

export function TokenFlow() {
  return (
    <section className="section-rule py-[var(--section)]" aria-labelledby="berrier">
      <div className="wrap">
        <SectionHead
          id="berrier"
          eyebrow="BERRIER"
          title="A token paid by fees, not by promises."
          lead="Protocol fees buy BERRIER back. Treasury reserves put a floor under it. Every step is a contract anyone can read."
        />
        <Reveal className="panel mt-16 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-6 py-4 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-3">
            <span>Value flow</span>
            <span>
              Fees <span className="text-ink">{FEES.couponShare}%</span> of coupons <span className="mx-2 opacity-40">|</span>
              <span className="text-ink">{FEES.notional.toFixed(2)}%</span> of notional
            </span>
          </div>
          <div className="figure-grid relative">
            <Corners />
            <div className="scroll-x px-4 py-8">
              <Flow />
            </div>
          </div>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 border-y border-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c, i) => (
            <Reveal key={c.k} delay={i * 70} className={`py-8 sm:px-6 ${i > 0 ? "border-t border-white/[0.06] sm:border-t-0" : ""} ${i % 2 === 1 ? "sm:border-l" : ""} ${i >= 2 ? "sm:border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""} border-white/[0.06] lg:first:pl-0`}>
              <p className="label">{c.k}</p>
              <h3 className="mt-4 font-display text-[22px] leading-[1.2]">{c.t}</h3>
              <p className="mt-4 text-[15px] leading-[1.65] text-ink-2">{c.b}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
