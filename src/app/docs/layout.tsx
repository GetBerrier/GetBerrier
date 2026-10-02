import type { Metadata } from "next";
import { DOC_GROUPS } from "@/content/docs";
import { DocsChrome } from "@/components/docs/DocsChrome";

export const metadata: Metadata = { title: { default: "Docs", template: "%s | Get Berrier docs" } };

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const groups = DOC_GROUPS.map((g) => ({ label: g.label, pages: g.pages.map((p) => ({ slug: p.slug, title: p.title })) }));
  return <DocsChrome groups={groups}>{children}</DocsChrome>;
}
