import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_DOCS, DOC_GROUPS, findDoc } from "@/content/docs";
import { DocBlocks, slugify } from "@/components/docs/DocContent";
import { Toc } from "@/components/docs/DocsChrome";
import { ArrowRight } from "@/components/icons";
import { BRAND } from "@/config/brand";
import { RISK_LINE } from "@/components/site/SiteFooter";

type Props = { params: Promise<{ slug?: string[] }> };

export function generateStaticParams() {
  return ALL_DOCS.map((d) => ({ slug: d.slug ? d.slug.split("/") : [] }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = findDoc((slug ?? []).join("/"));
  if (!doc) return {};
  return { title: doc.slug ? doc.title : { absolute: `Docs | ${BRAND.name}` }, description: doc.description };
}

export default async function DocPageRoute({ params }: Props) {
  const { slug } = await params;
  const path = (slug ?? []).join("/");
  const doc = findDoc(path);
  if (!doc) notFound();

  const toc = doc.blocks.filter((b) => b.t === "h2").map((b) => ({ id: (b as { id?: string }).id ?? slugify((b as { text: string }).text), text: (b as { text: string }).text }));
  const index = ALL_DOCS.findIndex((d) => d.slug === doc.slug);
  const prev = index > 0 ? ALL_DOCS[index - 1] : null;
  const next = index < ALL_DOCS.length - 1 ? ALL_DOCS[index + 1] : null;
  const group = DOC_GROUPS.find((g) => g.pages.some((p) => p.slug === doc.slug))?.label;
  const href = (s: string) => (s ? `/docs/${s}` : "/docs");

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_260px]">
      <article className="mx-auto w-full max-w-[820px] px-5 pb-20 pt-12 sm:px-10">
        <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-3">{group}</p>
        <span aria-hidden className="mt-6 block h-px w-6 bg-metal" />
        <h1 className="mt-6 font-display text-[clamp(36px,5vw,52px)] font-medium leading-[1.06] tracking-[-0.01em]">{doc.title}</h1>
        <p className="mt-5 max-w-[640px] text-[18px] leading-[1.6] text-ink-2">{doc.description}</p>

        {doc.slug === "" ? (
          <div className="figure-grid relative mt-10 overflow-hidden rounded-[16px] border border-white/[0.08] p-8 sm:p-10">
            <span aria-hidden className="block h-px w-6 bg-metal" />
            <p className="mt-6 font-display text-[clamp(30px,4vw,44px)] leading-[1.08]">
              Get barriers.
              <br />
              Never get <span className="metal-text">liquidated.</span>
            </p>
            <p className="mt-5 max-w-[560px] text-[16.5px] leading-[1.7] text-ink-2">{BRAND.description}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/app" className="btn btn-metal">
                Open app <ArrowRight />
              </Link>
              <Link href="/docs/concepts/worked-example" className="btn btn-ghost">
                Walk through an example
              </Link>
            </div>
          </div>
        ) : null}

        <div className="mt-12">
          <DocBlocks blocks={doc.blocks} />
        </div>

        <nav aria-label="Pagination" className="mt-16 grid grid-cols-1 gap-3 border-t border-white/[0.06] pt-8 sm:grid-cols-2">
          {prev ? (
            <Link href={href(prev.slug)} className="rounded-[12px] border border-white/[0.08] p-4 transition-colors hover:border-white/20">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">Previous</span>
              <span className="mt-1 block text-[15.5px] text-ink">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={href(next.slug)} className="rounded-[12px] border border-white/[0.08] p-4 text-right transition-colors hover:border-white/20">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">Next</span>
              <span className="mt-1 block text-[15.5px] text-ink">{next.title}</span>
            </Link>
          ) : null}
        </nav>
        <footer className="mt-12 border-t border-white/[0.06] pt-6">
          <p className="text-[12.5px] leading-[1.6] text-ink-3">{RISK_LINE}</p>
          <p className="mt-3 text-[12.5px] text-ink-3">
            © 2026 {BRAND.name} ·{" "}
            <a href={BRAND.x} target="_blank" rel="noreferrer" className="hover:text-ink">
              {BRAND.xHandle}
            </a>
          </p>
        </footer>
      </article>
      <aside className="hidden px-6 pt-14 xl:block">
        <Toc items={toc} />
      </aside>
    </div>
  );
}
