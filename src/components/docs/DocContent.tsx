import Link from "next/link";
import type { DocBlock } from "@/content/docs";

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[`*]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Inline markup: **bold**, `code` and [label](href). */
export function Inline({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) out.push(<strong key={i++} className="font-semibold text-ink">{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("`")) out.push(<code key={i++} className="break-words rounded-[5px] border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[0.86em] text-ink">{tok.slice(1, -1)}</code>);
    else {
      const label = tok.slice(1, tok.indexOf("]("));
      const href = tok.slice(tok.indexOf("](") + 2, -1);
      out.push(
        href.startsWith("/") ? (
          <Link key={i++} href={href} className="text-metal-light underline decoration-metal/40 underline-offset-[3px] hover:decoration-metal">
            {label}
          </Link>
        ) : (
          <a key={i++} href={href} target="_blank" rel="noreferrer" className="text-metal-light underline decoration-metal/40 underline-offset-[3px] hover:decoration-metal">
            {label}
          </a>
        ),
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

const TONE = {
  note: { border: "border-cool/40", label: "text-cool", name: "Note" },
  tip: { border: "border-settle/40", label: "text-settle", name: "Tip" },
  caution: { border: "border-metal/50", label: "text-metal", name: "Caution" },
};

export function DocBlocks({ blocks }: { blocks: DocBlock[] }) {
  return (
    <div className="doc-body">
      {blocks.map((b, i) => {
        switch (b.t) {
          case "p":
            return (
              <p key={i} className="mt-5 text-[16.5px] leading-[1.75] text-ink-2">
                <Inline text={b.text} />
              </p>
            );
          case "h2": {
            const id = b.id ?? slugify(b.text);
            return (
              <h2 key={i} id={id} className="mt-14 scroll-mt-24 border-t border-white/[0.06] pt-10 font-display text-[30px] font-medium leading-[1.15] first:mt-0 first:border-t-0 first:pt-0">
                {b.text}
              </h2>
            );
          }
          case "h3":
            return (
              <h3 key={i} className="mt-9 font-display text-[21px] font-medium">
                {b.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="mt-5 grid gap-2.5 pl-1">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-3 text-[16px] leading-[1.7] text-ink-2">
                    <span className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-metal/70" />
                    <span>
                      <Inline text={it} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="mt-5 grid gap-2.5">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-3 text-[16px] leading-[1.7] text-ink-2">
                    <span className="num mt-[0.15em] shrink-0 text-[13px] text-metal">{String(j + 1).padStart(2, "0")}</span>
                    <span>
                      <Inline text={it} />
                    </span>
                  </li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={i} className="scroll-x mt-6 rounded-[12px] border border-white/[0.08]">
                <table className="w-full text-left text-[14px]">
                  <thead className="bg-white/[0.03] font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                    <tr>
                      {b.head.map((h) => (
                        <th key={h} className="whitespace-nowrap px-4 py-3 font-normal">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j} className="border-t border-white/[0.06] align-top">
                        {r.map((c, k) => (
                          <td key={k} className={`px-4 py-3 leading-[1.55] ${k === 0 ? "text-ink" : "text-ink-2"}`}>
                            <Inline text={c} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "code":
            return (
              <figure key={i} className="mt-6 overflow-hidden rounded-[12px] border border-white/[0.08] bg-[#0d0d0f]">
                <figcaption className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                  <span>{b.title ?? b.lang}</span>
                  <span>{b.lang}</span>
                </figcaption>
                <pre className="scroll-x p-4 font-mono text-[13px] leading-[1.7] text-ink">
                  <code>{b.code}</code>
                </pre>
              </figure>
            );
          case "callout": {
            const tone = TONE[b.tone];
            return (
              <aside key={i} className={`mt-6 rounded-[12px] border ${tone.border} bg-white/[0.02] px-5 py-4`}>
                <p className={`font-mono text-[11px] uppercase tracking-[0.1em] ${tone.label}`}>{b.title ?? tone.name}</p>
                <p className="mt-2 text-[15px] leading-[1.7] text-ink-2">
                  <Inline text={b.text} />
                </p>
              </aside>
            );
          }
          case "formula":
            return (
              <div key={i} className="scroll-x mt-6 rounded-[12px] border border-metal/25 bg-metal/[0.04] px-5 py-4 font-mono text-[14px] leading-[1.7] text-metal-hi">
                {b.text}
              </div>
            );
          case "cards":
            return (
              <div key={i} className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-[12px] border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2">
                {b.items.map((c, j) => {
                  const inner = (
                    <>
                      <span className="num text-[12px] text-metal">{String(j + 1).padStart(2, "0")}</span>
                      <span className="mt-2 block font-display text-[20px] text-ink">{c.title}</span>
                      <span className="mt-2 block text-[14.5px] leading-[1.6] text-ink-2">{c.text}</span>
                    </>
                  );
                  return c.href ? (
                    <Link key={j} href={c.href} className="block bg-g2 p-5 transition-colors hover:bg-g3">
                      {inner}
                    </Link>
                  ) : (
                    <div key={j} className="bg-g2 p-5">
                      {inner}
                    </div>
                  );
                })}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
