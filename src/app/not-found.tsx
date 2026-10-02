import Link from "next/link";
import { Mark } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <Mark size={40} className="mx-auto block" />
        <p className="mt-8 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-3">404</p>
        <h1 className="mt-3 font-display text-[40px]">Below the barrier.</h1>
        <p className="mt-3 text-ink-2">This page does not exist.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn btn-metal">
            Home
          </Link>
          <Link href="/docs" className="btn btn-ghost">
            Docs
          </Link>
        </div>
      </div>
    </main>
  );
}
