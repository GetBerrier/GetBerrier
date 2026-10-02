import type { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";
import { ALL_DOCS } from "@/content/docs";

const PAGES = ["", "/analytics", "/community", "/build", "/build/sdk", "/credit", "/omnichain", "/app", "/app/portfolio", "/app/desk", "/app/stake", "/app/bonds", "/app/buyback", "/app/governance", "/app/governance/lock", "/app/governance/proposals", "/app/governance/gauges"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...PAGES.map((p) => ({ url: `${BRAND.url}${p}` })), ...ALL_DOCS.map((d) => ({ url: `${BRAND.url}/docs${d.slug ? "/" + d.slug : ""}` }))];
}
