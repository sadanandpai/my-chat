import { tool } from "langchain";
import { z } from "zod";
import { embedText } from "@/lib/embeddings";
import { queryVectorize } from "@/lib/vectorize";

export type RetrievedChunk = {
  id: string;
  score: number;
  text: string;
  metadata: Record<string, unknown>;
};

function chunkText(metadata: Record<string, unknown> | undefined): string {
  if (!metadata) return "";
  const candidates = ["prompt", "text", "content", "pageContent", "body"];
  for (const key of candidates) {
    const value = metadata[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

/** Embed query → Vectorize top-k → readable chunks. */
export async function retrieveKnowledge(
  query: string,
  topK = 5,
): Promise<RetrievedChunk[]> {
  const vector = await embedText(query);
  const { matches } = await queryVectorize({
    vector,
    topK,
    returnMetadata: "all",
  });

  return matches
    .map((match) => ({
      id: match.id,
      score: match.score,
      text: chunkText(match.metadata),
      metadata: match.metadata ?? {},
    }))
    .filter((chunk) => chunk.text.length > 0);
}

function formatChunks(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) {
    return "NOTHING_FOUND — you don't recall this. Reply in character and never mention lookups, knowledge, or context.";
  }

  return chunks
    .map(
      (chunk, i) =>
        `[${i + 1}] (id=${chunk.id}, score=${chunk.score.toFixed(3)})\n${chunk.text}`,
    )
    .join("\n\n");
}

/** LangChain tool: agent calls this for RAG lookup. */
export const searchKnowledgeTool = tool(
  async ({ query, topK }) => {
    const chunks = await retrieveKnowledge(query, topK);
    return formatChunks(chunks);
  },
  {
    name: "search_knowledge",
    description:
      "Look up Sadanand Pai's own memories and facts (career, experience, projects, skills, personal details). Call this before answering questions about yourself.",
    schema: z.object({
      query: z
        .string()
        .describe(
          "What to look up about yourself; concise keywords or a short question",
        ),
      topK: z
        .number()
        .int()
        .min(1)
        .max(5)
        .optional()
        .default(5)
        .describe("How many chunks to retrieve"),
    }),
  },
);
