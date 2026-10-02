# Get Berrier

**Get barriers. Never get liquidated.**

Get Berrier issues autocallable barrier notes on tokenised stocks and settles them on Robinhood Chain. This repository is the full website and app: landing page, the notes app, Credit, Omni, analytics, community and documentation.

- Website: https://getberrier.xyz
- X: https://x.com/getberrier
- Token: **$BERRIER** on Robinhood Chain (contract address published at launch)

## The problem

Earning yield on stocks, or protecting a stock position, usually means one of two things on-chain:

- **Leverage and liquidations.** Lending markets let you borrow against shares, but one bad candle can liquidate the position at the worst moment, often on a thin intraday print.
- **Opaque structured products.** Off-chain, coupon notes and protection exist, but they come from a single issuer, sit behind brokers and minimum sizes, and you cannot see the collateral.

Holders of tokenised stocks and of stablecoins have no simple, transparent way to trade income for protection with each other.

## The solution

Get Berrier turns a classic autocallable barrier note into two on-chain tokens that settle against one escrow:

- **CARRY leg** (for USDG holders): earns a fixed weekly coupon on every official close where the stock stays at or above a barrier. Principal comes back in cash, unless the final close is below the barrier, in which case the holder receives the stock at its starting price (S0).
- **GUARD leg** (for Stock Token holders): posts shares, funds the coupons, and holds a put struck at S0 until the note autocalls or matures. While the barrier holds, the stock comes back.

Every payment either side could ever be owed is escrowed on day one. Prices are read at the **official close** from Chainlink, on a fixed weekly schedule. There are **no margin calls and no liquidations**: the only way stock is delivered is a final close below the barrier.

Around the notes sit a **Backstop** vault (buyer of last resort for the CARRY side), **Credit** (borrow USDG against CARRY legs in a Morpho market), **Omni** (move legs to other chains over LayerZero while settlement stays home), and **$BERRIER**, which protocol fees buy back above a treasury floor.

## What you can try

Live today:

- The full website and app interface, on every page listed below.
- **Connect a wallet** (MetaMask, Rabby, OKX, Coinbase Wallet and any EIP-6963 wallet). Connecting adds Robinhood Chain to the wallet if it is missing and shows your ETH and USDG balances on Robinhood Chain.
- **Live market data:** Chainlink "Robinhood / USD" price feeds for AAPL, MSFT, AMZN, NVDA, META, TSLA, COIN and GOOGL, read directly from Robinhood Chain mainnet, plus live chain facts on the Analytics page.
- The US market session clock (next official close) used by the notes.
- **Community sign-in** with a wallet signature (no transaction, no gas).
- 60 pages of protocol documentation.

Coming at launch:

- Protocol contracts (series, escrow, Backstop, staking, bonds, buyback, governance, Credit markets, Omni). Until they are deployed, those screens show the launch design and clearly say so; no numbers are invented.
- The $BERRIER contract address. Every copy-address button activates once it is published.
- The points season and leaderboard.
- The `@getberrier/sdk` package.

## Run it locally

You need **Node.js 20 or later**. Download the ZIP of this repository (or fork it), then in the project folder:

```bash
npm install
npm run build
npm start
```

Open http://localhost:4760.

For development with hot reload: `npm run dev` (also port 4760).

Optional environment variables, in a `.env.local` file you create yourself:

| Name | What it does |
|---|---|
| `ROBINHOOD_RPC_URL` | A private Robinhood Chain RPC URL for server-side reads (for example from Alchemy). Without it the public RPC is used. |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | A WalletConnect project id (from cloud.reown.com) to enable the WalletConnect option. Without it that option shows "Not configured". |

The app runs fine with neither.

## Robinhood Chain in your wallet

The site adds the network for you when you connect. To add it by hand:

| Field | Value |
|---|---|
| Network name | Robinhood Chain |
| RPC URL | https://rpc.mainnet.chain.robinhood.com |
| Chain ID | 4663 |
| Currency symbol | ETH |
| Block explorer | https://robinhoodchain.blockscout.com |

Phantom cannot add custom networks, so it is listed but disabled.

## Project layout

```
src/
  app/                    routes (Next.js App Router)
    (site)/               landing, analytics, community, build, build/sdk
    app/                  notes app: notes, portfolio, desk (Backstop), stake, bonds, buyback, governance, series
    credit/  omnichain/   Credit and Omni
    docs/[[...slug]]/     documentation
    api/live  api/rpc     live chain + feed reads, read-only RPC relay
  components/
    home/                 landing sections (hero scene, charts, tape)
    app/                  app shell and app screens
    docs/                 docs renderer and navigation
    wallet/               wallet provider, dialog and account menu
  config/
    brand.ts              name, links, chain, token contract address
    protocol.ts           templates and protocol parameters
    nav.ts  wallets.ts
  content/docs/           documentation content
  lib/                    chain reads, calendar, live data hooks
public/
  brand/  stocks/  wallets/
```

## Token contract

**$BERRIER** lives on Robinhood Chain (chain id 4663). The contract address is **published at launch**; it is set in one place, `src/config/brand.ts`. Until then, every place that shows the address reads "Published at launch". Always check the address against the official X account, https://x.com/getberrier.

---

Stock Tokens are not offered to US persons. Barrier notes can lose value. Nothing here is investment advice.
