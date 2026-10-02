"use client";

import { useState } from "react";
import { BRAND, CHAIN, TOKEN, explorerToken, shortAddress } from "@/config/brand";
import { CheckIcon, CopyIcon, GithubIcon, XIcon } from "@/components/icons";

function useCopyCa() {
  const [copied, setCopied] = useState(false);
  const live = TOKEN.isLive;
  const copy = async () => {
    if (!live) return;
    try {
      await navigator.clipboard.writeText(BRAND.ca);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked; the address stays visible to select by hand.
    }
  };
  return { live, copied, copy };
}

/** Compact navbar pill: ticker plus a copy icon. Calm until the CA is published. */
export function NavCaPill() {
  const { live, copied, copy } = useCopyCa();
  return (
    <button
      type="button"
      onClick={copy}
      data-copy-ca="nav"
      title={live ? `Copy ${BRAND.symbol} contract address` : `${BRAND.symbol} contract is published at launch`}
      aria-label={live ? `Copy ${BRAND.symbol} contract address` : `${BRAND.symbol} contract address, published at launch`}
      className={`flex h-9 shrink-0 items-center gap-2 rounded-[8px] border border-white/[0.12] bg-white/[0.02] px-2.5 text-ink transition-colors hover:border-white/25 ${live ? "" : "cursor-default"}`}
    >
      <span className="metal-text font-mono text-[11px] font-medium tracking-[0.04em]">
        <span className="sm:hidden">CA</span>
        <span className="hidden sm:inline">{BRAND.symbol}</span>
      </span>
      <span className="hidden font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-3 2xl:inline">
        {live ? shortAddress(BRAND.ca, 4, 4) : "CA at launch"}
      </span>
      {copied ? <CheckIcon className="size-3.5 text-settle" /> : <CopyIcon className={`size-3.5 ${live ? "text-ink-2" : "text-ink-3 opacity-60"}`} />}
    </button>
  );
}

/** Full address with a copy button, like a receipt line. */
export function CaStrip() {
  const { live, copied, copy } = useCopyCa();
  return (
    <div className="flex max-w-full items-center gap-3 rounded-[10px] border border-white/[0.1] bg-white/[0.02] px-3 py-2.5">
      <span className="metal-text shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.08em]">{BRAND.symbol} CA</span>
      <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-ink">{live ? BRAND.ca : "Published at launch"}</span>
      <button
        type="button"
        onClick={copy}
        disabled={!live}
        data-copy-ca="strip"
        className="shrink-0 rounded-[6px] border border-white/[0.12] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-2 transition-colors hover:text-ink disabled:opacity-40"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

/** Token contract block for the footer. */
export function CaBlock() {
  const { live, copied, copy } = useCopyCa();
  return (
    <div className="w-full max-w-[400px]">
      <p className="label">{BRAND.symbol} contract · {CHAIN.name}</p>
      <div className="mt-3 flex items-center gap-2 rounded-[10px] border border-white/[0.1] bg-g2 p-1.5 pl-3.5">
        <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-ink" data-ca-text>
          {live ? shortAddress(BRAND.ca, 10, 8) : "Published at launch"}
        </span>
        <button
          type="button"
          onClick={copy}
          disabled={!live}
          data-copy-ca="footer"
          aria-label="Copy contract address"
          className="grid size-9 place-items-center rounded-[8px] border border-white/[0.1] text-ink transition-colors hover:border-metal disabled:opacity-40"
        >
          {copied ? <CheckIcon className="size-4 text-settle" /> : <CopyIcon className="size-4" />}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-5 text-[14px] text-ink-2">
        {live && (
          <a href={explorerToken(BRAND.ca)} target="_blank" rel="noreferrer" className="hover:text-ink">
            Explorer
          </a>
        )}
        <a href={BRAND.x} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-ink">
          <XIcon className="size-4" /> {BRAND.xHandle}
        </a>
        {BRAND.github && (
          <a href={BRAND.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-ink">
            <GithubIcon className="size-4" /> GitHub
          </a>
        )}
      </div>
    </div>
  );
}
