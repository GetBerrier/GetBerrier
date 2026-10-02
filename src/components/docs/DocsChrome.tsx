"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Lockup } from "@/components/Logo";
import { NavCaPill } from "@/components/CopyCa";
import { NavWallet } from "@/components/wallet/WalletButton";
import { ArrowRight, ChevronDownIcon, CloseIcon, MenuIcon } from "@/components/icons";

export type NavGroup = { label: string; pages: { slug: string; title: string }[] };

const href = (slug: string) => (slug ? `/docs/${slug}` : "/docs");

function Sidebar({ groups, onNavigate }: { groups: NavGroup[]; onNavigate?: () => void }) {
  const pathname = usePathname().replace(/\/$/, "");
  return (
    <nav aria-label="Docs" className="grid gap-5 px-5 py-6">
      {groups.map((g) => (
        <details key={g.label} open className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between py-1 font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-3 [&::-webkit-details-marker]:hidden">
            {g.label}
            <ChevronDownIcon className="size-3 transition-transform group-open:rotate-0 -rotate-90" />
          </summary>
          <ul className="mt-2 grid gap-0.5 border-l border-white/[0.06]">
            {g.pages.map((p) => {
              const active = pathname === href(p.slug);
              return (
                <li key={p.slug}>
                  <Link
                    href={href(p.slug)}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`relative block py-1.5 pl-4 text-[14.5px] transition-colors ${active ? "bg-white/[0.03] text-ink before:absolute before:-left-px before:inset-y-1 before:w-[2px] before:bg-metal" : "text-ink-2 hover:text-ink"}`}
                  >
                    {p.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </details>
      ))}
      <Link href="/app" onClick={onNavigate} className="link-arrow mt-2 text-[14.5px]">
        Open app <ArrowRight />
      </Link>
    </nav>
  );
}

export function DocsChrome({ groups, children }: { groups: NavGroup[]; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[rgba(11,11,12,0.86)] backdrop-blur-xl">
        <div className="flex h-16 items-center gap-2 px-4 sm:px-6">
          <button type="button" aria-label="Open docs menu" onClick={() => setOpen(true)} className="grid size-9 shrink-0 place-items-center rounded-[8px] border border-white/[0.12] lg:hidden">
            <MenuIcon />
          </button>
          <Lockup href="/docs" suffix="Docs" compact />
          <div className="ml-auto flex items-center gap-2">
            <Link href="/" className="hidden px-2 text-[14.5px] text-ink-2 hover:text-ink md:inline">
              Home
            </Link>
            <Link href="/app" className="btn btn-sm btn-metal hidden md:inline-flex">
              Open app <ArrowRight />
            </Link>
            <NavCaPill />
            <NavWallet compact />
          </div>
        </div>
      </header>
      <div className="lg:grid lg:grid-cols-[272px_minmax(0,1fr)]">
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] overflow-y-auto border-r border-white/[0.06] lg:block">
          <Sidebar groups={groups} />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
      {open
        ? createPortal(
            <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Docs menu">
              <button type="button" aria-label="Close" className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
              <div className="absolute inset-y-0 left-0 w-[300px] max-w-[88vw] animate-pop overflow-y-auto border-r border-white/[0.08] bg-g1">
                <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
                  <span className="label">Docs</span>
                  <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="grid size-8 place-items-center rounded-md border border-white/[0.1]">
                    <CloseIcon className="size-3.5" />
                  </button>
                </div>
                <Sidebar groups={groups} onNavigate={() => setOpen(false)} />
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

export function Toc({ items }: { items: { id: string; text: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-80px 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);
  if (!items.length) return null;
  return (
    <nav aria-label="On this page" className="sticky top-24">
      <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-3">On this page</p>
      <ul className="mt-4 grid gap-2.5 border-l border-white/[0.08]">
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} className={`relative block pl-4 font-mono text-[12px] leading-[1.45] transition-colors ${active === i.id ? "text-ink before:absolute before:-left-px before:top-[0.6em] before:h-px before:w-2.5 before:bg-metal" : "text-ink-3 hover:text-ink-2"}`}>
              {i.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
