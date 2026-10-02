import type { Metadata } from "next";
import { PortfolioPage } from "@/components/app/Pages";

export const metadata: Metadata = { title: "Portfolio" };

export default function Page() {
  return <PortfolioPage />;
}
