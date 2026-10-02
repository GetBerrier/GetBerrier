import { CREDIT } from "@/config/protocol";
import { Corners, LinkArrow, SectionHead } from "@/components/home/parts";
import { PATH_AUTOCALL, xAt, yAt } from "@/components/home/PathChart";
import { Reveal } from "@/components/ui/Reveal";

const mono = { fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.06em" } as const;

function NotesFigure() {
  // A full 13-close path that holds the barrier and ends in cash.
  const path = [...PATH_AUTOCALL.slice(0, 9), 99.4, 97.1, 102.8, 104.1];
  const yB = yAt(80);
  return (
    <svg viewBox="0 0 440 330" className="h-auto w-full" aria-hidden>
      {path.map((_, i) => (
        <line key={i} x1={xAt(i)} x2={xAt(i)} y1={40} y2={286} stroke="rgba(224,189,122,0.22)" />
      ))}
      <rect x={xAt(0)} y={yB} width={xAt(12) - xAt(0)} height={286 - yB} fill="rgba(224,87,79,0.07)" />
      <line x1={xAt(0)} x2={xAt(12)} y1={yAt(105)} y2={yAt(105)} stroke="rgba(244,242,238,0.25)" strokeDasharray="3 4" />
      <text x={xAt(0)} y={yAt(105) - 8} fill="#a6a39c" style={mono}>AUTOCALL 105</text>
      <line x1={xAt(0)} x2={xAt(12)} y1={yAt(100)} y2={yAt(100)} stroke="#e0bd7a" strokeOpacity="0.7" />
      <text x={xAt(0)} y={yAt(100) + 16} fill="#e0bd7a" style={mono}>S0 100</text>
      <line x1={xAt(0)} x2={xAt(12)} y1={yB} y2={yB} stroke="rgba(244,242,238,0.5)" />
      <text x={xAt(0)} y={yB - 8} fill="#d8d4cc" style={mono}>BARRIER 80</text>
      <text x={xAt(12)} y={276} textAnchor="end" fill="#83817b" style={mono}>GUARD</text>
      <text x={xAt(12)} y={30} textAnchor="end" fill="#e0bd7a" style={mono}>12 COUPONS</text>
      <polyline points={path.map((p, i) => `${xAt(i)},${yAt(p)}`).join(" ")} fill="none" stroke="#f4f2ee" strokeOpacity="0.85" strokeWidth="1.5" strokeLinejoin="round" />
      {path.map((p, i) => (
        <g key={i}>
          <circle cx={xAt(i)} cy={yAt(p)} r="6" fill="rgba(224,189,122,0.16)" />
          <circle cx={xAt(i)} cy={yAt(p)} r="2.4" fill={i === 12 ? "#fbf3df" : "#e0bd7a"} />
          <circle cx={xAt(i)} cy={286} r="1.8" fill="#e0bd7a" />
        </g>
      ))}
      <text x={xAt(12) - 8} y={yAt(104.1) - 12} textAnchor="end" fill="#f4f2ee" style={mono}>CASH</text>
      <text x={xAt(0)} y={306} fill="#83817b" style={mono}>CLOSE 1</text>
      <text x={xAt(12)} y={306} textAnchor="end" fill="#83817b" style={mono}>13</text>
    </svg>
  );
}

function CreditFigure() {
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 220 270" className="h-auto w-full max-w-[220px]" aria-hidden>
      <circle cx="68" cy="66" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
      <circle cx="68" cy="66" r={r} fill="none" stroke="#e0bd7a" strokeWidth="1.5" strokeDasharray={`${c * 0.8} ${c}`} transform="rotate(-90 68 66)" />
      <text x="68" y="62" textAnchor="middle" fill="#f4f2ee" style={mono}>CARRY</text>
      <text x="68" y="77" textAnchor="middle" fill="#a6a39c" style={mono}>WRAPPED</text>
      <line x1="114" x2="200" y1="66" y2="66" stroke="rgba(255,255,255,0.18)" strokeDasharray="2 4" />
      <text x="20" y="138" fill="#e0bd7a" style={mono}>MARK 80%</text>
      <text x="20" y="152" fill="#a6a39c" style={mono}>OF LEG VALUE</text>
      <text x="20" y="184" fill="#f4f2ee" style={mono}>DRAWN 31%</text>
      <rect x="20" y="194" width="180" height="22" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" />
      <rect x="20" y="194" width="56" height="22" fill="rgba(224,189,122,0.28)" />
      <line x1={20 + 180 * (CREDIT.lltv / 100)} x2={20 + 180 * (CREDIT.lltv / 100)} y1="188" y2="222" stroke="#f4f2ee" strokeWidth="1.5" />
      <text x={26 + 180 * (CREDIT.lltv / 100)} y="236" fill="#a6a39c" style={mono}>LLTV {CREDIT.lltv}%</text>
      <text x="20" y="236" fill="#83817b" style={mono}>0</text>
      <text x="20" y="262" fill="#e0bd7a" style={mono}>COUPONS KEEP ACCRUING</text>
    </svg>
  );
}

function OmniFigure() {
  return (
    <svg viewBox="0 0 220 260" className="h-auto w-full max-w-[220px]" aria-hidden>
      <text x="20" y="40" fill="#a6a39c" style={mono}>ROBINHOOD CHAIN</text>
      <rect x="20" y="52" width="68" height="30" rx="4" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.22)" />
      <text x="54" y="71" textAnchor="middle" fill="#f4f2ee" style={mono}>ESCROW</text>
      <rect x="100" y="55" width="80" height="24" rx="4" fill="rgba(224,189,122,0.08)" stroke="#e0bd7a" />
      <circle cx="111" cy="67" r="2.2" fill="#e0bd7a" />
      <text x="146" y="71" textAnchor="middle" fill="#ebcf98" style={mono}>CARRY</text>
      <text x="74" y="118" fill="#a6a39c" style={mono}>LAYERZERO</text>
      <path d="M140 80 C140 140, 90 150, 90 200" fill="none" stroke="rgba(244,242,238,0.45)" strokeDasharray="3 4">
        <animate attributeName="stroke-dashoffset" from="0" to="-14" dur="1.2s" repeatCount="indefinite" />
      </path>
      <rect x="40" y="200" width="100" height="18" fill="none" stroke="rgba(255,255,255,0.14)" strokeDasharray="2 3" />
      <line x1="20" x2="200" y1="226" y2="226" stroke="rgba(255,255,255,0.14)" />
      <text x="40" y="250" fill="#a6a39c" style={mono}>DESTINATION CHAIN</text>
    </svg>
  );
}

export function Protocol() {
  return (
    <section className="section-rule py-[var(--section)]" aria-labelledby="protocol">
      <div className="wrap">
        <SectionHead
          id="protocol"
          eyebrow="Protocol"
          title="Three products. One escrow."
          lead="Notes, Credit and Omni all draw on the same escrow on Robinhood Chain. Whatever happens elsewhere, settlement only ever happens there."
        />

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal className="panel flex flex-col overflow-hidden">
            <div className="figure-grid relative border-b border-white/[0.06] p-6 sm:p-8">
              <Corners />
              <NotesFigure />
            </div>
            <div className="p-7 sm:p-8">
              <p className="label">Notes</p>
              <h3 className="h3 mt-4">
                Coupons in USDG.
                <br />A floor under your stock.
              </h3>
              <p className="mt-4 max-w-[460px] text-[15.5px] leading-[1.65] text-ink-2">
                A USDG holder takes the CARRY leg and collects a weekly coupon. A stockholder posts shares as the GUARD leg and buys protection with it. Both sides hold tokens.
              </p>
              <div className="mt-6">
                <LinkArrow href="/app">Open Notes</LinkArrow>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-6">
            {[
              {
                label: "Credit",
                title: (
                  <>
                    Borrow USDG against
                    <br />a CARRY leg.
                  </>
                ),
                body: "Wrap CARRY legs as collateral and draw USDG. How much you can borrow follows the leg's marked value, and the coupons keep landing in your position.",
                href: "/credit",
                cta: "Open Credit",
                fig: <CreditFigure />,
              },
              {
                label: "Omni",
                title: (
                  <>
                    Send the legs out.
                    <br />
                    Keep the escrow home.
                  </>
                ),
                body: "Move CARRY and GUARD legs to other chains and back over LayerZero. The collateral and the settlement never leave Robinhood Chain.",
                href: "/omnichain",
                cta: "Open Omni",
                fig: <OmniFigure />,
              },
            ].map((c, i) => (
              <Reveal key={c.label} delay={i * 80} className="panel grid grid-cols-1 overflow-hidden sm:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
                <div className="figure-grid relative flex items-center justify-center border-b border-white/[0.06] p-6 sm:border-b-0 sm:border-r">
                  <Corners />
                  {c.fig}
                </div>
                <div className="flex flex-col justify-center p-7">
                  <p className="label">{c.label}</p>
                  <h3 className="h3 mt-4">{c.title}</h3>
                  <p className="mt-4 text-[15px] leading-[1.65] text-ink-2">{c.body}</p>
                  <div className="mt-6">
                    <LinkArrow href={c.href}>{c.cta}</LinkArrow>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
