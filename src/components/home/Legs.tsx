import { Corners, PreviewTag } from "@/components/home/parts";
import { Reveal } from "@/components/ui/Reveal";

const mono = { fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.06em" } as const;

function LegCard({ n, name, who, letter, body, rows }: { n: number; name: string; who: string; letter: string; body: string; rows: [string, string][] }) {
  return (
    <div className="flex flex-col p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label">Leg {n}</p>
          <p className="mt-4 font-display text-[24px] tracking-[0.02em]">{name}</p>
          <p className="mt-1 text-[14px] text-ink">{who}</p>
        </div>
        <span className="relative grid size-14 place-items-center rounded-[10px] border border-white/[0.14] bg-g3 font-mono text-[18px] shadow-[inset_0_-10px_14px_-12px_rgba(203,168,106,0.6)]">
          {letter}
          <span className={`absolute right-2 top-2 size-1.5 rounded-full ${n === 0 ? "bg-metal" : "bg-ink-2"}`} />
        </span>
      </div>
      <p className="mt-6 text-[15.5px] leading-[1.7] text-ink-2">{body}</p>
      <dl className="mt-auto pt-8">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between border-t border-white/[0.06] py-3.5">
            <dt className="label !text-[11px]">{k}</dt>
            <dd className="text-[14px] text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function EscrowFigure() {
  const xs = (i: number) => 20 + i * 18.5;
  const path = [100, 102.5, 99, 101.2, 97.8];
  const y = (p: number) => 140 - (p - 100) * 4;
  return (
    <svg viewBox="0 0 260 300" className="h-auto w-full" aria-hidden>
      <text x="20" y="36" fill="#cba86a" style={mono}>COUPON 0.55% / WK</text>
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={xs(i)} x2={xs(i)} y1="46" y2="56" stroke={i < 4 ? "#cba86a" : "rgba(255,255,255,0.18)"} strokeWidth={i < 4 ? 1.6 : 1} />
      ))}
      <line x1="20" x2="240" y1="140" y2="140" stroke="#cba86a" strokeOpacity="0.7" />
      <text x="240" y="132" textAnchor="end" fill="#cba86a" style={mono}>S0 100</text>
      <polyline points={path.map((p, i) => `${xs(i)},${y(p)}`).join(" ")} fill="none" stroke="#f4f2ee" strokeWidth="1.5" />
      <line x1="20" x2="240" y1="220" y2="220" stroke="rgba(244,242,238,0.55)" />
      <text x="20" y="212" fill="#d8d4cc" style={mono}>BARRIER 80</text>
      <rect x="20" y="220" width="220" height="44" fill="rgba(224,87,79,0.07)" />
      <text x="20" y="284" fill="#83817b" style={mono}>1</text>
      <text x="240" y="284" textAnchor="end" fill="#e0574f" style={mono}>13</text>
    </svg>
  );
}

export function Legs() {
  return (
    <section className="py-[var(--section)] pt-0" aria-label="The two legs">
      <div className="wrap">
        <Reveal className="panel grid grid-cols-1 overflow-hidden lg:grid-cols-[1fr_minmax(0,400px)_1fr]">
          <LegCard
            n={0}
            name="CARRY"
            who="For USDG holders"
            letter="C"
            body="Earn a fixed coupon on every close where the barrier holds. Your principal comes back in cash, unless the last close lands below the barrier, in which case you take the stock at S0."
            rows={[
              ["Deposits", "USDG"],
              ["Earns", "Weekly coupons"],
              ["Downside", "Stock at S0"],
            ]}
          />
          <div className="figure-grid relative border-y border-white/[0.06] lg:border-x lg:border-y-0">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
              <span className="mono-label">One escrow</span>
              <PreviewTag>Illustrative</PreviewTag>
            </div>
            <div className="relative p-6">
              <Corners />
              <EscrowFigure />
            </div>
          </div>
          <LegCard
            n={1}
            name="GUARD"
            who="For Stock Token holders"
            letter="G"
            body="Post your shares, fund the coupon, and own a put struck at S0 until the note autocalls or matures. While the barrier holds, the stock comes straight back to you."
            rows={[
              ["Deposits", "Stock Tokens"],
              ["Pays", "Weekly coupons"],
              ["Holds", "Put at S0"],
            ]}
          />
        </Reveal>
      </div>
    </section>
  );
}
