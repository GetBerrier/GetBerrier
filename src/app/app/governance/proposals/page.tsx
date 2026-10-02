import type { Metadata } from "next";
import { ProposalsPage } from "@/components/app/Governance";

export const metadata: Metadata = { title: "Proposals" };

export default function Page() {
  return <ProposalsPage />;
}
