import type { Metadata } from "next";
import { BondsPage } from "@/components/app/Pages";

export const metadata: Metadata = { title: "Bonds" };

export default function Page() {
  return <BondsPage />;
}
