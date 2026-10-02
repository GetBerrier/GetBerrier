import type { DocGroup } from "./types";

export const overviewGroup: DocGroup = {
  label: "Overview",
  pages: [
    {
      slug: "",
      title: "Introduction",
      description:
        "Get Berrier issues autocallable barrier notes on Robinhood Chain Stock Tokens: fully pre-funded, never liquidated, settled at the official close.",
      blocks: [
        {
          t: "p",
          text: "Get Berrier is a protocol for **autocallable barrier notes** on Robinhood Chain. One side deposits USDG and collects a weekly coupon for as long as a stock stays above its barrier. The other side posts the Stock Token itself, funds those coupons, and in exchange holds downside protection struck at the opening price. Every amount either side could ever be owed is locked in escrow on day one, so there is nothing to liquidate and no margin call to answer.",
        },
        { t: "h2", text: "What these docs cover" },
        {
          t: "cards",
          items: [
            { title: "Overview", text: "What the protocol is, why it lives on-chain and who it serves.", href: "/docs/overview/what" },
            { title: "Concepts", text: "Barrier, observation, settlement and how a coupon is discovered.", href: "/docs/concepts/autocallable-notes" },
            { title: "Protocol", text: "Series lifecycle, the two legs, escrow, oracle, fees and automation.", href: "/docs/protocol/series-lifecycle" },
            { title: "Token", text: "BERRIER, sBERRIER, bonds, the floor, the buyback and the Backstop.", href: "/docs/token/berrier" },
            { title: "Risk and Security", text: "What can go wrong, and how the code is tested and reviewed.", href: "/docs/risk" },
            { title: "Build and Developers", text: "Vaults, distribution, credit, interfaces, events and addresses.", href: "/docs/build" },
          ],
        },
        { t: "h2", text: "The protocol in one table" },
        {
          t: "table",
          head: ["Piece", "What it does"],
          rows: [
            ["Series", "One Stock Token, 13 scheduled closes, three levels fixed at strike"],
            ["CARRY leg", "USDG in, weekly coupon out while the barrier holds"],
            ["GUARD leg", "Stock Token in, coupons paid, a put struck at S0 held"],
            ["Escrow", "BarrierCore holds every possible payout from strike onward"],
            ["Oracle", "Chainlink Robinhood equity feeds, read only at the official close"],
            ["Backstop", "A capped USDG vault that fills CARRY demand when GUARD outnumbers it"],
            ["BERRIER", "Fee-backed token: buybacks, a reserve floor and staking"],
          ],
        },
        { t: "h2", text: "How to read the numbers" },
        {
          t: "p",
          text: "Coupons are quoted **per weekly observation**, not per year: 0.45% / wk means 0.45% of notional each time an observation clears the barrier. Levels are percentages of S0, the strike close. USDG carries 6 decimals, Stock Tokens and BERRIER carry 18, and Chainlink equity prices carry 8.",
        },
        { t: "h2", text: "Status" },
        {
          t: "callout",
          tone: "caution",
          title: "Pre-launch",
          text: "No Get Berrier protocol contract is deployed on Robinhood Chain mainnet yet. Parameters in these docs are the published design and may change before launch. Addresses, including the $BERRIER token contract, are published at launch on [Addresses](/docs/developers/addresses).",
        },
      ],
    },
    {
      slug: "overview/what",
      title: "What Get Berrier is",
      description: "A plain-language tour of the product, its two legs and the modules behind them.",
      blocks: [
        { t: "h2", text: "The product in plain terms" },
        {
          t: "p",
          text: "A note is a fixed agreement about one stock over thirteen weeks. If the stock keeps closing at or above a barrier, the cash side earns a coupon every week. If it rallies to the autocall level, the note ends early and everyone goes home with what they put in plus what they earned. Only a final close below the barrier changes the outcome: the cash side then receives the stock at its starting price.",
        },
        { t: "h2", text: "The two legs" },
        {
          t: "table",
          head: ["", "CARRY", "GUARD"],
          rows: [
            ["Deposits", "USDG", "Stock Tokens plus a USDG prefund"],
            ["Receives", "Weekly coupons", "Its stock back, unless the barrier breaks at maturity"],
            ["Gives up", "Upside above the coupon; takes stock at S0 on a breach", "The coupons it funds"],
            ["Holds", "A short put struck at S0, paid for by the coupon", "A long put struck at S0"],
          ],
        },
        {
          t: "p",
          text: "Both legs are ERC-1155 tokens minted by BarrierLegs, so either can be held, transferred, used as collateral in [Credit](/credit) or moved to another chain with [Omni](/omnichain).",
        },
        { t: "h2", text: "What the protocol does not do" },
        {
          t: "ul",
          items: [
            "It does not lend. No position carries debt, so nothing is ever liquidated.",
            "It does not quote prices. Coupons clear from the deposits on each side.",
            "It does not hold custody off-chain. Every token sits in escrow contracts on Robinhood Chain.",
            "It does not observe intraday. Only the scheduled official close counts.",
          ],
        },
        { t: "h2", text: "Module map" },
        {
          t: "table",
          head: ["Contract", "Role"],
          rows: [
            ["BarrierCore", "Escrow, subscription, strike, observations, settlement"],
            ["BarrierLegs", "ERC-1155 CARRY and GUARD legs"],
            ["SeriesPolicy", "Opens a new series from each standing template every trading day"],
            ["TradingCalendar", "Market days, holidays and the official close time"],
            ["OracleAdapter", "Reads Chainlink and applies staleness rules"],
            ["Backstop / BackstopPolicy", "The USDG vault of last resort and the rules it fills by"],
            ["FeeRouter", "Splits fees between the buyback auction and the Treasury"],
          ],
        },
        { t: "h2", text: "Chain and assets" },
        {
          t: "p",
          text: "Everything settles on Robinhood Chain (chain id 4663, gas in ETH). The cash asset is USDG at `0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168`. Underlyings are Robinhood Chain Stock Tokens with a Chainlink feed.",
        },
      ],
    },
    {
      slug: "overview/why",
      title: "Why on-chain",
      description: "Why barrier notes belong on a public ledger, and why this design is possible now.",
      blocks: [
        { t: "h2", text: "The gap" },
        {
          t: "p",
          text: "Autocallables are among the most sold structured products in the world, but they are wrapped in bank paper: high minimums, opaque pricing, issuer credit risk and fees buried in the terms. The buyer rarely sees who is on the other side or what they are paid.",
        },
        { t: "h2", text: "Why it is possible now" },
        {
          t: "ul",
          items: [
            "Stock Tokens on Robinhood Chain put the underlying itself on-chain, so stock can be escrowed and delivered.",
            "Chainlink publishes equity prices on the same chain, so an official close can be read by a contract.",
            "USDG gives both sides a settlement dollar that never leaves the chain.",
          ],
        },
        { t: "h2", text: "Why fully collateralised" },
        {
          t: "p",
          text: "A bank note is a promise backed by the bank. A Get Berrier note is backed by tokens already sitting in escrow. That removes the issuer from the risk list and removes liquidations from the design: nobody borrows, so nobody can be forced out.",
        },
        { t: "h2", text: "Why observations only at official closes" },
        {
          t: "p",
          text: "Intraday prices on a 24/5 token can wick on thin liquidity. Tying every decision to the scheduled official close makes outcomes hard to manipulate and easy for anyone to check against public market data.",
        },
        { t: "h2", text: "Why a token engine with real cash flows" },
        {
          t: "p",
          text: "Fees come from coupons and notional, both paid in USDG or stock. Routing most of them to buy BERRIER, and holding the rest as reserves that set a floor, ties the token to revenue the protocol actually collects.",
        },
        { t: "h2", text: "Indicative revenue" },
        {
          t: "formula",
          text: "annual fees ≈ matched notional × (0.60% × series per year + 20% × coupon rate × paid weeks)",
        },
        {
          t: "callout",
          tone: "note",
          text: "This is arithmetic on the fee schedule, not a forecast. Volume on a pre-launch protocol is zero.",
        },
      ],
    },
    {
      slug: "overview/who",
      title: "Who it is for",
      description: "The participants Get Berrier is built for, and the people it is not built for.",
      blocks: [
        { t: "h2", text: "CARRY buyers" },
        { t: "p", text: "USDG holders who want a defined weekly income on a stock they would not mind owning at today's price. They accept stock at S0 if the barrier breaks at maturity." },
        { t: "h2", text: "GUARD posters" },
        { t: "p", text: "Stock Token holders who want to keep their shares and buy protection below S0. They pay coupons out of a USDG prefund and get their stock back whenever the barrier holds." },
        { t: "h2", text: "Backstop depositors" },
        { t: "p", text: "USDG holders who want diversified CARRY exposure across many series without choosing them, inside governed caps. See [Backstop](/docs/token/backstop)." },
        { t: "h2", text: "BERRIER and sBERRIER holders" },
        { t: "p", text: "People who want exposure to protocol fees: buybacks stream to sBERRIER and reserves back a redeemable floor." },
        { t: "h2", text: "Keepers (anyone)" },
        { t: "p", text: "Every state change after creation is a permissionless crank. Anyone can call strike, observe or settle once it is due; some cranks pay a small USDG bounty." },
        { t: "h2", text: "Integrators" },
        { t: "p", text: "Wallets, brokers, vault curators and lending protocols that want to offer notes or lend against legs. Start at [Build on Berrier](/docs/build)." },
        { t: "h2", text: "Who it is not for" },
        {
          t: "ul",
          items: [
            "US persons: Stock Tokens are not available to them.",
            "Anyone who needs their principal back in cash in every scenario.",
            "Anyone looking for leverage. There is none.",
          ],
        },
      ],
    },
    {
      slug: "overview/wallets",
      title: "Wallets",
      description: "Which wallets reach Robinhood Chain, how to add the network and what to do when something fails.",
      blocks: [
        { t: "h2", text: "Supported wallets" },
        {
          t: "p",
          text: "Any EVM wallet that can add a custom network works: MetaMask, Rabby, OKX Wallet, Coinbase Wallet, Trust Wallet, Rainbow, Bitget, Zerion and Brave among them. Mobile wallets connect over WalletConnect when the site has it configured. Phantom announces itself as an EVM wallet but cannot add Robinhood Chain, so it is listed and disabled.",
        },
        { t: "h2", text: "Quotes and minimums" },
        { t: "p", text: "You need a little ETH on Robinhood Chain for gas, plus the asset you deposit: USDG for CARRY, the Stock Token and a USDG prefund for GUARD. Each template sets a minimum ticket, shown before you sign." },
        { t: "h2", text: "Desktop" },
        {
          t: "ol",
          items: [
            "Click **Connect wallet** and pick your wallet from the dialog.",
            "Approve the connection. The site asks the wallet to switch to Robinhood Chain and adds it if missing.",
            "Your address chip appears in the header with a green dot when you are on the right network.",
          ],
        },
        { t: "h2", text: "Mobile" },
        { t: "p", text: "Open the site inside your wallet's own browser (the dialog offers an **Open** link for MetaMask, OKX, Coinbase and Trust), or scan a WalletConnect QR code from a desktop browser." },
        { t: "h2", text: "Robinhood Chain network details" },
        {
          t: "table",
          head: ["Field", "Value"],
          rows: [
            ["Network name", "Robinhood Chain"],
            ["Chain id", "4663 (0x1237)"],
            ["RPC", "`https://rpc.mainnet.chain.robinhood.com`"],
            ["Currency", "ETH, 18 decimals"],
            ["Explorer", "`https://robinhoodchain.blockscout.com`"],
          ],
        },
        { t: "h2", text: "Troubleshooting" },
        {
          t: "ul",
          items: [
            "**Red dot on the address chip**: the wallet is on another network. Use **Switch** in the account menu.",
            "**A request is already pending**: open the wallet extension and finish or dismiss the earlier prompt.",
            "**Balances show a dash**: the read relay could not reach the chain; it retries every 20 seconds.",
          ],
        },
      ],
    },
  ],
};
