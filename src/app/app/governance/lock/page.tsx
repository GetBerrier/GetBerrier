import type { Metadata } from "next";
import { LockPage } from "@/components/app/Governance";

export const metadata: Metadata = { title: "Lock" };

export default function Page() {
  return <LockPage />;
}
