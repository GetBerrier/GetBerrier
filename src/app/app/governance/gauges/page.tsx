import type { Metadata } from "next";
import { GaugesPage } from "@/components/app/Governance";

export const metadata: Metadata = { title: "Gauges" };

export default function Page() {
  return <GaugesPage />;
}
