import type { Metadata } from "next";
import { GovernanceOverview } from "@/components/app/Governance";

export const metadata: Metadata = { title: "Governance" };

export default function Page() {
  return <GovernanceOverview />;
}
