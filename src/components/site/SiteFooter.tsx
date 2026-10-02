import Link from "next/link";
import { Lockup } from "@/components/Logo";
import { CaBlock } from "@/components/CopyCa";
import { BRAND } from "@/config/brand";
import { FOOTER, PARTNERS } from "@/config/nav";

export const RISK_LINE =
  "Stock Tokens are not offered to US persons. A barrier note can lose value: if the final close sits below the barrier, CARRY holders are paid in stock valued at S0, which can be worth less than what they put in. Nothing on this site is investment advice.";

export function PartnerWordmarks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-8 gap-y-3 ${className}`}>
      {PARTNERS.map((p) => (
        <a key={p.name} href={p.href} target="_blank" rel="noreferrer" className="font-display text-[19px] tracking-[-0.01em] text-ink-2 transition-colors hover:text-ink">
          {p.name}
        </a>
      ))}
    </div>
  );
}

export function SiteFooter({ big = true }: { big?: boolean }) {
  return (
    <footer className="section-rule relative overflow-hidden">
      <div className="wrap pb-10 pt-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Lockup />
          <p className="text-[14px] text-ink-3">{BRAND.slogan}</p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-[1fr_1fr_1fr_1fr_minmax(0,400px)]">
          {FOOTER.map((col) => (
            <div key={col.head}>
              <p className="label">{col.head}</p>
              <ul className="mt-5 grid gap-3.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {"external" in l && l.external ? (
                      <a href={l.href} target="_blank" rel="noreferrer" className="text-[15px] text-ink-2 transition-colors hover:text-ink">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="text-[15px] text-ink-2 transition-colors hover:text-ink">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <CaBlock />
          </div>
        </div>

        <div className="mt-14 border-t border-white/[0.06] pt-8">
          <p className="max-w-[680px] text-[13.5px] leading-[1.6] text-ink-3">{RISK_LINE}</p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
            <p className="text-[13px] text-ink-3">© 2026 {BRAND.name}</p>
            <PartnerWordmarks />
          </div>
        </div>
      </div>
      {big ? (
        <div aria-hidden className="pointer-events-none select-none overflow-hidden">
          <p className="wrap -mb-[0.32em] whitespace-nowrap font-display text-[clamp(84px,19vw,280px)] font-semibold leading-none tracking-[-0.03em] text-white/[0.035]">
            BERRIER
          </p>
        </div>
      ) : null}
    </footer>
  );
}
