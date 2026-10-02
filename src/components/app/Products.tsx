"use client";

import Link from "next/link";
import { useState } from "react";
import { CHAIN, explorerAddress, shortAddress } from "@/config/brand";
import { CREDIT } from "@/config/protocol";
import { useWallet } from "@/components/wallet/WalletProvider";
import { ConnectButton } from "@/components/wallet/WalletButton";
import { ArrowUpRight } from "@/components/icons";
import { AmountField, Empty, PageHead, Panel, Row, StatStrip } from "@/components/app/ui";

export const MORPHO_BLUE = "0x9D53d5E3bd5E8d4Cbfa6DB1ca238AEA02E651010";

function AddressRow({ k, address, note }: { k: string; address: string | null; note?: string }) {
  return (
    <div className="border-b border-white/[0.06] py-3.5 last:border-b-0">
      <p className="label !text-[11px]">{k}</p>
      {address ? (
        <a href={explorerAddress(address)} target="_blank" rel="noreferrer" className="mt-1.5 inline-flex items-center gap-1 break-all font-mono text-[12.5px] text-ink hover:text-metal">
          {address} <ArrowUpRight className="size-3 shrink-0" />
        </a>
      ) : (
        <p className="mt-1.5 font-mono text-[12.5px] text-ink-3">Published at launch</p>
      )}
      {note ? <p className="mt-1 text-[12px] text-ink-3">{note}</p> : null}
    </div>
  );
}

function PoweredBy({ name }: { name: string }) {
  return (
    <span className="chip !normal-case !tracking-normal">
      <span className="uppercase tracking-[0.08em] text-ink-3">Powered by</span> <span className="font-display text-[14px] text-ink">{name}</span>
    </span>
  );
}

export function CreditPage() {
  const { address, usdg } = useWallet();
  const [tab, setTab] = useState<"Borrow" | "Supply">("Borrow");
  return (
    <>
      <PageHead eyebrow="Borrow against coupons" title="Credit" right={<PoweredBy name="Morpho" />} />
      <StatStrip
        stats={[
          { label: "Markets", value: "0", sub: "First market at launch" },
          { label: "Supplied", value: "0", unit: "USDG" },
          { label: "Borrowed", value: "0", unit: "USDG" },
          { label: "LLTV", value: `${CREDIT.lltv}%`, sub: "Launch design" },
        ]}
      />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid min-w-0 gap-6">
          <Panel title="Markets" right="USDG against wrapped CARRY legs" bodyClass="p-0">
            <Empty title="No market yet" body="Each live series gets a Morpho market where wrapped CARRY legs are the collateral and USDG is the loan. Markets are created when the first series opens.">
              <Link href="/docs/protocol/credit" className="btn btn-ghost">
                How Credit works
              </Link>
            </Empty>
          </Panel>
          <Panel title="Oracle" right={<span className="chip">Not deployed</span>}>
            <Row k="Source" v="Treasury mark of the leg" />
            <Row k="Cushion above barrier" v="Shown per market" />
            <Row k="Staleness window" v="Set per market" />
            <Row k="On a stale feed" v="Reverts; borrowing closes" />
          </Panel>
        </div>
        <div className="grid gap-6">
          <Panel>
            <div className="flex gap-1 border-b border-white/[0.08]">
              {(["Borrow", "Supply"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setTab(t)} className={`relative px-4 py-2.5 text-[14.5px] ${tab === t ? "text-ink after:absolute after:inset-x-2 after:-bottom-px after:h-px after:bg-metal" : "text-ink-3"}`}>
                  {t}
                </button>
              ))}
            </div>
            <p className="mt-5 text-[14px] leading-[1.6] text-ink-2">
              {tab === "Borrow" ? "Post wrapped CARRY legs and draw USDG up to the market's LLTV. Coupons keep accruing to the position." : "Supply USDG to a Credit market and earn the borrow rate."}
            </p>
            <div className="mt-5">
              <AmountField label="Amount" unit={tab === "Borrow" ? "CARRY units" : "USDG"} balance={address ? (tab === "Supply" ? `Balance ${usdg ?? "…"} USDG` : "0 units") : "Balance not connected"} />
            </div>
            {address ? (
              <button type="button" disabled className="btn btn-ghost mt-5 w-full">
                Markets open at launch
              </button>
            ) : (
              <ConnectButton className="btn btn-metal mt-5 w-full" />
            )}
          </Panel>
          <Panel title="Contracts">
            <AddressRow k="Morpho Blue" address={MORPHO_BLUE} note={`Live on ${CHAIN.name}`} />
            <AddressRow k="LegWrap" address={null} />
            <AddressRow k="Market factory" address={null} />
            <AddressRow k="Interest rate model" address={null} />
          </Panel>
        </div>
      </div>
    </>
  );
}

const DESTINATIONS = ["Arbitrum One", "Base", "Ethereum"];

export function OmniPage() {
  const { address } = useWallet();
  const [to, setTo] = useState(DESTINATIONS[0]);
  return (
    <>
      <PageHead eyebrow="Omnichain" title="Legs on other chains" right={<PoweredBy name="LayerZero" />} />
      <StatStrip
        stats={[
          { label: "Route", value: "--", sub: "Opens at launch" },
          { label: "Verifiers", value: "2 of 2", sub: "Required on every message" },
          { label: "Moves", value: "0" },
          { label: "Fee now", value: "--", sub: "Quoted per move" },
        ]}
      />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="grid min-w-0 gap-6">
          <Panel title="Away across the protocol" right="Read from LegVault">
            {address ? (
              <Empty title="No legs away" body={`Legs ${shortAddress(address, 6, 4)} moves to other chains will be listed here, with the coupons waiting for them on return.`} />
            ) : (
              <Empty title="Connect to see your legs" body="See every CARRY and GUARD leg you hold, on each chain.">
                <ConnectButton className="btn btn-metal" />
              </Empty>
            )}
          </Panel>
          <Panel title="Transfers">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[10px] bg-white/[0.06] md:grid-cols-4">
              {[
                ["Transfers shown", "0", "0 out · 0 back"],
                ["Units moved", "0.00", "newest 40 each way"],
                ["Median delivery", "n/a", "0 samples"],
                ["Coupons paid on return", "0.00", "USDG"],
              ].map(([k, v, s]) => (
                <div key={k} className="bg-g2 p-4">
                  <p className="label !text-[10.5px]">{k}</p>
                  <p className="num mt-2 text-[20px]">{v}</p>
                  <p className="mt-1 text-[12px] text-ink-3">{s}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
        <div className="grid gap-6">
          <Panel title="Move">
            <div className="grid gap-3">
              <div className="rounded-[10px] border border-white/[0.1] bg-g1 px-4 py-3">
                <p className="label !text-[10.5px]">From</p>
                <p className="mt-1 text-[15px]">{CHAIN.name}</p>
              </div>
              <label className="rounded-[10px] border border-white/[0.1] bg-g1 px-4 py-3">
                <span className="label !text-[10.5px]">To</span>
                <select value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 block w-full bg-transparent text-[15px] text-ink outline-none">
                  {DESTINATIONS.map((d) => (
                    <option key={d} value={d} className="bg-g2">
                      {d}
                    </option>
                  ))}
                </select>
              </label>
              <AmountField label="Units" unit="Units" balance={address ? "0 units" : "Not connected"} />
              <div className="flex gap-1.5">
                {["25%", "50%", "75%", "Max"].map((p) => (
                  <button key={p} type="button" disabled className="flex-1 rounded-md border border-white/[0.1] py-1.5 font-mono text-[11.5px] text-ink-3">
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <Row k="Recipient" v={address ? shortAddress(address, 6, 4) : "Your connected address"} />
              <Row k="Fee" v="--" />
              <Row k="Verifiers" v="2 of 2 required" />
              <Row k="Estimated delivery" v="A few minutes" />
            </div>
            {address ? (
              <button type="button" disabled className="btn btn-ghost mt-5 w-full">
                Moves open at launch
              </button>
            ) : (
              <ConnectButton className="btn btn-metal mt-5 w-full" />
            )}
          </Panel>
          <Panel title="Contracts">
            <AddressRow k="LegVault" address={null} />
            <AddressRow k={`LegRemote · ${to}`} address={null} />
          </Panel>
        </div>
      </div>
    </>
  );
}
