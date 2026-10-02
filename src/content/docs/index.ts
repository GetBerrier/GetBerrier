import type { DocGroup, DocPage } from "./types";
import { overviewGroup } from "./overview";
import { conceptsGroup } from "./concepts";
import { protocolGroup } from "./protocol";
import { tokenGroup } from "./token";
import { riskGroup } from "./risk";
import { securityGroup } from "./security";
import { buildGroup } from "./build";
import { developersGroup } from "./developers";
import { governanceGroup } from "./governance";
import { referenceGroup } from "./reference";

export type { DocBlock, DocGroup, DocPage } from "./types";

export const DOC_GROUPS: DocGroup[] = [
  overviewGroup,
  conceptsGroup,
  protocolGroup,
  tokenGroup,
  riskGroup,
  securityGroup,
  buildGroup,
  developersGroup,
  governanceGroup,
  referenceGroup,
];

export const ALL_DOCS: DocPage[] = DOC_GROUPS.flatMap((group) => group.pages);

export function findDoc(slug: string): DocPage | undefined {
  const clean = slug.replace(/^\/+|\/+$/g, "");
  return ALL_DOCS.find((page) => page.slug === clean);
}
