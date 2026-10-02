import type { Metadata } from "next";
import { AnalyticsView } from "@/components/pages/Analytics";

export const metadata: Metadata = { title: "Analytics", description: "Chain state, Chainlink feeds and protocol figures for Get Berrier, read live from Robinhood Chain." };

export default function AnalyticsPage() {
  return (
    <div className="wrap pb-10 pt-32">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
        <div>
          <p className="eyebrow">Protocol analytics</p>
          <h1 className="h-display mt-7 text-[clamp(40px,5.4vw,72px)]">
            Every figure here, <em className="metal-text not-italic">read straight off the chain.</em>
          </h1>
        </div>
        <p className="border-l border-white/[0.08] pl-5 text-[14.5px] leading-[1.65] text-ink-2">
          Chain state and price feeds are live reads. Protocol figures come from contract views once the contracts are deployed; until then they are marked <span className="font-mono text-ink">LAUNCH</span>, and launch parameters are marked <span className="font-mono text-ink">DESIGN</span>.
        </p>
      </div>
      <AnalyticsView />
    </div>
  );
}
