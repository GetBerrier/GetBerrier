import { TEMPLATES, stockLogo } from "@/config/protocol";

export function StockLogo({ ticker, size = 36 }: { ticker: string; size?: number }) {
  return (
    <span className="grid shrink-0 place-items-center rounded-full border border-white/[0.08] bg-g3" style={{ width: size, height: size }}>
      <img src={stockLogo(ticker)} alt="" width={size * 0.6} height={size * 0.6} style={{ width: size * 0.6, height: size * 0.6 }} />
    </span>
  );
}

export function TemplatesStrip() {
  const items = [...TEMPLATES, ...TEMPLATES];
  return (
    <section aria-label="Standing templates" className="section-rule">
      <div className="relative flex border-b border-white/[0.06]">
        <div className="relative z-10 hidden shrink-0 flex-col justify-center border-r border-white/[0.06] bg-g0 py-5 pl-[max(var(--gutter),calc((100%-var(--max))/2))] pr-8 sm:flex sm:w-[min(32vw,352px)]">
          <p className="label">Standing templates</p>
          <p className="mt-1.5 font-mono text-[12px] text-ink-3">Design for launch</p>
        </div>
        <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
          <ul className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {items.map((t, i) => (
              <li key={`${t.ticker}-${i}`} aria-hidden={i >= TEMPLATES.length} className="flex items-center gap-4 border-r border-white/[0.06] px-6 py-5">
                <StockLogo ticker={t.ticker} />
                <span className="text-[15px] text-ink">{t.ticker}</span>
                <span className="font-mono text-[12px] leading-[1.6] text-ink-3">
                  AC <span className="text-ink">{t.autocall}%</span> <span className="opacity-40">|</span> B <span className="text-ink">{t.barrier}%</span>
                  <br />
                  <span className="text-ink">
                    {t.band[0].toFixed(2)} to {t.band[1].toFixed(2)}%
                  </span>{" "}
                  / wk
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="wrap py-4">
        <p className="max-w-[560px] text-[13px] leading-[1.6] text-ink-3">
          Twelve weekly coupons and thirteen closes per series, with a fresh series opened every trading day. Each series discovers its coupon inside the band when subscriptions close.
        </p>
      </div>
    </section>
  );
}
