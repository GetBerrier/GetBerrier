"use client";

import { BACKSTOP, TEMPLATES } from "@/config/protocol";
import { LinkArrow, SectionHead } from "@/components/home/parts";
import { Reveal } from "@/components/ui/Reveal";
import { marketState } from "@/lib/calendar";
import { useLive } from "@/lib/useLive";
import { useNowMs } from "@/lib/useNow";

const MAX = 1.6;

export function useCountdown() {
  const ms = useNowMs();
  if (ms === null) return null;
  const now = new Date(ms);
  const m = marketState(now);
  const s = Math.max(0, Math.floor((m.nextClose.getTime() - now.getTime()) / 1000));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return { ...m, text: `${hh}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}` };
}

export function Backstop() {
  const cd = useCountdown();
  const { data } = useLive();
  return (
    <section className="section-rule py-[var(--section)]" aria-labelledby="backstop">
      <div className="wrap">
        <SectionHead
          id="backstop"
          eyebrow="Backstop"
          title="The buyer of last resort. Capped, public, on-chain."
          lead="A USDG vault that takes the CARRY side only when demand for protection outruns demand for coupons, never below a set minimum per stock, inside caps per stock and in total. Each position it holds is a public token."
        >
          <div className="mt-8">
            <LinkArrow href="/app/desk">See the Backstop in the app</LinkArrow>
          </div>
        </SectionHead>

        <Reveal className="panel mt-16 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-6 py-4 font-mono text-[12px] uppercase tracking-[0.1em]">
            <span className="text-ink">
              Backstop board <span className="mx-3 text-ink-3">|</span>
              <span className="text-ink-3">Standing templates</span>
            </span>
            <span className="text-ink-3">Design for launch</span>
          </div>
          <div className="ticks border-b border-white/[0.06]" />
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="scroll-x">
              <table className="w-full min-w-[720px] text-left">
                <caption className="sr-only">Backstop board, standing templates for launch</caption>
                <thead>
                  <tr className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-3">
                    <th className="px-6 pb-3 pt-5 font-normal">Underlying</th>
                    <th className="px-3 pb-3 pt-5 text-right font-normal">Autocall</th>
                    <th className="px-3 pb-3 pt-5 text-right font-normal">Barrier</th>
                    <th className="w-[38%] px-6 pb-3 pt-5 font-normal">
                      <span className="flex justify-between">
                        <span>Coupon band</span>
                        <span>% / wk</span>
                      </span>
                      <span className="mt-2 flex justify-between text-[10.5px]">
                        {[0, 0.4, 0.8, 1.2, 1.6].map((v) => (
                          <span key={v}>{v.toFixed(2)}</span>
                        ))}
                      </span>
                    </th>
                    <th className="px-6 pb-3 pt-5 text-right font-normal">Backstop min</th>
                  </tr>
                </thead>
                <tbody>
                  {TEMPLATES.map((t, i) => (
                    <tr key={t.ticker} className="border-t border-white/[0.06]">
                      <td className="px-6 py-3.5">
                        <span className="font-mono text-[12px] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                        <span className="ml-3 text-[15px] text-ink">{t.ticker}</span>
                      </td>
                      <td className="num px-3 py-3.5 text-right text-[13px]">{t.autocall}%</td>
                      <td className="num px-3 py-3.5 text-right text-[13px]">{t.barrier}%</td>
                      <td className="px-6 py-3.5">
                        <div className="relative h-[3px] rounded bg-white/[0.07]">
                          <div
                            className="absolute inset-y-0 rounded bg-[linear-gradient(90deg,#a8854a,#ebcf98)]"
                            style={{ left: `${(t.band[0] / MAX) * 100}%`, width: `${((t.band[1] - t.band[0]) / MAX) * 100}%` }}
                          />
                          <div className="absolute -top-[5px] h-[13px] w-px bg-ink" style={{ left: `${(t.backstopMin / MAX) * 100}%` }} />
                        </div>
                        <p className="num mt-1.5 text-right text-[11px] text-ink-3">
                          {t.band[0].toFixed(2)} to {t.band[1].toFixed(2)}
                        </p>
                      </td>
                      <td className="num px-6 py-3.5 text-right text-[13px]">{t.backstopMin.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-white/[0.06] px-6 py-4 text-[12.5px] leading-[1.6] text-ink-3">
                Launch design, not deployed yet. The band is the weekly coupon range a series can discover; the tick marks the Backstop minimum, the lowest coupon it will accept.
              </p>
            </div>
            <aside className="border-t border-white/[0.06] p-6 lg:border-l lg:border-t-0">
              <div className="flex items-center justify-between">
                <p className="label">On chain</p>
                <span className="chip">{data?.facts.ok ? "Chain live" : "Reading"}</span>
              </div>
              <dl className="mt-2">
                <div className="border-b border-white/[0.06] py-5">
                  <dt className="label !text-[11px]">Series to date</dt>
                  <dd className="mt-3 flex items-baseline gap-3">
                    <span className="num text-[28px] text-ink-2">0</span>
                    <span className="mono-label">contracts at launch</span>
                  </dd>
                </div>
                <div className="border-b border-white/[0.06] py-5">
                  <dt className="label !text-[11px]">Standing caps</dt>
                  <dd className="mt-3 flex items-baseline gap-3">
                    <span className="num text-[28px]">{BACKSTOP.totalCap}%</span>
                    <span className="mono-label">
                      total · {BACKSTOP.perUnderlying}% per stock · {BACKSTOP.perSeries}% per series
                    </span>
                  </dd>
                </div>
                <div className="py-5">
                  <dt className="label !text-[11px]">Next official close</dt>
                  <dd className="mt-3 flex items-baseline gap-3">
                    <span className="num text-[28px]" data-countdown>
                      {cd ? cd.text : "--"}
                    </span>
                    <span className="mono-label">h:m:s</span>
                  </dd>
                  <p className="mt-2 text-[12.5px] text-ink-3">US session calendar, 16:00 New York</p>
                </div>
              </dl>
              <p className="text-[12.5px] leading-[1.6] text-ink-3">
                {data?.facts.block ? `Robinhood Chain block ${data.facts.block.toLocaleString("en-US")} read live. ` : ""}
                Series counts and caps switch to contract reads once BarrierCore and BackstopPolicy are deployed.
              </p>
            </aside>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
