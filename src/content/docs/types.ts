// Documentation is plain data rendered by src/components/docs. Inline text in
// "p", list items, table cells and callouts understands a small markup:
// **bold**, `code` and [label](href). Internal links use site paths such as
// /docs/concepts/barrier or /app/desk.

export type DocBlock =
  | { t: "p"; text: string }
  | { t: "h2"; text: string; id?: string }
  | { t: "h3"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "code"; lang: string; code: string; title?: string }
  | { t: "callout"; tone: "note" | "tip" | "caution"; title?: string; text: string }
  | { t: "formula"; text: string }
  | { t: "cards"; items: { title: string; text: string; href?: string }[] };

export type DocPage = {
  /** Path below /docs, "" for the docs home, e.g. "concepts/barrier". */
  slug: string;
  title: string;
  /** One sentence, used for the page lead and the meta description. */
  description: string;
  blocks: DocBlock[];
};

export type DocGroup = {
  label: string;
  pages: DocPage[];
};
