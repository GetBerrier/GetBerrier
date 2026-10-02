import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { PreviewTag } from "@/components/home/parts";
import { Reveal } from "@/components/ui/Reveal";
import { BuildNav } from "@/components/pages/Build";

const HERO_CODE = `const tx = await berrier.vaults.deposit({
  vault,
  assets: 400_000_000n, // 400 USDG, six decimals
  receiver: user,
  partnerId: partnerId("wallet.example"),
});

tx.result   // { shares, tagged }
tx.gasUsed  // read from the receipt`;

const QUICK = `import { createPublicClient, createWalletClient, custom, http } from "viem";
import { BerrierError, createBerrierClient, partnerId, robinhoodChain } from "@getberrier/sdk";

// 1. clients: one to read, one to sign (the SDK never holds a key)
const publicClient = createPublicClient({ chain: robinhoodChain, transport: http() });
const walletClient = createWalletClient({ chain: robinhoodChain, transport: custom(window.ethereum) });
const berrier = createBerrierClient({ publicClient, walletClient });

// 2. discover, then verify before trusting anything
const [vault] = await berrier.factory.list(0n, 20n);
if (!vault || !(await berrier.vaults.verifyBinding(vault))) throw new Error("no bound vault");

// 3. quote
const summary = await berrier.vaults.summary(vault);
const assets = 100_000_000n; // 100 USDG
const quoted = await berrier.vaults.previewDeposit(vault, assets);

// 4. deposit with attribution
try {
  await berrier.vaults.approve(vault, assets);
  const tx = await berrier.vaults.deposit({ vault, assets, receiver: user, partnerId: partnerId("wallet.example") });
  console.log(summary.name, quoted, tx.result.shares, tx.result.tagged);
} catch (e) {
  // 5. branch on the decoded revert name
  if (e instanceof BerrierError && e.decoded?.name === "Locked") showUnlockTime();
  else throw e;
}`;

const PIPE = [
  { k: "Typed", v: "0 RPC calls", b: "Function names and arguments are checked against the ABI when your code compiles." },
  { k: "Chain agreement", v: "ChainMismatchError", b: "The RPC, the wallet and the configured chain must all agree, or nothing is sent." },
  { k: "Simulated", v: "reverts named", b: "An eth_call against the latest block first. A revert is decoded by name and never signed." },
  { k: "Estimated twice", v: "max(plain, accrual)", b: "Once plainly, once with the vault's fee accrual forced, keeping the larger figure plus a margin." },
  { k: "Sent and awaited", v: "receipt", b: "Signed by your wallet client, then the receipt. A revert after inclusion is replayed to recover its name." },
  { k: "Decoded", v: "{ shares, tagged }", b: "Results come from the vault's own events, filtered by emitter, never from the simulation." },
];

const IMPL = [
  { n: "01", k: "Install", t: "One package, one peer", items: ["`npm install @getberrier/sdk viem` once the first release is published.", "Node 20 or later, viem 2.21 or later as the only runtime peer.", "ESM with full types; ABIs exported as const so every call is typed end to end."] },
  { n: "02", k: "Reads", t: "Batched, bounded, verified", items: ["summary, holding, exposure and verifyBinding batch through Multicall3 in one round trip.", "The factory registry is the source of truth for a listed vault; unlisted addresses are refused.", "Every list is paged, so nothing grows without bound and no indexer is required."] },
  { n: "03", k: "Writes", t: "Simulate, estimate, send, decode", items: ["Every write returns { hash, receipt, gasUsed, result }.", "A transaction that reverts after inclusion throws with the hash, the receipt and the recovered revert name.", "Wrong function names or argument shapes do not compile."] },
  { n: "04", k: "Errors", t: "Named, from every layer", items: ["BerrierError.decoded carries { name, args, message } from the vault, mandate, adapter, BarrierCore and SeriesPolicy.", "Validation errors name the field that failed before any RPC call.", "RPC URLs are redacted from every message, so logs never leak a provider key."] },
  { n: "05", k: "Safety", t: "Bounds checked before you sign", items: ["verifyBinding confirms registry, vault, mandate and adapter all point at each other.", "Mandate bounds mirror the contract: fee caps, partner share up to 50%, exit locks and delays.", "Repeated partner ids, a zero payee or a payee equal to the vault are refused client side."] },
  { n: "06", k: "Gas", t: "Estimated with the accrual forced", items: ["Vault writes accrue the management fee once per block, so an estimate taken after accrual can come out low.", "The SDK estimates a second time with the accrual forced and sends the larger limit.", "Measured gas and latency figures publish with the first release."] },
];

function Code({ title, sub, code }: { title: string; sub: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-white/[0.08] bg-[#0d0d0f]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 font-mono text-[11.5px]">
        <span className="text-ink">{title}</span>
        <span className="text-ink-3">{sub}</span>
      </div>
      <pre className="scroll-x p-4 font-mono text-[12.5px] leading-[1.75] text-ink-2">
        <code>
          {code.split("\n").map((l, i) => (
            <span key={i} className="block">
              <span className="mr-4 inline-block w-5 select-none text-right text-ink-3/60">{i + 1}</span>
              <span className={l.trim().startsWith("//") ? "text-ink-3" : ""}>{l || " "}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

export function SdkView() {
  return (
    <>
      <BuildNav active="sdk" />
      <section className="wrap grid grid-cols-1 gap-12 py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)]">
        <div>
          <p className="font-mono text-[12.5px] text-metal">@getberrier/sdk</p>
          <h1 className="h-display mt-6 text-[clamp(38px,5vw,64px)]">One call in. Six checks before it touches the chain.</h1>
          <p className="lead mt-7 max-w-[580px]">A typed TypeScript client on top of viem. Reads batch through Multicall3, writes simulate before they are signed, gas is estimated with fee accrual forced, and results are decoded from the contract&apos;s own events. Every revert comes back with its name.</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <PreviewTag>Planned · first release with mainnet</PreviewTag>
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/docs/developers" className="btn btn-metal">
              SDK reference <ArrowRight />
            </Link>
            <Link href="/docs/developers/addresses" className="btn btn-ghost">
              Addresses
            </Link>
          </div>
        </div>
        <Reveal className="grid gap-4">
          <Code title="partner.ts" sub="one call, one receipt" code={HERO_CODE} />
          <div className="rounded-[14px] border border-white/[0.08] bg-g2 p-5 font-mono text-[12px]">
            <div className="flex items-center justify-between">
              <span className="text-ink-3">Receipt</span>
              <span className="chip !h-6 !text-[10px]">Example shape</span>
            </div>
            <dl className="mt-4 grid grid-cols-[100px_minmax(0,1fr)] gap-y-2">
              <dt className="text-ink-3">status</dt>
              <dd className="text-settle">success</dd>
              <dt className="text-ink-3">events</dt>
              <dd>Deposit · PartnerTagged</dd>
              <dt className="text-ink-3">result</dt>
              <dd>shares · tagged true</dd>
            </dl>
          </div>
        </Reveal>
      </section>

      <section className="section-rule py-[var(--section)]">
        <div className="wrap">
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
            {PIPE.map((p, i) => (
              <Reveal key={p.k} delay={i * 50} className="bg-g2 p-6">
                <p className="num text-[12px] text-metal">0{i + 1}</p>
                <p className="mt-3 text-[16px]">{p.k}</p>
                <p className="mt-1 font-mono text-[12px] text-metal-light">{p.v}</p>
                <p className="mt-3 text-[14px] leading-[1.6] text-ink-2">{p.b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-rule py-[var(--section)]">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Implementation</p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {IMPL.map((s) => (
              <Reveal key={s.n} className="panel p-7">
                <p className="font-mono text-[12px] uppercase tracking-[0.1em]">
                  <span className="text-metal">{s.n}</span> <span className="ml-2 text-ink-3">{s.k}</span>
                </p>
                <h3 className="mt-4 font-display text-[22px]">{s.t}</h3>
                <ul className="mt-5 grid gap-3">
                  {s.items.map((it) => (
                    <li key={it} className="flex gap-3 text-[14px] leading-[1.6] text-ink-2">
                      <span className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-metal/70" />
                      <span>{it.replace(/`/g, "")}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-rule py-[var(--section)]">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          <Reveal>
            <p className="eyebrow">Quick start</p>
            <h2 className="h2 mt-7">From install to a tagged deposit.</h2>
            <ol className="mt-10 grid gap-5">
              {[
                ["Clients", "A public client for reads and a wallet client for writes. The SDK never holds a key."],
                ["Discover", "Take the first listed vault, then verifyBinding before trusting it."],
                ["Quote", "summary for the mandate, previewDeposit for the share count, both before signing."],
                ["Deposit", "Approve, then deposit with your partner id. tagged confirms the attribution stuck."],
                ["Handle", "Catch BerrierError and branch on decoded.name."],
              ].map(([k, b], i) => (
                <li key={k} className="grid grid-cols-[32px_minmax(0,1fr)] gap-2">
                  <span className="num text-[12px] text-metal">0{i + 1}</span>
                  <span>
                    <span className="block text-[15.5px]">{k}</span>
                    <span className="mt-1 block text-[14px] text-ink-3">{b}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal className="min-w-0">
            <Code title="quick-start.ts" sub="viem 2.21, Node 20" code={QUICK} />
            <p className="mt-4 text-[13px] text-ink-3">API shape for the planned first release. Names may change before publication; the docs will carry the final reference.</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
