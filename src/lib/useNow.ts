"use client";

import { useSyncExternalStore } from "react";

/* One shared one-second clock. The server snapshot is null, so anything
   time-based renders a placeholder first and the real value after hydration. */

const listeners = new Set<() => void>();
let current = 0;
let timer: number | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (timer === null) {
    current = Date.now();
    timer = window.setInterval(() => {
      current = Date.now();
      for (const l of listeners) l();
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  };
}

const snapshot = () => (current ? Math.floor(current / 1000) * 1000 : (current = Date.now(), Math.floor(current / 1000) * 1000));

/** Milliseconds since epoch, rounded to the second; null during server render. */
export function useNowMs(): number | null {
  return useSyncExternalStore(subscribe, snapshot, () => null);
}
