import type { Metadata } from "next";
import { BackstopPage } from "@/components/app/Pages";

export const metadata: Metadata = { title: "Backstop" };

export default function Page() {
  return <BackstopPage />;
}
