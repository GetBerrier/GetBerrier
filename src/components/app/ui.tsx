import Link from "next/link";
import { InfoIcon } from "@/components/icons";

/* Shared building blocks for the app surfaces (Notes, Backstop, Stake, Credit…). */

export function PageHead({ eyebrow, title, right, children }: { eyebrow: string; title: string; right?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="mb-8">
      <p className="eyebrow !text-[11.5px]">{eyebrow}</p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-[clamp(38px,5vw,52px)] font-medium leading-[1.05] tracking-[-0.01em]">{title}</h1>
        {right ? <div className="flex flex-wrap items-center gap-2 pb-1">{right}</div> : null}
      </div>
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}

export type Stat = { label: string; value: React.ReactNode; unit?: string; sub?: React.ReactNode; tone?: "up" | "down" | "muted" };

export function StatStrip({ stats }: { stats: Stat[] }) {
  const cols = stats.length >= 4 ? "lg:grid-cols-4" : stats.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";
  return (
    <div className={`grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2 ${cols}`}>
      {stats.map((s) => (
        <div key={s.label} className="bg-g2 px-6 py-6">
          <p className="label">{s.label}</p>
          <p className="mt-3 flex items-baseline gap-2">
            <span className="num text-[26px] leading-none text-ink">{s.value}</span>
            {s.unit ? <span className="font-mono text-[11.5px] uppercase text-ink-3">{s.unit}</span> : null}
          </p>
          {s.sub ? (
            <p className={`mt-2.5 text-[13px] ${s.tone === "up" ? "text-settle" : s.tone === "down" ? "text-breach" : "text-ink-3"}`}>{s.sub}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function Panel({ title, right, children, className = "", bodyClass = "p-6" }: { title?: React.ReactNode; right?: React.ReactNode; children: React.ReactNode; className?: string; bodyClass?: string }) {
  return (
    <section className={`overflow-hidden rounded-[14px] border border-white/[0.08] bg-g2 ${className}`}>
      {title ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-6 py-4">
          <h2 className="label !text-[12px] !text-ink-2">{title}</h2>
          {right ? <div className="text-[13px] text-ink-3">{right}</div> : null}
        </div>
      ) : null}
      <div className={bodyClass}>{children}</div>
    </section>
  );
}

export function Row({ k, v, hint }: { k: React.ReactNode; v: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] py-3 last:border-b-0">
      <span className="flex items-center gap-1.5 text-[14px] text-ink-2">
        {k}
        {hint ? (
          <span title={hint} className="text-ink-3">
            <InfoIcon />
          </span>
        ) : null}
      </span>
      <span className="num text-right text-[13px] text-ink">{v}</span>
    </div>
  );
}

export function Empty({ title, body, children }: { title: string; body: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full border border-white/[0.1] bg-g3">
        <span className="size-2 rounded-full bg-metal/70" />
      </span>
      <p className="mt-5 font-display text-[22px]">{title}</p>
      <p className="mt-2 max-w-[440px] text-[14.5px] leading-[1.6] text-ink-2">{body}</p>
      {children ? <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div> : null}
    </div>
  );
}

export function Tabs({ items, active, onChange }: { items: string[]; active: string; onChange: (v: string) => void }) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-white/[0.08]">
      {items.map((it) => (
        <button
          key={it}
          role="tab"
          type="button"
          aria-selected={active === it}
          onClick={() => onChange(it)}
          className={`relative px-4 py-2.5 text-[14.5px] transition-colors ${active === it ? "text-ink after:absolute after:inset-x-2 after:-bottom-px after:h-px after:bg-metal" : "text-ink-3 hover:text-ink-2"}`}
        >
          {it}
        </button>
      ))}
    </div>
  );
}

export function LinkTabs({ items, active }: { items: { href: string; label: string }[]; active: string }) {
  return (
    <nav className="scroll-x flex gap-1 border-b border-white/[0.08]" aria-label="Section">
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          aria-current={active === it.href ? "page" : undefined}
          className={`relative whitespace-nowrap px-4 py-2.5 text-[14.5px] transition-colors ${active === it.href ? "text-ink after:absolute after:inset-x-2 after:-bottom-px after:h-px after:bg-metal" : "text-ink-3 hover:text-ink-2"}`}
        >
          {it.label}
        </Link>
      ))}
    </nav>
  );
}

export function Notice({ children }: { children: React.ReactNode }) {
  return <p className="mt-6 max-w-[860px] text-[13px] leading-[1.6] text-ink-3">{children}</p>;
}

export function AmountField({ label, unit, balance, disabled = true }: { label: string; unit: string; balance: React.ReactNode; disabled?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="label">{label}</span>
        <span className="font-mono text-[11.5px] text-ink-3">{balance}</span>
      </div>
      <div className="mt-2.5 flex items-center gap-2 rounded-[10px] border border-white/[0.1] bg-g1 px-4 py-3.5">
        <input inputMode="decimal" placeholder="0.00" disabled={disabled} aria-label={`${label} in ${unit}`} className="num min-w-0 flex-1 bg-transparent text-right text-[18px] text-ink outline-none placeholder:text-ink-3 disabled:cursor-not-allowed" />
        <span className="font-mono text-[11.5px] uppercase text-ink-3">{unit}</span>
      </div>
    </div>
  );
}

export function LaunchChip() {
  return (
    <span className="chip !border-metal/40 !text-metal">
      <span className="size-1.5 rounded-full bg-metal" /> Pre-launch
    </span>
  );
}
