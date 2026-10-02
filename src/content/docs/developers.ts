import type { DocGroup } from "./types";

const LAUNCH = "Published at launch";

export const developersGroup: DocGroup = {
  label: "Developers",
  pages: [
    {
      slug: "developers",
      title: "Integration guide",
      description: "Contracts, units and the common flows in one place.",
      blocks: [
        { t: "h2", text: "Contracts at a glance" },
        { t: "table", head: ["Contract", "Use it to"], rows: [["BarrierCore", "Deposit, strike, observe, settle, redeem"], ["BarrierLegs", "Read and transfer legs"], ["SeriesRegistry", "List series and templates"], ["OracleAdapter", "Read the close used for a timestamp"], ["TradingCalendar", "Check trading days"]] },
        { t: "h2", text: "Units and decimals" },
        { t: "table", head: ["Value", "Unit"], rows: [["USDG", "6 decimals"], ["Stock Token, BERRIER", "18 decimals"], ["Chainlink price", "8 decimals"], ["Coupon, levels", "Basis points"]] },
        { t: "h2", text: "Common flows" },
        { t: "h3", text: "Read a series" },
        { t: "code", lang: "ts", code: "const s = await core.read.getSeries([seriesId]);" },
        { t: "h3", text: "Subscribe CARRY" },
        { t: "code", lang: "ts", code: "await usdg.write.approve([core.address, amount]);\nawait core.write.depositCarry([seriesId, amount]);" },
        { t: "h3", text: "Subscribe GUARD" },
        { t: "code", lang: "ts", code: "const prefund = await core.read.requiredPrefund([seriesId, stockAmount]);\nawait stock.write.approve([core.address, stockAmount]);\nawait usdg.write.approve([core.address, prefund]);\nawait core.write.depositGuard([seriesId, stockAmount]);" },
        { t: "h3", text: "After strike" },
        { t: "p", text: "Call `refund(seriesId)` for unmatched amounts, `claimCoupons(seriesId)` as coupons accrue and `redeem(seriesId, units)` after settlement." },
        { t: "h3", text: "Hold legs in a contract" },
        { t: "p", text: "Implement `onERC1155Received` and `onERC1155BatchReceived`." },
        { t: "h2", text: "ABI source" },
        { t: "p", text: "Verified source on the explorer at launch." },
      ],
    },
    {
      slug: "developers/interfaces",
      title: "Interfaces",
      description: "Solidity interfaces of the core contracts.",
      blocks: [
        { t: "h2", text: "IBarrierCore" },
        {
          t: "code",
          lang: "solidity",
          title: "IBarrierCore.sol",
          code: `interface IBarrierCore {
    function depositCarry(uint256 seriesId, uint256 usdgAmount) external;
    function depositGuard(uint256 seriesId, uint256 stockAmount) external;
    function strike(uint256 seriesId) external;
    function observe(uint256 seriesId) external;
    function settle(uint256 seriesId) external;
    function refund(uint256 seriesId) external;
    function claimCoupons(uint256 seriesId) external returns (uint256 usdg);
    function redeem(uint256 seriesId, uint256 units) external;
    function requiredPrefund(uint256 seriesId, uint256 stockAmount) external view returns (uint256);
    function pendingWork(uint256 start, uint256 count) external view returns (uint256[] memory);
}`,
        },
        { t: "h2", text: "ISeriesRegistry" },
        {
          t: "code",
          lang: "solidity",
          code: `interface ISeriesRegistry {
    struct Series {
        address stockToken;
        uint16 autocallBps;
        uint16 barrierBps;
        uint16 couponLowBps;
        uint16 couponHighBps;
        uint16 couponBps;      // zero until strike
        uint128 s0;            // 8 decimals, zero until strike
        uint64[13] closes;
        uint8 status;
        uint8 observed;
    }
    function getSeries(uint256 seriesId) external view returns (Series memory);
    function openSeriesOf(address stockToken) external view returns (uint256[] memory);
    function seriesCount() external view returns (uint256);
}`,
        },
        { t: "h2", text: "BarrierLegs (ERC-1155)" },
        { t: "code", lang: "solidity", code: `interface IBarrierLegs /* is IERC1155 */ {
    function carryId(uint256 seriesId) external pure returns (uint256);
    function guardId(uint256 seriesId) external pure returns (uint256);
}` },
        { t: "h2", text: "IOracleAdapter" },
        { t: "code", lang: "solidity", code: `interface IOracleAdapter {
    function closeAt(address stockToken, uint64 timestamp) external view returns (uint256 price, uint64 updatedAt, bool fallbackUsed);
    function latest(address stockToken) external view returns (uint256 price, uint64 updatedAt);
}` },
        { t: "h2", text: "ITradingCalendar" },
        { t: "code", lang: "solidity", code: `interface ITradingCalendar {
    function isTradingDay(uint64 day) external view returns (bool);
    function closeTime(uint64 day) external view returns (uint64);
    function nextTradingDay(uint64 day) external view returns (uint64);
}` },
        { t: "h2", text: "Token engine" },
        { t: "code", lang: "solidity", code: `interface IBuybackAuction { function price() external view returns (uint256); function sell(uint256 berrierIn, uint256 minUsdgOut) external; }
interface ITreasuryFloor { function floor() external view returns (uint256); function redeem(uint256 berrierIn) external; }
interface IBackstop /* is IERC4626 */ { function deployed() external view returns (uint256); function requestRedeem(uint256 shares) external; }` },
        { t: "h2", text: "Governance" },
        { t: "code", lang: "solidity", code: `interface IVeBerrier {
    function createLock(uint256 amount, uint256 unlockTime) external;
    function increaseAmount(uint256 amount) external;
    function increaseUnlockTime(uint256 unlockTime) external;
    function balanceOf(address owner) external view returns (uint256);
}` },
        { t: "callout", tone: "note", text: "Interfaces are the published design and may change before launch." },
      ],
    },
    {
      slug: "developers/erc1155-ids",
      title: "ERC-1155 leg ids",
      description: "How leg token ids are derived.",
      blocks: [
        { t: "h2", text: "Scheme" },
        { t: "formula", text: "carryId = seriesId << 1        guardId = (seriesId << 1) | 1" },
        { t: "h2", text: "Units" },
        { t: "p", text: "One unit equals one USDG of matched notional, with 6 decimals." },
        { t: "h2", text: "Transfers" },
        { t: "p", text: "Standard ERC-1155 transfers. Accrued but unclaimed coupons stay with the sender." },
        { t: "h2", text: "Metadata" },
        { t: "p", text: "`uri(id)` returns JSON with underlying, levels and status." },
        { t: "h2", text: "Indexing" },
        { t: "p", text: "Index `TransferSingle` and `TransferBatch` from BarrierLegs." },
      ],
    },
    {
      slug: "developers/events",
      title: "Events",
      description: "Events emitted by the core contracts.",
      blocks: [
        { t: "h2", text: "BarrierCore" },
        { t: "code", lang: "solidity", code: `event SeriesCreated(uint256 indexed seriesId, address indexed stockToken, uint256 templateId);
event Deposited(uint256 indexed seriesId, address indexed account, bool guard, uint256 amount);
event Struck(uint256 indexed seriesId, uint256 s0, uint16 couponBps, uint256 matched);
event Observed(uint256 indexed seriesId, uint8 index, uint256 close, bool paid, bool autocalled);
event Settled(uint256 indexed seriesId, bool breached, uint256 finalClose);
event Redeemed(uint256 indexed seriesId, address indexed account, uint256 units, uint256 usdg, uint256 stock);
event Refunded(uint256 indexed seriesId, address indexed account, uint256 usdg, uint256 stock);` },
        { t: "h2", text: "BarrierLegs" },
        { t: "p", text: "Standard ERC-1155 `TransferSingle`, `TransferBatch` and `URI`." },
        { t: "h2", text: "OracleAdapter and TradingCalendar" },
        { t: "code", lang: "solidity", code: `event FallbackPriceUsed(address indexed stockToken, uint64 scheduled, uint256 price);
event HolidaysPublished(uint16 year, uint64[] days);` },
        { t: "h2", text: "Token engine" },
        { t: "code", lang: "solidity", code: `event FeesRouted(uint256 toBuyback, uint256 toTreasury);
event BoughtBack(address indexed seller, uint256 berrierIn, uint256 usdgOut);
event FloorRedeemed(address indexed account, uint256 berrierBurned, uint256 reservesOut);` },
        { t: "h2", text: "Governance" },
        { t: "p", text: "OpenZeppelin Governor and TimelockController events, plus `Locked` and `GaugeVoted`." },
        { t: "h2", text: "Indexer notes" },
        { t: "p", text: "Observations are processed in order, so `Observed.index` is strictly increasing per series." },
      ],
    },
    {
      slug: "developers/addresses",
      title: "Addresses",
      description: "Deployed contract addresses.",
      blocks: [
        { t: "h2", text: "Robinhood Chain (mainnet)" },
        { t: "table", head: ["Contract", "Address"], rows: [["$BERRIER", LAUNCH], ["BarrierCore", LAUNCH], ["BarrierLegs", LAUNCH], ["SeriesRegistry", LAUNCH], ["SeriesPolicy", LAUNCH], ["OracleAdapter", LAUNCH], ["TradingCalendar", LAUNCH], ["Backstop", LAUNCH], ["BackstopPolicy", LAUNCH], ["FeeRouter", LAUNCH], ["sBERRIER", LAUNCH], ["veBERRIER", LAUNCH], ["BerrierGovernor", LAUNCH], ["UpgradeGovernor", LAUNCH], ["LegVault", LAUNCH], ["LegWrap", LAUNCH]] },
        { t: "h2", text: "External dependencies" },
        { t: "table", head: ["Contract", "Address"], rows: [["USDG", "`0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168`"], ["Chainlink AAPL / USD", "`0x6B22A786bAa607d76728168703a39Ea9C99f2cD0`"], ["Chainlink MSFT / USD", "`0x45C3C877C15E6BA2EBB19eA114Ea508d14C1Af2E`"], ["Chainlink AMZN / USD", "`0xD5a1508ceD74c084eBf3cBe853e2C968fB2a651C`"], ["Chainlink NVDA / USD", "`0x379EC4f7C378F34a1B47E4F3cbeBCbAC3E8E9F15`"], ["Chainlink META / USD", "`0x7C38C00C30BEe9378381E7B6135d7283356D71b1`"], ["Chainlink TSLA / USD", "`0x4A1166a659A55625345e9515b32adECea5547C38`"], ["Chainlink COIN / USD", "`0xA3a468A452940B7D6b69991207B508c609a98Ef2`"], ["Chainlink GOOGL / USD", "`0xF6f373a037c30F0e5010d854385cA89185AE638b`"], ["Morpho Blue", "`0x9D53d5E3bd5E8d4Cbfa6DB1ca238AEA02E651010`"]] },
        { t: "h2", text: "Verification" },
        { t: "p", text: "Check every address on `robinhoodchain.blockscout.com` before you sign. Get Berrier will only ever publish addresses here and on [@getberrier](https://x.com/getberrier)." },
      ],
    },
  ],
};
