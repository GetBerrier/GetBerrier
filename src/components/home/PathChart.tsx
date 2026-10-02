// SVG chart of one series: 13 scheduled closes against three levels.
// Purely illustrative; the numbers are a worked example, not a feed.

export const LEVELS = { autocall: 105, s0: 100, barrier: 78 };

export const PATH_AUTOCALL = [100, 103.4, 98.3, 104.2, 96.2, 93.6, 99.1, 104.4, 101.9, 107.3];
export const PATH_BREACH = [100, 103.4, 98.3, 104.2, 96.2, 93.6, 99.1, 104.4, 101.9, 95.2, 88.6, 82.1, 74.0];

const W = 440;
const H = 330;
const X0 = 34;
const X1 = 396;
const TOP = 34;
const BOTTOM = 286;
const HI = 124;
const LO = 62;

export const xAt = (i: number) => X0 + ((X1 - X0) * i) / 12;
export const yAt = (p: number) => TOP + ((HI - p) / (HI - LO)) * (BOTTOM - TOP);

const toPoints = (arr: number[], from = 0) => arr.map((p, i) => `${xAt(i + from).toFixed(1)},${yAt(p).toFixed(1)}`).join(" ");

export type ChartStep = 0 | 1 | 2 | 3;

export function PathChart({ step, compact = false }: { step: ChartStep; compact?: boolean }) {
  const yAc = yAt(LEVELS.autocall);
  const yS0 = yAt(LEVELS.s0);
  const yB = yAt(LEVELS.barrier);
  const observe = PATH_AUTOCALL.slice(0, 7);
  const shown = step === 0 ? [100] : step === 1 ? observe : step === 2 ? PATH_AUTOCALL : PATH_BREACH;
  const paidUpTo = step === 1 ? 6 : step === 2 ? 9 : step === 3 ? 12 : 0;
  const mono = { fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.06em" } as const;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Illustrative series path against autocall, strike and barrier levels">
      <defs>
        <linearGradient id="breachFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(224,87,79,0.10)" />
          <stop offset="1" stopColor="rgba(224,87,79,0.03)" />
        </linearGradient>
      </defs>

      {/* observation columns */}
      {Array.from({ length: 13 }, (_, i) => (
        <line key={i} x1={xAt(i)} x2={xAt(i)} y1={TOP - 8} y2={BOTTOM} stroke="rgba(255,255,255,0.07)" strokeDasharray="1 4" />
      ))}

      {/* breach zone */}
      <rect x={X0} y={yB} width={X1 - X0} height={BOTTOM - yB} fill="url(#breachFill)" />

      {/* levels */}
      <line x1={X0 - 10} x2={X1} y1={yAc} y2={yAc} stroke="rgba(244,242,238,0.28)" />
      <text x={X0} y={yAc - 8} fill="#a6a39c" style={mono}>AUTOCALL {LEVELS.autocall}</text>
      <line x1={X0 - 10} x2={X1} y1={yS0} y2={yS0} stroke="#e0bd7a" strokeOpacity="0.75" />
      <text x={X0} y={yS0 + 17} fill="#e0bd7a" style={mono}>S0 {LEVELS.s0}</text>
      <line x1={X0 - 10} x2={X1} y1={yB} y2={yB} stroke="rgba(244,242,238,0.55)" />
      <text x={X0} y={yB - 8} fill="#d8d4cc" style={mono}>BARRIER {LEVELS.barrier}</text>

      {/* ghost of the autocall path during maturity */}
      {step === 3 ? <polyline points={toPoints(PATH_AUTOCALL)} fill="none" stroke="rgba(244,242,238,0.16)" strokeWidth="1.2" /> : null}

      {/* the path */}
      {shown.length > 1 ? (
        step === 3 ? (
          <>
            <polyline key="a" points={toPoints(PATH_BREACH.slice(0, 9))} fill="none" stroke="#f4f2ee" strokeWidth="1.6" strokeLinejoin="round" pathLength={1} className="draw" />
            <polyline key="b" points={toPoints(PATH_BREACH.slice(8), 8)} fill="none" stroke="#e0574f" strokeWidth="1.6" strokeLinejoin="round" pathLength={1} className="draw draw-late" />
          </>
        ) : (
          <polyline key={step} points={toPoints(shown)} fill="none" stroke="#f4f2ee" strokeWidth="1.6" strokeLinejoin="round" pathLength={1} className="draw" />
        )
      ) : null}

      {/* coupon dots */}
      {shown.map((p, i) =>
        i > 0 && i <= paidUpTo && p >= LEVELS.barrier ? (
          <g key={i}>
            <circle cx={xAt(i)} cy={yAt(p)} r="7" fill="rgba(224,189,122,0.16)" />
            <circle cx={xAt(i)} cy={yAt(p)} r="2.6" fill="#e0bd7a" />
          </g>
        ) : null,
      )}

      {/* strike point */}
      <circle cx={xAt(0)} cy={yS0} r="8" fill="rgba(224,189,122,0.18)" />
      <circle cx={xAt(0)} cy={yS0} r="3" fill="#ebcf98" />
      {step === 0 ? (
        <text x={xAt(0) + 14} y={yS0 - 10} fill="#f4f2ee" style={mono}>STRIKE</text>
      ) : null}

      {step === 2 ? (
        <g>
          <circle cx={xAt(9)} cy={yAt(107.3)} r="14" fill="rgba(245,226,184,0.14)" />
          <circle cx={xAt(9)} cy={yAt(107.3)} r="4" fill="#fbf3df" />
          {!compact ? (
            <>
              <rect x={xAt(9) + 14} y={yAt(107.3) - 22} width="44" height="18" rx="9" fill="rgba(224,189,122,0.16)" stroke="rgba(224,189,122,0.5)" />
              <text x={xAt(9) + 22} y={yAt(107.3) - 9} fill="#ebcf98" style={mono}>CASH</text>
              <text x={xAt(9) + 14} y={yAt(107.3) + 14} fill="#e0bd7a" style={mono}>AUTOCALLED</text>
            </>
          ) : null}
        </g>
      ) : null}

      {step === 3 ? (
        <g>
          <circle cx={xAt(12)} cy={yAt(74)} r="12" fill="rgba(224,87,79,0.16)" />
          <circle cx={xAt(12)} cy={yAt(74)} r="3.6" fill="#e0574f" />
          {!compact ? <text x={xAt(12) - 4} y={BOTTOM + 30} textAnchor="end" fill="#e0574f" style={mono}>FINAL CLOSE 74 · STOCK AT S0</text> : null}
        </g>
      ) : null}

      {/* axis */}
      {Array.from({ length: 13 }, (_, i) => {
        const active = (step === 0 && i === 0) || (step === 2 && i === 9) || (step === 3 && i === 12) || (step === 1 && i === 6);
        const dim = step === 2 && i > 9;
        return (
          <g key={i}>
            <line x1={xAt(i)} x2={xAt(i)} y1={BOTTOM} y2={BOTTOM + 5} stroke={active ? "#e0bd7a" : "rgba(255,255,255,0.3)"} />
            <text x={xAt(i)} y={BOTTOM + 18} textAnchor="middle" fill={active ? "#ebcf98" : dim ? "rgba(166,163,156,0.35)" : "#a6a39c"} style={mono}>
              {i + 1}
            </text>
          </g>
        );
      })}
      <line x1={X0} x2={X1} y1={BOTTOM} y2={BOTTOM} stroke="rgba(255,255,255,0.18)" />
    </svg>
  );
}
