export type KnowledgeChunk = {
  /** Stable id derived from the section heading (slug). */
  id: string;
  /** Heading text without the leading ##. */
  title: string;
  /** Full text to embed and store in Vectorize metadata.text. */
  text: string;
  /** Parsed fields for filters / debugging. */
  metadata: {
    title: string;
    company?: string;
    years?: string;
    role?: string;
    location?: string;
    topics: string[];
    context: Record<string, string>;
    source: "data/data.txt";
    part?: number;
    parts?: number;
  };
};

export type ChunkKnowledgeOptions = {
  /**
   * Soft max chars per embed text. Tuned for `@cf/baai/bge-base-en-v1.5` (~512 tokens).
   * Long H2 sections are split on paragraph boundaries while keeping the header.
   */
  maxChars?: number;
};

/** Cloudflare Vectorize vector id max length. */
export const VECTORIZE_MAX_ID_BYTES = 64;

/** Default keeps embeddings under typical BGE 512-token truncation. */
export const DEFAULT_MAX_CHUNK_CHARS = 1800;

const SECTION_SPLIT = /^## (.+)$/gm;

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function truncateToBytes(value: string, maxBytes: number): string {
  let out = value;
  while (out.length > 0 && Buffer.byteLength(out, "utf8") > maxBytes) {
    out = out.slice(0, -1);
  }
  return out.replace(/-+$/, "") || "chunk";
}

/** Truncate a slug so `prefix + suffix` stays within Vectorize's 64-byte id limit. */
function fitId(prefix: string, suffix = ""): string {
  const maxPrefix = VECTORIZE_MAX_ID_BYTES - Buffer.byteLength(suffix, "utf8");
  return `${truncateToBytes(prefix, maxPrefix)}${suffix}`;
}

function parseContextLine(body: string): Record<string, string> {
  const match = body.match(/^\*\*Context:\*\*\s*(.+)$/m);
  if (!match) return {};

  const context: Record<string, string> = {};
  for (const part of match[1].split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key && value) context[key] = value;
  }
  return context;
}

function parseTopicsLine(body: string): string[] {
  const match = body.match(/^\*\*Topics:\*\*\s*(.+)$/m);
  if (!match) return [];
  return match[1]
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function buildHeader(
  title: string,
  contextLine?: string,
  topicsLine?: string,
): string {
  return [`## ${title}`, contextLine, topicsLine]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}

/** Pack paragraphs into parts that fit under maxChars including the shared header. */
function splitNarrative(
  header: string,
  narrative: string,
  maxChars: number,
): string[] {
  const budget = Math.max(200, maxChars - header.length - 2);
  const paragraphs = narrative
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return [];

  const parts: string[] = [];
  let current = "";

  const flush = () => {
    if (current) {
      parts.push(current);
      current = "";
    }
  };

  for (const paragraph of paragraphs) {
    if (paragraph.length > budget) {
      flush();
      // Hard-split oversized paragraphs by sentence-ish boundaries.
      let remaining = paragraph;
      while (remaining.length > budget) {
        let cut = remaining.lastIndexOf(". ", budget);
        if (cut < budget * 0.4) cut = budget;
        else cut += 1; // keep the period
        parts.push(remaining.slice(0, cut).trim());
        remaining = remaining.slice(cut).trim();
      }
      if (remaining) current = remaining;
      continue;
    }

    const next = current ? `${current}\n\n${paragraph}` : paragraph;
    if (next.length > budget && current) {
      flush();
      current = paragraph;
    } else {
      current = next;
    }
  }
  flush();
  return parts;
}

function allocateBaseId(
  base: string,
  usedIds: Map<string, number>,
  reserveBytes: number,
): string {
  const truncated = truncateToBytes(base, VECTORIZE_MAX_ID_BYTES - reserveBytes);
  const count = usedIds.get(truncated) ?? 0;
  usedIds.set(truncated, count + 1);
  if (count === 0) return truncated;
  return fitId(truncated, `-${count + 1}`);
}

/**
 * Split `data/data.txt` (markdown H2 sections) into RAG chunks.
 * Each `##` section becomes one or more self-contained chunks with title, context, topics, and body.
 */
export function chunkKnowledgeMarkdown(
  markdown: string,
  options: ChunkKnowledgeOptions = {},
): KnowledgeChunk[] {
  const maxChars = options.maxChars ?? DEFAULT_MAX_CHUNK_CHARS;
  const matches = [...markdown.matchAll(SECTION_SPLIT)];
  if (matches.length === 0) return [];

  const chunks: KnowledgeChunk[] = [];
  const usedIds = new Map<string, number>();

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const title = match[1].trim();
    const start = (match.index ?? 0) + match[0].length;
    const end =
      i + 1 < matches.length
        ? (matches[i + 1].index ?? markdown.length)
        : markdown.length;

    let body = markdown.slice(start, end).trim();
    body = body.replace(/^---\s*$/gm, "").trim();

    const context = parseContextLine(body);
    const topics = parseTopicsLine(body);
    const contextLine = body.match(/^\*\*Context:\*\*\s*.+$/m)?.[0];
    const topicsLine = body.match(/^\*\*Topics:\*\*\s*.+$/m)?.[0];
    const narrative = body
      .replace(/^\*\*Context:\*\*\s*.+$/m, "")
      .replace(/^\*\*Topics:\*\*\s*.+$/m, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (!narrative) continue;

    const header = buildHeader(title, contextLine, topicsLine);
    const narratives =
      header.length + 2 + narrative.length <= maxChars
        ? [narrative]
        : splitNarrative(header, narrative, maxChars);

    const reserveBytes =
      narratives.length > 1 ? Buffer.byteLength("-part-99", "utf8") : 0;
    const baseId = allocateBaseId(
      slugify(title) || `section-${i + 1}`,
      usedIds,
      reserveBytes,
    );

    for (let partIndex = 0; partIndex < narratives.length; partIndex++) {
      const partNarrative = narratives[partIndex];
      const text = `${header}\n\n${partNarrative}`.trim();
      const id =
        narratives.length === 1
          ? baseId
          : fitId(baseId, `-part-${partIndex + 1}`);

      if (Buffer.byteLength(id, "utf8") > VECTORIZE_MAX_ID_BYTES) {
        throw new Error(
          `Vectorize id exceeds ${VECTORIZE_MAX_ID_BYTES} bytes: ${id}`,
        );
      }

      chunks.push({
        id,
        title,
        text,
        metadata: {
          title,
          company: context.company,
          years: context.years ?? context.period ?? context.joined,
          role: context.role,
          location: context.location ?? context.locations,
          topics,
          context,
          source: "data/data.txt",
          ...(narratives.length > 1
            ? { part: partIndex + 1, parts: narratives.length }
            : {}),
        },
      });
    }
  }

  return chunks;
}
