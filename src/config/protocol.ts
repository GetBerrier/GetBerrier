// Protocol design parameters. These are the published design for launch,
// not live readings: every page that shows them labels them that way.

export type Template = {
  ticker: string;
  name: string;
  /** Autocall level, % of S0. */
  autocall: number;
  /** Barrier, % of S0. */
  barrier: number;
  /** Weekly coupon band discovered per series, % per week. */
  band: [number, number];
  /** Lowest coupon at which the Backstop fills, % per week. */
  backstopMin: number;
  /** Chainlink "Robinhood <ticker> / USD" proxy on Robinhood Chain mainnet. */
  feed: string;
};

export const TEMPLATES: Template[] = [
  { ticker: "AAPL", name: "Apple", autocall: 105, barrier: 85, band: [0.1, 0.55], backstopMin: 0.25, feed: "0x6B22A786bAa607d76728168703a39Ea9C99f2cD0" },
  { ticker: "MSFT", name: "Microsoft", autocall: 105, barrier: 85, band: [0.1, 0.7], backstopMin: 0.35, feed: "0x45C3C877C15E6BA2EBB19eA114Ea508d14C1Af2E" },
  { ticker: "AMZN", name: "Amazon", autocall: 105, barrier: 82, band: [0.2, 0.9], backstopMin: 0.4, feed: "0xD5a1508ceD74c084eBf3cBe853e2C968fB2a651C" },
  { ticker: "NVDA", name: "NVIDIA", autocall: 105, barrier: 78, band: [0.15, 1.3], backstopMin: 0.45, feed: "0x379EC4f7C378F34a1B47E4F3cbeBCbAC3E8E9F15" },
  { ticker: "META", name: "Meta", autocall: 105, barrier: 80, band: [0.25, 1.0], backstopMin: 0.45, feed: "0x7C38C00C30BEe9378381E7B6135d7283356D71b1" },
  { ticker: "TSLA", name: "Tesla", autocall: 110, barrier: 72, band: [0.3, 1.45], backstopMin: 0.55, feed: "0x4A1166a659A55625345e9515b32adECea5547C38" },
  { ticker: "COIN", name: "Coinbase", autocall: 110, barrier: 62, band: [0.4, 1.6], backstopMin: 0.7, feed: "0xA3a468A452940B7D6b69991207B508c609a98Ef2" },
  { ticker: "GOOGL", name: "Alphabet", autocall: 105, barrier: 84, band: [0.12, 0.75], backstopMin: 0.3, feed: "0xF6f373a037c30F0e5010d854385cA89185AE638b" },
];

export const SCHEDULE = {
  closes: 13,
  coupons: 12,
  templates: TEMPLATES.length,
};

export const FEES = {
  couponShare: 20,
  notional: 0.6,
  toBuyback: 85,
  toTreasury: 15,
  streamDays: 7,
  floorPerDay: 1.5,
};

export const BACKSTOP = {
  totalCap: 60,
  perUnderlying: 25,
  perSeries: 10,
  minHoldDays: 1,
};

export const GOVERNANCE = {
  maxLockYears: 4,
  threshold: 0.5,
  initialWeekly: 250_000,
  decayPct: 2,
  decayEveryWeeks: 4,
  floorWeekly: 20_000,
};

export const CREDIT = { lltv: 40 };

/** ETH / USD on Robinhood Chain, for the wallet menu and analytics. */
export const ETH_USD_FEED = "0x78F3556b67E17Df817D51Ef5a990cDaF09E8d3A9";
export const USDG_USD_FEED = "0x61B7e5650328764B076A108EFF5fa7282a1B9aD2";

export function stockLogo(ticker: string) {
  return `/stocks/${ticker.toLowerCase()}.webp`;
}
