import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chunkKnowledgeMarkdown } from "../lib/helpers/chunk-knowledge";
import { embedText } from "../lib/helpers/embeddings";
import { upsertVectors } from "../lib/helpers/vectorize";

const DATA_PATH = resolve(process.cwd(), "data/data.txt");
const BATCH_SIZE = 10;
const dryRun = process.argv.includes("--dry-run");

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const markdown = readFileSync(DATA_PATH, "utf8");
  const chunks = chunkKnowledgeMarkdown(markdown);

  console.log(`Loaded ${chunks.length} chunks from ${DATA_PATH}`);

  if (dryRun) {
    for (const chunk of chunks) {
      console.log(
        `- ${chunk.id} (${chunk.text.length} chars)` +
          (chunk.metadata.company ? ` company=${chunk.metadata.company}` : ""),
      );
    }
    console.log("\nDry run only — no embed / upsert. Drop --dry-run to ingest.");
    return;
  }

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const vectors = [];

    for (const chunk of batch) {
      const values = await embedText(chunk.text);
      vectors.push({
        id: chunk.id,
        values,
        metadata: {
          text: chunk.text,
          title: chunk.metadata.title,
          source: chunk.metadata.source,
          ...(chunk.metadata.company
            ? { company: chunk.metadata.company }
            : {}),
          ...(chunk.metadata.years ? { years: chunk.metadata.years } : {}),
          ...(chunk.metadata.role ? { role: chunk.metadata.role } : {}),
          ...(chunk.metadata.location
            ? { location: chunk.metadata.location }
            : {}),
          ...(chunk.metadata.topics.length
            ? { topics: chunk.metadata.topics.join(", ") }
            : {}),
        },
      });
      console.log(`Embedded ${i + vectors.length}/${chunks.length}: ${chunk.id}`);
      // Light throttle to avoid Workers AI rate limits.
      await sleep(150);
    }

    const result = await upsertVectors(vectors);
    console.log(
      `Upserted batch ${Math.floor(i / BATCH_SIZE) + 1} (mutationId=${result.mutationId})`,
    );
  }

  console.log(`Done. Upserted ${chunks.length} vectors.`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
