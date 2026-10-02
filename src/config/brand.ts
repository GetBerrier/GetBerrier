// Single place to change project identity. Everything on the site reads from here.
// The token contract below is a placeholder until launch: paste the real
// 0x address (0x + 40 hex) into CA and the navbar pill, the footer block and
// every copy button switch from "Published at launch" to a working copy.

const CA = "0xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

export const isAddress = (v: string): v is `0x${string}` => /^0x[0-9a-fA-F]{40}$/.test(v);

export const BRAND = {
  name: "Get Berrier",
  word: "Berrier",
  ticker: "BERRIER",
  symbol: "$BERRIER",
  domain: "getberrier.xyz",
  url: "https://getberrier.xyz",
  slogan: "Get barriers. Never get liquidated.",
  tagline: "Barrier notes on tokenised stocks, settled on Robinhood Chain",
  description:
    "Get Berrier issues autocallable barrier notes on Robinhood Chain Stock Tokens. Every payment is escrowed up front, prices are read at the official close, and nobody is ever liquidated.",
  x: "https://x.com/getberrier",
  xHandle: "@getberrier",
  /** Public GitHub repository. Empty hides every GitHub link on the site. */
  github: "https://github.com/GetBerrier/GetBerrier" as string,
  ca: CA,
} as const;

// Public endpoints are the default. An operator can point server reads at a
// private RPC with ROBINHOOD_RPC_URL (optional, server only).
const PUBLIC_RPC = "https://rpc.mainnet.chain.robinhood.com";

export const CHAIN = {
  id: 4663,
  hex: "0x1237",
  name: "Robinhood Chain",
  nativeSymbol: "ETH",
  decimals: 18,
  publicRpc: PUBLIC_RPC,
  /** Second public endpoint, used for reads only when the first one fails. */
  fallbackRpc: "https://robinhood-rpc.publicnode.com",
  explorer: "https://robinhoodchain.blockscout.com",
  explorerName: "Blockscout",
} as const;

export const USDG = {
  symbol: "USDG",
  address: "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168",
  decimals: 6,
} as const;

/** RPC for server code: the private endpoint when set, else the public one. */
export function serverRpc() {
  return process.env.ROBINHOOD_RPC_URL || PUBLIC_RPC;
}

export const TOKEN = {
  get isLive() {
    return isAddress(BRAND.ca);
  },
};

/**
 * Protocol contracts. Nothing is deployed on mainnet yet; every entry stays
 * empty until launch and the site says so instead of inventing numbers.
 */
export const CONTRACTS: { name: string; role: string; address: string }[] = [
  { name: "BarrierCore", role: "Series, escrow and settlement", address: "" },
  { name: "BarrierLegs", role: "ERC-1155 CARRY and GUARD legs", address: "" },
  { name: "SeriesPolicy", role: "Standing templates and daily series", address: "" },
  { name: "BackstopPolicy", role: "Backstop caps and minimum coupons", address: "" },
  { name: "Backstop", role: "ERC-4626 USDG vault", address: "" },
  { name: "TradingCalendar", role: "Official close schedule", address: "" },
  { name: "FeeRouter", role: "Splits every fee", address: "" },
  { name: "BuybackAuction", role: "Dutch auction for BERRIER", address: "" },
  { name: "Treasury", role: "Reserves and floor redemption", address: "" },
  { name: "BondDepot", role: "Discounted, vested BERRIER", address: "" },
  { name: "sBERRIER", role: "Staking, streamed buybacks", address: "" },
  { name: "VotingEscrow", role: "veBERRIER locks", address: "" },
  { name: "GaugeController", role: "Weekly emission weights", address: "" },
  { name: "BerrierGovernor", role: "Parameter governance", address: "" },
  { name: "LegWrap", role: "ERC-20 wrapper for Credit", address: "" },
  { name: "LegVault", role: "Omni lockbox on Robinhood Chain", address: "" },
];

export function explorerAddress(address: string) {
  return `${CHAIN.explorer}/address/${address}`;
}
export function explorerToken(address: string) {
  return `${CHAIN.explorer}/token/${address}`;
}
export function shortAddress(address: string, head = 6, tail = 4) {
  if (address.length <= head + tail + 2) return address;
  return `${address.slice(0, head)}…${address.slice(-tail)}`;
}
