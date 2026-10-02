import type { Metadata } from "next";
import { ProductShell } from "@/components/app/AppShell";
import { CreditPage } from "@/components/app/Products";

export const metadata: Metadata = { title: "Credit", description: "Borrow USDG against CARRY legs in a Morpho market on Robinhood Chain." };

export default function Page() {
  return (
    <ProductShell current="Credit" partners={["Robinhood Chain", "Chainlink", "Morpho"]}>
      <CreditPage />
    </ProductShell>
  );
}
