import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { Corners, PreviewTag } from "@/components/home/parts";
import { Reveal } from "@/components/ui/Reveal";
import { PartnerWordmarks } from "@/components/site/SiteFooter";
import { BRAND } from "@/config/brand";

export function BuildNav({ active }: { active: "overview" | "sdk" }) {
  return (
    <div className="wrap pt-28">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <nav className="flex gap-6 font-mono text-[12.5px]" aria-label="Build">
          {[
            { k: "overview", n: "01", l: "Overview", href: "/build" },
            { k: "sdk", n: "02", l: "SDK", href: "/build/sdk" },
          ].map((i) => (
            <Link key={i.k} href={i.href} aria-current={active === i.k ? "page" : undefined} className={`flex items-center gap-2 ${active === i.k ? "text-ink" : "text-ink-3 hover:text-ink-2"}`}>
              <span className="text-metal">{i.n}</span> {i.l}
            </Link>
          ))}
        </nav>
        <p className="font-mono text-[12px] text-ink-3">Build / {active === "overview" ? "Overview" : "SDK"}</p>
      </div>
    </div>
  );
}

const STACK = [
  { n: "00", k: "Your product", tag: "Your UI", items: ["Wallet", "Protocol", "Treasury"] },
  { n: "01", k: "Berrier SDK", tag: "TypeScript", items: ["vault.deposit(assets, to, partnerId)"] },
  { n: "02", k: "BerrierVault", tag: "One deposit", items: ["ERC-4626", "Mandate", "Queue"] },
  { n: "03", k: "Berrier protocol", tag: "Escrow", items: ["BarrierCore", "BarrierLegs", "SeriesPolicy"] },
  { n: "04", k: "Robinhood Chain", tag: "Settlement", items: ["Chainlink closes", "USDG"] },
];

const WAYS = [
  { t: "Embed a vault", b: "One ERC-4626 deposit. The vault spreads it across series inside its band, collects coupons and pays redemptions at a single share price.", code: "vault.deposit(assets, to, partnerId)", who: "Wallets, treasuries, savings apps" },
  { t: "Distribute notes", b: "Show live series in your own interface. Users choose a CARRY or GUARD leg and subscribe at the coupon the series discovers.", code: "core.subscribeCarry(seriesId, amount)", who: "Brokers, wallets, structured desks" },
  { t: "Lend against legs", b: "Wrap CARRY legs into ERC-20 collateral and list them in a Credit market. Coupons keep accruing while the leg is pledged.", code: "legWrap.wrap(units, to)", who: "Lending markets, prime brokers" },
];

const START = [
  { k: "Discover", c: "factory.vaults(0, 20)", b: "List vaults from the factory and read each mandate: fees, band, limits." },
  { k: "Quote", c: "vault.previewDeposit(assets)", b: "Preview the shares a deposit buys, or the assets a redemption returns, before anyone signs." },
  { k: "Deposit", c: "vault.deposit(assets, to, partnerId)", b: "Tag the deposit with your partner id. The tag travels with the shares." },
  { k: "Track", c: "vault.requestsOf(owner, 0, 20)", b: "Paged reads for positions, queue and exposure. No indexer needed." },
  { k: "Ship", c: "/docs/developers/addresses", b: "Pin the verified addresses and review hashes in your release notes once published." },
];

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[250px] rounded-[34px] border border-white/[0.14] bg-[#0a0a0b] p-2.5 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
      <div className="overflow-hidden rounded-[26px] bg-[#111113] px-4 pb-5 pt-3 text-[12px]">
        <div className="flex items-center justify-between font-mono text-[10px] text-ink-3">
          <span>9:41</span>
          <span className="h-4 w-16 rounded-full bg-black" />
          <span>●●●</span>
        </div>
        {children}
      </div>
    </div>
  );
}

export function BuildOverview() {
  return (
    <>
      <BuildNav active="overview" />
      <section className="wrap grid grid-cols-1 gap-12 py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
        <div>
          <p className="eyebrow">Build on Berrier</p>
          <h1 className="h-display mt-7 text-[clamp(40px,5.4vw,72px)]">Structured yield in a few calls.</h1>
          <p className="lead mt-7 max-w-[580px]">{BRAND.name} is an open structuring desk on Robinhood Chain. Put barrier notes, ERC-4626 vaults and note-backed credit inside your wallet, protocol or treasury with a handful of contract calls.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/docs/developers" className="btn btn-metal">
              Integration guide <ArrowRight />
            </Link>
            <Link href="/docs/developers/addresses" className="btn btn-ghost">
              Contract addresses
            </Link>
          </div>
          <dl className="mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-[12px] bg-white/[0.06]">
            {[
              ["ERC-4626", "vault standard"],
              ["0", "custody, ever"],
              ["1", "deposit to integrate"],
            ].map(([v, k]) => (
              <div key={k} className="bg-g0 p-4">
                <dt className="num text-[22px]">{v}</dt>
                <dd className="mt-1 text-[12.5px] text-ink-3">{k}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Reveal className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
            <span className="mono-label">Integration stack</span>
            <span className="mono-label">5 layers</span>
          </div>
          <div className="figure-grid relative grid gap-2.5 p-5">
            {STACK.map((s, i) => (
              <div key={s.n} className="rounded-[10px] border border-white/[0.1] bg-g2/90 p-4" style={{ marginLeft: i * 10, marginRight: i * 10 }}>
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.08em]">
                  <span>
                    <span className="text-metal">{s.n}</span> <span className="ml-2 text-ink">{s.k}</span>
                  </span>
                  <span className="text-ink-3">{s.tag}</span>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {s.items.map((it) => (
                    <span key={it} className="rounded-md border border-white/[0.08] px-2 py-0.5 font-mono text-[11px] text-ink-2">
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="border-t border-white/[0.06] px-5 py-3.5 text-[13px] text-ink-3">A call goes down the stack, a receipt comes back up. Nothing leaves the chain.</p>
        </Reveal>
      </section>

      <section className="section-rule">
        <div className="wrap grid grid-cols-1 gap-px bg-white/[0.06] md:grid-cols-3">
          {[
            ["Berrier SDK", "Planned", "Typed client for Notes, Credit and Omni"],
            ["Vault layer", "Design", "External review before mainnet"],
            ["Contracts", "At launch", "Verified source published with deployment"],
          ].map(([k, s, b]) => (
            <div key={k} className="bg-g0 px-1 py-6 md:px-6">
              <div className="flex items-center gap-3">
                <p className="text-[15.5px]">{k}</p>
                <span className="chip !h-6 !text-[10px]">{s}</span>
              </div>
              <p className="mt-2 text-[13.5px] text-ink-3">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-rule py-[var(--section)]">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Three ways in</p>
            <h2 className="h2 mt-7">Choose the depth your product needs.</h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {WAYS.map((w, i) => (
              <Reveal key={w.t} delay={i * 70} className="panel flex flex-col p-7">
                <p className="num text-[13px] text-metal">0{i + 1}</p>
                <h3 className="h3 mt-4">{w.t}</h3>
                <p className="mt-4 text-[15px] leading-[1.65] text-ink-2">{w.b}</p>
                <code className="mt-6 block rounded-[8px] border border-white/[0.08] bg-g1 px-3 py-2.5 font-mono text-[12.5px] text-metal-light">{w.code}</code>
                <p className="mt-auto pt-6 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">For {w.who}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-rule py-[var(--section)]">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Economics</p>
            <h2 className="h2 mt-7">Every integration pays its builder and the treasury.</h2>
            <p className="lead mt-6">Deposits carry your partner id. Vault fees split three ways on every collection: the {BRAND.name} treasury, you, and the vault&apos;s fee recipient. No invoices and no off-chain reconciliation.</p>
            <dl className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-[12px] bg-white/[0.06]">
              {[
                ["20%", "Treasury share", "of vault fees"],
                ["≤ 50%", "Partner share", "of fees on your deposits"],
                ["On-chain", "Settlement", "paid on collection"],
              ].map(([v, k, s]) => (
                <div key={k} className="bg-g0 p-4">
                  <dt className="label !text-[10.5px]">{k}</dt>
                  <dd className="num mt-2 text-[20px]">{v}</dd>
                  <dd className="mt-1 text-[12px] text-ink-3">{s}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
              <span className="mono-label">Flow of value</span>
              <span className="mono-label">One collection</span>
            </div>
            <div className="figure-grid relative p-6">
              <Corners />
              <ol className="relative grid gap-3">
                {[
                  ["Deposit", "USDG + partnerId"],
                  ["BerrierVault", "ERC-4626 shares"],
                  ["Series", "CARRY legs, in band"],
                  ["Fees", "Management + performance"],
                ].map(([k, v], i) => (
                  <li key={k} className="flex items-center gap-3">
                    <span className="num w-6 text-[11px] text-metal">0{i + 1}</span>
                    <span className="flex-1 rounded-[8px] border border-white/[0.1] bg-g2/90 px-3 py-2 font-mono text-[12px]">
                      <span className="text-ink">{k}</span> <span className="text-ink-3">· {v}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-5 grid grid-cols-3 gap-2 font-mono text-[11px]">
                {[
                  ["Treasury", "20%"],
                  ["You", "partner share"],
                  ["Recipient", "remainder"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-[8px] border border-metal/30 bg-metal/[0.05] p-2.5 text-center">
                    <p className="text-ink">{k}</p>
                    <p className="text-metal">{v}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[13px] text-ink-3">Coupons net of fees lift the share price; fees split on every collection.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-rule py-[var(--section)]">
        <div className="wrap">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Design study</p>
              <h2 className="h2 mt-7 max-w-[720px]">A note inside a retail broker app.</h2>
            </div>
            <PreviewTag>Illustrative</PreviewTag>
          </Reveal>
          <p className="lead mt-6 max-w-[680px]">What a consumer integration could look like: find a note on the stock page, subscribe in one sheet, hold it beside the shares. Three screens, four contract calls. A generic wallet, no real brand.</p>
          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
            {[
              {
                step: "01 Discover",
                cap: "The note appears where the user already is: the stock page. Coupon and barrier come from the live series.",
                body: (
                  <>
                    <p className="mt-5 text-[11px] text-ink-3">TSLA</p>
                    <p className="num text-[20px]">$357.67</p>
                    <svg viewBox="0 0 200 60" className="mt-2 w-full" aria-hidden>
                      <polyline points="0,44 20,40 40,46 60,30 80,34 100,22 120,28 140,18 160,24 180,12 200,16" fill="none" stroke="#5fd39b" strokeWidth="1.5" />
                    </svg>
                    <div className="mt-4 rounded-[12px] border border-metal/30 bg-metal/[0.06] p-3">
                      <p className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-metal">Earn on TSLA</p>
                      <div className="mt-2 grid grid-cols-3 gap-1 text-center">
                        <p><span className="num block text-[13px]">0.55%</span><span className="text-[9px] text-ink-3">/ week</span></p>
                        <p><span className="num block text-[13px]">72%</span><span className="text-[9px] text-ink-3">barrier</span></p>
                        <p><span className="num block text-[13px]">12</span><span className="text-[9px] text-ink-3">closes</span></p>
                      </div>
                      <p className="mt-3 rounded-full bg-[linear-gradient(135deg,#f5e2b8,#e0bd7a)] py-1.5 text-center text-[11px] font-medium text-[#17130b]">View note</p>
                    </div>
                  </>
                ),
              },
              {
                step: "02 Subscribe",
                cap: "One sheet with the same fields the protocol enforces. The wallet signs a single subscription.",
                body: (
                  <>
                    <p className="mt-5 text-[13px]">Buy TSLA note</p>
                    <p className="text-[10px] text-ink-3">12-week series · CARRY leg</p>
                    <p className="num mt-4 text-[24px]">$1,000.00</p>
                    <div className="mt-3 grid gap-1.5 text-[10.5px]">
                      {[
                        ["Coupon", "0.55% per close"],
                        ["Barrier", "72% of S0"],
                        ["Autocall", "110% of S0"],
                        ["Closes", "13 incl. strike"],
                      ].map(([k, v]) => (
                        <p key={k} className="flex justify-between border-b border-white/[0.06] pb-1.5">
                          <span className="text-ink-3">{k}</span>
                          <span>{v}</span>
                        </p>
                      ))}
                    </div>
                    <p className="mt-4 rounded-full bg-[linear-gradient(135deg,#f5e2b8,#e0bd7a)] py-1.5 text-center text-[11px] font-medium text-[#17130b]">Review order</p>
                  </>
                ),
              },
              {
                step: "03 Hold",
                cap: "The position sits beside the shares: coupons paid, next close, distance to the barrier. All read from chain.",
                body: (
                  <>
                    <p className="mt-5 text-[10px] text-ink-3">Investing</p>
                    <p className="num text-[20px]">$18,410.22</p>
                    <p className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.1em] text-ink-3">Notes</p>
                    <div className="mt-2 rounded-[10px] border border-white/[0.08] p-2.5">
                      <p className="flex justify-between text-[11px]">
                        <span>TSLA 12w</span>
                        <span className="num">$1,016.50</span>
                      </p>
                      <p className="text-[9.5px] text-ink-3">3 of 12 coupons paid</p>
                      <p className="mt-2 flex justify-between text-[9.5px]">
                        <span className="text-ink-3">Cushion</span>
                        <span className="text-settle">28.0%</span>
                      </p>
                    </div>
                    <p className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.1em] text-ink-3">Stocks</p>
                    {[
                      ["TSLA", "12 sh"],
                      ["NVDA", "25 sh"],
                    ].map(([k, v]) => (
                      <p key={k} className="mt-2 flex justify-between text-[11px]">
                        <span>{k}</span>
                        <span className="text-ink-3">{v}</span>
                      </p>
                    ))}
                  </>
                ),
              },
            ].map((s) => (
              <Reveal key={s.step}>
                <Phone>{s.body}</Phone>
                <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.08em] text-metal">{s.step}</p>
                <p className="mt-2 text-[14.5px] leading-[1.6] text-ink-2">{s.cap}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border border-white/[0.08] bg-white/[0.06] md:grid-cols-4">
            {[
              ["Discover", "policy.openSeriesOf(TSLA)", "Live series, coupon and barrier for the stock on screen."],
              ["Terms", "core.getSeries(seriesId)", "Barrier, coupon, closes and fees exactly as enforced."],
              ["Subscribe", "core.subscribeCarry(seriesId, amount)", "One signature; the wallet receives the ERC-1155 leg."],
              ["Hold", "core.accruedCoupon(seriesId, owner)", "Coupons accrue per close; claim any time, redeem at the end."],
            ].map(([k, c, b], i) => (
              <div key={k} className="bg-g2 p-5">
                <p className="num text-[12px] text-metal">{i + 1}</p>
                <p className="mt-2 text-[15px]">{k}</p>
                <code className="mt-3 block break-words font-mono text-[11.5px] text-metal-light">{c}</code>
                <p className="mt-3 text-[13px] leading-[1.55] text-ink-3">{b}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-[760px] text-[12.5px] text-ink-3">Design study with illustrative figures. It depicts a generic wallet and implies no partnership or endorsement by any company.</p>
        </div>
      </section>

      <section className="section-rule py-12">
        <div className="wrap flex flex-wrap items-center justify-between gap-6">
          <p className="label">Built with</p>
          <PartnerWordmarks />
        </div>
      </section>

      <section className="section-rule py-[var(--section)]">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <Reveal>
            <p className="eyebrow">Get started</p>
            <h2 className="h2 mt-7">From zero to a live deposit in an afternoon.</h2>
            <p className="lead mt-6">Everything an integrator needs will be public: addresses, ABIs, the SDK, the reviews and the mandate of every vault.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/docs/build" className="btn btn-metal">
                Read the guide <ArrowRight />
              </Link>
              <a href={BRAND.x} target="_blank" rel="noreferrer" className="btn btn-ghost">
                Talk to us
              </a>
            </div>
          </Reveal>
          <ol className="grid gap-px overflow-hidden rounded-[14px] border border-white/[0.08] bg-white/[0.06]">
            {START.map((s, i) => (
              <li key={s.k} className="grid grid-cols-[40px_minmax(0,1fr)] gap-3 bg-g2 p-5">
                <span className="num text-[13px] text-metal">0{i + 1}</span>
                <div>
                  <p className="text-[15.5px]">{s.k}</p>
                  <code className="mt-1 block break-words font-mono text-[12px] text-metal-light">{s.c}</code>
                  <p className="mt-2 text-[13.5px] text-ink-3">{s.b}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
