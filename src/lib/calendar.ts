// US equity session calendar used for display: regular hours 09:30–16:00
// New York time on weekdays, minus full-day NYSE holidays. Early closes are
// not modelled. The protocol's TradingCalendar contract is authoritative.

const HOLIDAYS = new Set([
  "2026-01-01", "2026-01-19", "2026-02-16", "2026-04-03", "2026-05-25", "2026-06-19", "2026-07-03", "2026-09-07", "2026-11-26", "2026-12-25",
  "2027-01-01", "2027-01-18", "2027-02-15", "2027-03-26", "2027-05-31", "2027-06-18", "2027-07-05", "2027-09-06", "2027-11-25", "2027-12-24",
]);

const NY = "America/New_York";

function nyParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: NY,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    ymd: `${get("year")}-${get("month")}-${get("day")}`,
    weekday: get("weekday"),
    minutes: (Number(get("hour")) % 24) * 60 + Number(get("minute")),
    seconds: Number(get("second")),
  };
}

const isSession = (ymd: string, weekday: string) => weekday !== "Sat" && weekday !== "Sun" && !HOLIDAYS.has(ymd);

/** Finds the UTC instant of `minutes` past midnight New York time on the day of `date`. */
function atNyMinutes(date: Date, minutes: number) {
  const p = nyParts(date);
  const delta = (minutes - p.minutes) * 60 - p.seconds;
  return new Date(Math.floor(date.getTime() / 1000) * 1000 + delta * 1000);
}

export type MarketState = {
  open: boolean;
  /** Next official close (16:00 New York) at or after now. */
  nextClose: Date;
  /** Next session open when closed, else null. */
  nextOpen: Date | null;
  /** Last official close before now. */
  lastClose: Date;
};

export function marketState(now = new Date()): MarketState {
  const OPEN = 9 * 60 + 30;
  const CLOSE = 16 * 60;
  const p = nyParts(now);
  const todayIsSession = isSession(p.ymd, p.weekday);
  const open = todayIsSession && p.minutes >= OPEN && p.minutes < CLOSE;

  // Walk forward day by day (noon steps avoid DST edges) to find sessions.
  const step = (from: Date, dir: 1 | -1) => {
    let d = new Date(from.getTime());
    for (let i = 0; i < 14; i++) {
      d = new Date(d.getTime() + dir * 86_400_000);
      const q = nyParts(d);
      if (isSession(q.ymd, q.weekday)) return d;
    }
    return d;
  };

  const nextClose = todayIsSession && p.minutes < CLOSE ? atNyMinutes(now, CLOSE) : atNyMinutes(step(now, 1), CLOSE);
  let nextOpen: Date | null = null;
  if (!open) nextOpen = todayIsSession && p.minutes < OPEN ? atNyMinutes(now, OPEN) : atNyMinutes(step(now, 1), OPEN);
  const lastClose = todayIsSession && p.minutes >= CLOSE ? atNyMinutes(now, CLOSE) : atNyMinutes(step(now, -1), CLOSE);
  return { open, nextClose, nextOpen, lastClose };
}

export function formatUtc(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date) + " UTC";
}
