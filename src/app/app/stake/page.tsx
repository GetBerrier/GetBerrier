import type { Metadata } from "next";
import { StakePage } from "@/components/app/Pages";

export const metadata: Metadata = { title: "Stake" };

export default function Page() {
  return <StakePage />;
}
