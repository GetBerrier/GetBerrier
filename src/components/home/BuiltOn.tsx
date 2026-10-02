import { PARTNERS } from "@/config/nav";

export function BuiltOn() {
  const items = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS];
  return (
    <section aria-label="Built on" className="section-rule">
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_5%,black_95%,transparent)]">
        <ul className="flex w-max animate-marquee [animation-duration:80s] hover:[animation-play-state:paused]">
          {items.map((p, i) => (
            <li key={i} aria-hidden={i >= PARTNERS.length} className="flex items-center gap-6 border-r border-white/[0.06] px-10 py-6">
              <a href={p.href} target="_blank" rel="noreferrer" tabIndex={i >= PARTNERS.length ? -1 : 0} className="whitespace-nowrap font-display text-[24px] tracking-[-0.01em] text-ink">
                {p.name}
              </a>
              <span className="h-6 w-px bg-white/10" />
              <span className="whitespace-nowrap text-[14.5px] text-ink-2">{p.line}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="ticks border-y border-white/[0.06]" />
    </section>
  );
}
