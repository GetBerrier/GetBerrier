import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { CaStrip } from "@/components/CopyCa";
import { HeroScene } from "@/components/home/HeroScene";
import { SCHEDULE } from "@/config/protocol";

export function Hero() {
  const stats = [
    { n: String(SCHEDULE.templates), l: "standing templates" },
    { n: String(SCHEDULE.closes), l: "closes per series" },
    { n: String(SCHEDULE.coupons), l: "weekly coupons" },
    { n: "Fresh series", l: "each trading day" },
  ];
  return (
    <section className="relative isolate overflow-hidden pt-16">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_72%_38%,rgba(203,168,106,0.10),transparent_70%)]" />
        <div className="absolute inset-y-0 right-0 w-full opacity-90 lg:w-[72%]">
          <HeroScene />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#0b0b0c_0%,rgba(11,11,12,0.86)_34%,rgba(11,11,12,0.2)_70%,rgba(11,11,12,0.4)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-g0" />
      </div>

      <div className="wrap flex min-h-[calc(100svh-64px)] flex-col justify-center pb-20 pt-24 lg:min-h-[760px]">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11.5px] uppercase tracking-[0.18em] text-ink-2">
          <span className="size-1.5 rounded-full bg-metal shadow-[0_0_12px_rgba(203,168,106,0.8)]" />
          Robinhood Chain
          <span className="text-ink-3">· autocallable barrier notes</span>
        </p>
        <h1 className="h-display mt-8 max-w-[820px] text-[clamp(46px,7.2vw,104px)]">
          Get barriers.
          <br />
          Never get <em className="metal-text not-italic">liquidated.</em>
        </h1>
        <p className="mt-8 max-w-[600px] text-[clamp(18px,17px+0.25vw,21px)] leading-[1.5] text-ink-2">
          Barrier notes on tokenised stocks. Every coupon is escrowed before the first close, every observation reads the official close, and no position can ever be margin-called.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link href="/app" className="btn btn-metal">
            Open app <ArrowRight />
          </Link>
          <Link href="#how" className="btn btn-ghost">
            How a note works
          </Link>
        </div>
        <div className="mt-8 w-full max-w-[520px]">
          <CaStrip />
        </div>
      </div>

      <div className="section-rule">
        <div className="wrap grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.l}
              className={`flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 border-white/[0.06] px-3 py-6 text-center font-mono text-[12.5px] text-ink-3 ${
                i % 2 === 1 ? "border-l" : ""
              } ${i > 1 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
            >
              <span className="text-[14px] font-medium text-ink">{s.n}</span>
              <span>{s.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
