import Link from "next/link";

/**
 * The Get Berrier mark: the owner's gold hexagonal "G", served as a trimmed
 * transparent webp (public/brand/mark.webp, 373 x 430 artwork plus 2% margin).
 * `size` is the rendered height in pixels.
 */
export function Mark({ size = 24, className = "" }: { size?: number; className?: string }) {
  const width = Math.round(size * 0.871);
  return <img src="/brand/mark.webp" alt="" aria-hidden width={width} height={size} className={`shrink-0 select-none ${className}`} style={{ width, height: size }} draggable={false} />;
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
