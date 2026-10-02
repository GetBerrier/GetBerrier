import type { Metadata } from "next";
import { SeriesPage } from "@/components/app/Pages";

export const metadata: Metadata = { title: "Series" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SeriesPage id={decodeURIComponent(id).slice(0, 40)} />;
}
