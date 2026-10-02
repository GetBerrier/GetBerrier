"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Mark, Wordmark } from "@/components/Logo";
import { NavCaPill } from "@/components/CopyCa";
import { NavWallet } from "@/components/wallet/WalletButton";
import { useLocalStore } from "@/components/wallet/useLocalStore";
import {
  ArrowRight,
  ArrowUpRight,
  BackstopGlyph,
  BondGlyph,
  BuybackGlyph,
  ChevronDownIcon,
  ChevronLeftIcon,
  CloseIcon,
  DocGlyph,
  GovernanceGlyph,
  MenuIcon,
  NotesGlyph,
  PortfolioGlyph,
  ShieldGlyph,
  StakeGlyph,
} from "@/components/icons";
import { APP_NAV, PRODUCTS } from "@/config/nav";
import { BRAND, CHAIN } from "@/config/brand";
import { RISK_LINE } from "@/components/site/SiteFooter";

const GLYPH: Record<string, (p: { className?: string }) => React.ReactNode> = {
  notes: NotesGlyph,
  portfolio: PortfolioGlyph,
  backstop: BackstopGlyph,
  stake: StakeGlyph,
  bonds: BondGlyph,
  buyback: BuybackGlyph,
  governance: GovernanceGlyph,
};

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app" || pathname === "/app/notes" || pathname.startsWith("/app/series");
  return pathname === href || pathname.startsWith(href + "/");
}

export function ProductSwitch({ current }: { current: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <div ref={root} className="relative">
      <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="flex h-9 items-center gap-2 rounded-[8px] border border-white/[0.12] bg-white/[0.02] px-3 text-[14px] transition-colors hover:border-white/25">
        <span className="hidden text-ink-3 sm:inline">Use Berrier</span>
        <span className="text-ink">{current}</span>
        <ChevronDownIcon className="size-3.5 text-ink-2" />
      </button>
      {open ? (
        <div role="menu" className="absolute left-0 top-[calc(100%+8px)] z-50 w-[290px] animate-pop rounded-[14px] border border-white/[0.12] bg-g2 p-1.5 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.85)]">
          {PRODUCTS.map((p) => (
            <Link key={p.href} role="menuitem" href={p.href} onClick={() => setOpen(false)} className={`group flex items-start justify-between gap-3 rounded-[10px] px-3 py-2.5 transition-colors hover:bg-white/[0.05] ${p.label === current ? "bg-white/[0.04]" : ""}`}>
              <span>
                <span className="block text-[14.5px] text-ink">{p.label}</span>
                <span className="block text-[12.5px] text-ink-3">{p.hint}</span>
              </span>
              <ArrowRight className="mt-1 size-4 text-metal opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TopRight() {
  return (
    <div className="ml-auto flex min-w-0 items-center gap-2">
      <span className="chip hidden !normal-case md:inline-flex">
        <span className="size-1.5 rounded-full bg-settle" />
        <span className="uppercase">{CHAIN.name}</span>
      </span>
      <span className="chip hidden !border-metal/40 !text-metal xl:inline-flex">
        <span className="size-1.5 rounded-full bg-metal" /> Pre-launch
      </span>
      <NavCaPill />
      <span className="hidden sm:inline-flex">
        <NavWallet />
      </span>
      <span className="inline-flex sm:hidden">
        <NavWallet compact />
      </span>
    </div>
  );
}

export function LaunchBanner() {
  const [hidden, setHidden] = useLocalStore<boolean>("getberrier.banner", false);
  if (hidden) return null;
  return (
    <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-white/[0.06] py-3">
      <span className="chip !border-metal/40 !text-metal">
        <span className="size-1.5 rounded-full bg-metal" /> Pre-launch
      </span>
      <p className="order-last min-w-0 basis-full text-[13.5px] text-ink-2 sm:order-none sm:basis-0 sm:flex-1">Protocol contracts deploy at launch. Until then, chain and price reads are live and everything else shows the launch design.</p>
      <Link href="/docs/developers/addresses" className="ml-auto inline-flex items-center gap-1 text-[13.5px] text-ink-2 hover:text-ink sm:ml-0">
        Addresses <ArrowUpRight />
      </Link>
      <button type="button" aria-label="Dismiss" onClick={() => setHidden(true)} className="grid size-7 place-items-center rounded-md text-ink-3 hover:text-ink">
        <CloseIcon className="size-3.5" />
      </button>
    </div>
  );
}

export function AppFooter({ partners = ["Robinhood Chain", "Chainlink"] }: { partners?: string[] }) {
  return (
    <footer className="mt-20 border-t border-white/[0.06] pt-8 pb-10">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="label">Powered by</span>
        {partners.map((p) => (
          <span key={p} className="font-display text-[17px] text-ink-2">
            {p}
          </span>
        ))}
      </div>
      <p className="mt-5 max-w-[760px] text-[12.5px] leading-[1.6] text-ink-3">{RISK_LINE}</p>
      <p className="mt-3 font-mono text-[11px] text-ink-3">
        {BRAND.domain} · BarrierCore published at launch · chain id {CHAIN.id}
      </p>
    </footer>
  );
}

function SidebarNav({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const item = (active: boolean) =>
    `relative flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-[15px] transition-colors ${active ? "bg-white/[0.04] text-ink before:absolute before:-left-3 before:top-1/2 before:h-6 before:w-[2px] before:-translate-y-1/2 before:bg-metal" : "text-ink-2 hover:bg-white/[0.03] hover:text-ink"}`;
  return (
    <nav aria-label="App" className="flex flex-col gap-1 px-3 py-5">
      {APP_NAV.map((n) => {
        const Icon = GLYPH[n.icon];
        const active = isActive(pathname, n.href);
        return (
          <Link key={n.href} href={n.href} onClick={onNavigate} aria-current={active ? "page" : undefined} title={collapsed ? n.label : undefined} className={item(active)}>
            <Icon className={`size-[18px] shrink-0 ${active ? "text-metal" : ""}`} />
            {collapsed ? null : <span>{n.label}</span>}
          </Link>
        );
      })}
      <div className="my-3 border-t border-white/[0.06]" />
      <Link href="/docs" onClick={onNavigate} className={item(false)} title={collapsed ? "Docs" : undefined}>
        <DocGlyph className="size-[18px] shrink-0" />
        {collapsed ? null : (
          <span className="flex items-center gap-1">
            Docs <ArrowUpRight className="size-3" />
          </span>
        )}
      </Link>
      <Link href="/docs/security/bug-bounty" onClick={onNavigate} className={item(false)} title={collapsed ? "Security" : undefined}>
        <ShieldGlyph className="size-[18px] shrink-0" />
        {collapsed ? null : (
          <span className="flex items-center gap-1">
            Security <ArrowUpRight className="size-3" />
          </span>
        )}
      </Link>
    </nav>
  );
}

/** Shell for /app: sidebar on desktop, drawer on phones, product switch and wallet up top. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useLocalStore<boolean>("getberrier.sidebar", false);
  const [drawer, setDrawer] = useState(false);

  return (
    <div className="min-h-screen lg:flex">
      <aside className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-white/[0.06] bg-g1 lg:flex ${collapsed ? "w-[72px]" : "w-[232px]"}`}>
        <div className="flex h-16 items-center border-b border-white/[0.06] px-5">
          <Link href="/" className="flex items-center gap-2.5" aria-label={`${BRAND.name} home`}>
            <Mark size={24} />
            {collapsed ? null : <Wordmark />}
          </Link>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <SidebarNav collapsed={collapsed} />
        </div>
        <button type="button" onClick={() => setCollapsed(!collapsed)} className="flex items-center gap-2 border-t border-white/[0.06] px-5 py-4 text-[14px] text-ink-3 transition-colors hover:text-ink">
          <ChevronLeftIcon className={`size-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          {collapsed ? null : "Collapse"}
        </button>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[rgba(11,11,12,0.82)] backdrop-blur-xl">
          <div className="flex h-16 items-center gap-2 px-4 sm:px-6 lg:px-10">
            <button type="button" aria-label="Open navigation" onClick={() => setDrawer(true)} className="grid size-9 shrink-0 place-items-center rounded-[8px] border border-white/[0.12] lg:hidden">
              <MenuIcon />
            </button>
            <Link href="/" className="lg:hidden" aria-label={`${BRAND.name} home`}>
              <Mark size={24} />
            </Link>
            <span className="hidden sm:inline-flex">
              <ProductSwitch current="Notes" />
            </span>
            <TopRight />
          </div>
        </header>
        <main id="main" className="mx-auto w-full max-w-[1240px] px-4 pt-6 sm:px-6 lg:px-10">
          <LaunchBanner />
          {children}
          <AppFooter />
        </main>
      </div>

      {drawer
        ? createPortal(
            <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
              <button type="button" aria-label="Close" className="absolute inset-0 animate-fade bg-black/70" onClick={() => setDrawer(false)} />
              <div className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] animate-pop flex-col border-r border-white/[0.08] bg-g1">
                <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
                  <Link href="/" className="flex items-center gap-2.5" onClick={() => setDrawer(false)}>
                    <Mark size={24} />
                    <Wordmark />
                  </Link>
                  <button type="button" aria-label="Close" onClick={() => setDrawer(false)} className="grid size-8 place-items-center rounded-md border border-white/[0.1]">
                    <CloseIcon className="size-3.5" />
                  </button>
                </div>
                <div className="overflow-y-auto">
                  <SidebarNav collapsed={false} onNavigate={() => setDrawer(false)} />
                  <div className="px-6 pb-6">
                    <p className="label">Use Berrier</p>
                    {PRODUCTS.map((p) => (
                      <Link key={p.href} href={p.href} onClick={() => setDrawer(false)} className="mt-2 flex items-center justify-between py-1.5 text-[15px] text-ink-2">
                        {p.label} <ArrowRight className="size-4 text-metal" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

/** Lighter shell for Credit and Omni: one top bar, centred content. */
export function ProductShell({ current, partners, children }: { current: string; partners: string[]; children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[rgba(11,11,12,0.82)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5" aria-label={`${BRAND.name} home`}>
            <Mark size={24} />
            <span className="hidden md:inline">
              <Wordmark />
            </span>
          </Link>
          <ProductSwitch current={current} />
          <Link href="/docs" className="hidden text-[14px] text-ink-2 hover:text-ink sm:inline">
            Docs
          </Link>
          <TopRight />
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-[1240px] px-4 pt-6 sm:px-6 lg:px-10">
        <LaunchBanner />
        {children}
        <AppFooter partners={partners} />
      </main>
    </div>
  );
}
