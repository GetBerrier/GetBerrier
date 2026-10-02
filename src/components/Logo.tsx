import Link from "next/link";

/**
 * The Get Berrier mark: a berry outline with a price path inside, resting on
 * a brushed-gold barrier line that runs past its edges.
 */
export function Mark({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className={`shrink-0 ${className}`}>
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.6 12.3L9.6 8.8L12.2 11.1L16 6.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.5 15.4H22.5" stroke="#d4b273" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`whitespace-nowrap text-[15px] tracking-[-0.005em] ${className}`}>
      <b className="font-semibold text-ink">Get</b> <span className="text-ink-2">Berrier</span>
    </span>
  );
}

export function Lockup({ href = "/", suffix, compact = false }: { href?: string; suffix?: string; compact?: boolean }) {
  return (
    <Link href={href} className="flex shrink-0 items-center gap-2.5 text-ink" aria-label="Get Berrier home">
      <Mark size={24} />
      {compact ? (
        <span className="hidden sm:inline">
          <Wordmark />
        </span>
      ) : (
        <Wordmark />
      )}
      {suffix ? (
        <span className="ml-1 hidden border-l border-white/10 pl-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3 sm:inline">{suffix}</span>
      ) : null}
    </Link>
  );
}
