"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Lockup } from "@/components/Logo";
import { NavCaPill } from "@/components/CopyCa";
import { NavWallet } from "@/components/wallet/WalletButton";
import { ArrowRight, ChevronDownIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { PRODUCTS, SITE_NAV } from "@/config/nav";

function UseMenu() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <div ref={root} className="relative hidden xl:block">
      <button type="button" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((v) => !v)} className="btn btn-sm btn-ghost">
        Use Berrier <ChevronDownIcon className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div role="menu" className="absolute right-0 top-[calc(100%+10px)] z-50 w-[300px] animate-pop rounded-[14px] border border-white/[0.12] bg-g2 p-1.5 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.85)]">
          {PRODUCTS.map((p) => (
            <Link key={p.href} role="menuitem" href={p.href} onClick={() => setOpen(false)} className="group flex items-start justify-between gap-3 rounded-[10px] px-3 py-2.5 transition-colors hover:bg-white/[0.05]">
              <span>
                <span className="block text-[15px] font-medium text-ink">{p.label}</span>
                <span className="block text-[13px] text-ink-3">{p.hint}</span>
              </span>
              <ArrowRight className="mt-1 size-4 text-metal opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  return (
    <header className="sticky top-0 z-40 h-16">
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 border-b transition-colors duration-300 ${
          scrolled ? "border-white/[0.08] bg-[rgba(11,11,12,0.78)] backdrop-blur-xl" : "border-transparent bg-transparent"
        }`}
      />
      <div className="wrap flex h-16 items-center gap-3">
        <Lockup compact />
        <nav aria-label="Primary" className="ml-6 hidden items-center gap-5 lg:flex xl:ml-8 xl:gap-7">
          {SITE_NAV.map((item) => {
            const active = pathname !== "/" && item.href.startsWith("/") && !item.href.includes("#") && pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-[14.5px] transition-colors hover:text-ink ${active ? "text-ink after:absolute after:-bottom-[21px] after:left-0 after:right-0 after:h-px after:bg-metal" : "text-ink-2"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex min-w-0 items-center gap-2">
          <NavCaPill />
          <span className="hidden sm:inline-flex">
            <NavWallet />
          </span>
          <span className="inline-flex sm:hidden">
            <NavWallet compact />
          </span>
          <UseMenu />
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenu(true)}
            className="grid size-9 shrink-0 place-items-center rounded-[8px] border border-white/[0.12] text-ink lg:hidden"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {menu
        ? createPortal(
            <div className="fixed inset-0 z-[60] flex flex-col bg-g0/95 backdrop-blur-xl lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
              <div className="wrap flex h-16 items-center justify-between">
                <Lockup />
                <button type="button" aria-label="Close menu" onClick={() => setMenu(false)} className="grid size-9 place-items-center rounded-[8px] border border-white/[0.12]">
                  <CloseIcon />
                </button>
              </div>
              <nav className="wrap flex flex-1 flex-col gap-1 overflow-y-auto pb-10 pt-4" aria-label="Mobile">
                {SITE_NAV.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMenu(false)} className="border-b border-white/[0.06] py-3.5 font-display text-[26px] text-ink">
                    {item.label}
                  </Link>
                ))}
                <p className="label mt-8">Use Berrier</p>
                {PRODUCTS.map((p) => (
                  <Link key={p.href} href={p.href} onClick={() => setMenu(false)} className="flex items-center justify-between py-2.5 text-[16px] text-ink-2">
                    {p.label} <ArrowRight className="size-4 text-metal" />
                  </Link>
                ))}
              </nav>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}
