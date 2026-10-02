// Site navigation. Paths are the only place a route name is written down.

export const SITE_NAV = [
  { href: "/#protocol", label: "Protocol" },
  { href: "/#backstop", label: "Backstop" },
  { href: "/#berrier", label: "BERRIER" },
  { href: "/analytics", label: "Analytics" },
  { href: "/community", label: "Community" },
  { href: "/docs", label: "Docs" },
] as const;

export const PRODUCTS = [
  { href: "/app", label: "Notes", hint: "Coupons in USDG. A floor under your stock." },
  { href: "/credit", label: "Credit", hint: "Borrow USDG against a CARRY leg." },
  { href: "/omnichain", label: "Omni", hint: "Carry legs to other chains, settle at home." },
  { href: "/build", label: "Build", hint: "Contracts, SDK and integration paths." },
] as const;

export const FOOTER = [
  {
    head: "Product",
    links: [
      { href: "/app", label: "Notes" },
      { href: "/credit", label: "Credit" },
      { href: "/omnichain", label: "Omni" },
      { href: "/build", label: "Build" },
    ],
  },
  {
    head: "Protocol",
    links: [
      { href: "/docs", label: "Docs" },
      { href: "/analytics", label: "Analytics" },
      { href: "/docs/security/bug-bounty", label: "Security" },
      { href: "/community", label: "Community" },
    ],
  },
  {
    head: "Company",
    links: [
      { href: "https://x.com/getberrier", label: "@getberrier", external: true },
      { href: "/build/sdk", label: "SDK" },
    ],
  },
  {
    head: "Legal",
    links: [{ href: "/docs/risk", label: "Risk disclosure" }],
  },
] as const;

export const APP_NAV = [
  { href: "/app", label: "Notes", icon: "notes" },
  { href: "/app/portfolio", label: "Portfolio", icon: "portfolio" },
  { href: "/app/desk", label: "Backstop", icon: "backstop" },
  { href: "/app/stake", label: "Stake", icon: "stake" },
  { href: "/app/bonds", label: "Bonds", icon: "bonds" },
  { href: "/app/buyback", label: "Buyback", icon: "buyback" },
  { href: "/app/governance", label: "Governance", icon: "governance" },
] as const;

export const PARTNERS = [
  { name: "Robinhood Chain", href: "https://docs.robinhood.com/chain/", line: "Escrow, legs and settlement all live on Robinhood Chain." },
  { name: "Chainlink", href: "https://chain.link/", line: "Each observation is the official close, read from a Chainlink feed." },
  { name: "LayerZero", href: "https://layerzero.network/", line: "CARRY and GUARD legs travel to other chains and come home over LayerZero." },
  { name: "Morpho", href: "https://morpho.org/", line: "Credit lends USDG against a wrapped CARRY leg in a Morpho market." },
] as const;
