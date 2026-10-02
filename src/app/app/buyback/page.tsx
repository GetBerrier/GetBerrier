import type { Metadata } from "next";
import { BuybackPage } from "@/components/app/Pages";

export const metadata: Metadata = { title: "Buyback" };

export default function Page() {
  return <BuybackPage />;
}
