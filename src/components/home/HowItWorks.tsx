"use client";

import { useEffect, useRef, useState } from "react";
import { PathChart, type ChartStep } from "@/components/home/PathChart";
import { Corners, SectionHead } from "@/components/home/parts";

const STEPS: { k: string; title: string; body: string }[] = [
  {
    k: "Strike",
    title: "The opening close fixes S0.",
    body: "When subscriptions close, the official close arrives through Chainlink and sets S0. The autocall level and the barrier are derived from it on the spot and never move again for that series.",
  },
  {
    k: "Observe",
    title: "Every week, one close decides one coupon.",
    body: "On each scheduled close at or above the barrier, the CARRY leg is paid its coupon out of escrow. Nothing else changes hands that week.",
  },
  {
    k: "Autocall",
    title: "Finish at or above the autocall level and it ends early.",
    body: "The note redeems that week: CARRY receives its principal in cash plus the coupon, and GUARD takes its stock back.",
  },
  {
    k: "Maturity",
    title: "Stock is delivered only below the barrier at the end.",
    body: "At the thirteenth close, anything at or above the barrier pays cash. A finish below it hands CARRY the stock, priced at S0. That is the only route to delivery.",
  },
];

export function HowItWorks() {
  const [active, setActive] = useState<ChartStep>(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step) as ChartStep);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const paid = active === 0 ? 0 : active === 1 ? 6 : active === 2 ? 9 : 12;

  return (
    <section className="section-rule py-[var(--section)]" aria-labelledby="how">
      <div className="wrap">
        <SectionHead
          id="how"
          eyebrow="How a note works"
          title="One stock. Thirteen closes. Three lines."
          lead="Every payment a note can make is settled by the official close on a fixed calendar, measured against three levels that are locked at strike."
        />

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative border-l border-white/[0.06]">
            {STEPS.map((s, i) => (
              <div
                key={s.k}
                data-step={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="relative flex flex-col justify-center py-10 pl-8 lg:min-h-[78vh] lg:py-0 lg:pl-10"
              >
                <span aria-hidden className={`absolute -left-px top-1/2 h-12 w-px -translate-y-1/2 transition-colors duration-500 ${active === i ? "bg-metal" : "bg-transparent"}`} />
                <p className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.14em]">
                  <span className="text-metal">0{i + 1}</span>
                  <span className="text-ink-3">{s.k}</span>
                </p>
                <h3 className={`h3 mt-5 max-w-[400px] transition-colors duration-500 ${active === i ? "text-ink" : "text-ink-2"}`}>{s.title}</h3>
                <p className="mt-4 max-w-[440px] text-[15.5px] leading-[1.7] text-ink-2">{s.body}</p>
                <div className="panel figure-grid mt-8 p-4 lg:hidden">
                  <PathChart step={i as ChartStep} compact />
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:block">
            <div className="panel sticky top-[96px] overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 font-mono text-[12px] uppercase tracking-[0.1em]">
                <span>
                  <span className="text-metal">0{active + 1}</span> <span className="text-ink-3">/ 04</span> <span className="ml-2 text-ink">{STEPS[active].k}</span>
                </span>
                <span className="text-ink-3">
                  {active === 3 ? (
                    <>
                      Close <span className="text-ink">13 / 13</span>
                    </>
                  ) : (
                    <>
                      Coupons paid <span className="text-ink">{String(paid).padStart(2, "0")}</span>
                    </>
                  )}
                </span>
              </div>
              <div className="figure-grid relative px-6 pb-6 pt-10">
                <Corners />
                <PathChart step={active} />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">Levels from the NVDA template · illustrative path</p>
              </div>
              <div className="ticks border-t border-white/[0.06]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
