import type { Metadata } from "next";
import { ProductShell } from "@/components/app/AppShell";
import { OmniPage } from "@/components/app/Products";

export const metadata: Metadata = { title: "Omni", description: "Move CARRY and GUARD legs to other chains over LayerZero while escrow stays on Robinhood Chain." };

export default function Page() {
  return (
    <ProductShell current="Omni" partners={["Robinhood Chain", "Chainlink", "LayerZero"]}>
      <OmniPage />
    </ProductShell>
  );
}
