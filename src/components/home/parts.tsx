import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { Reveal } from "@/components/ui/Reveal";

export function SectionHead({ eyebrow, title, lead, children, id }: { eyebrow: string; title: React.ReactNode; lead?: React.ReactNode; children?: React.ReactNode; id?: string }) {
  return (
    <Reveal className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
      <div>
        <p className="eyebrow" id={id}>
          {eyebrow}
        </p>
        <h2 className="h2 mt-7 max-w-[640px]">{title}</h2>
      </div>
      {lead || children ? (
        <div className="lg:pt-14">
          {lead ? <p className="lead max-w-[480px]">{lead}</p> : null}
          {children}
        </div>
      ) : null}
    </Reveal>
  );
}

export function LinkArrow({ href, children, external = false }: { href: string; children: React.ReactNode; external?: boolean }) {
  if (external)
    return (
      <a href={href} target="_blank" rel="noreferrer" className="link-arrow">
        {children} <ArrowRight />
      </a>
    );
  return (
    <Link href={href} className="link-arrow">
      {children} <ArrowRight />
    </Link>
  );
}

/** Corner brackets drawn inside figure panels. */
export function Corners() {
  const c = "absolute size-2.5 border-white/25";
  return (
    <>
      <span aria-hidden className={`${c} left-6 top-6 border-l border-t`} />
      <span aria-hidden className={`${c} right-6 top-6 border-r border-t`} />
      <span aria-hidden className={`${c} bottom-6 left-6 border-b border-l`} />
      <span aria-hidden className={`${c} bottom-6 right-6 border-b border-r`} />
    </>
  );
}

export function PreviewTag({ children = "Pre-launch design" }: { children?: React.ReactNode }) {
  return <span className="chip border-dashed !text-[10px]">{children}</span>;
}
