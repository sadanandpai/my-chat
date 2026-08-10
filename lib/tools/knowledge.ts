import { tool } from "langchain";
import { z } from "zod";
import { embedText } from "@/lib/helpers/embeddings";
import { queryVectorize } from "@/lib/helpers/vectorize";

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

/**
 * Floor for obvious non-matches. Deliberately low: similarity alone cannot separate
 * "interview at Microsoft" (~0.76, not in the corpus) from "how did you learn CSS"
 * (~0.68, in the corpus). Grounding rules below do that work instead.
 */
const MIN_SCORE = Number(process.env.RAG_MIN_SCORE ?? 0.62);

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
    .filter((chunk) => chunk.text.length > 0 && chunk.score >= MIN_SCORE);
}

const NOTHING_FOUND =
  "NOTHING_FOUND — nothing in your memory covers this. Say you haven't done it / don't recall it. Never mention lookups, knowledge, or context.";

const GROUNDING_RULES = `These are the closest fragments of your memory. They are matched by similarity, so they are often only loosely related and may have NOTHING to do with the question.

Before answering, check the fragments for the exact thing being asked about — the specific company, employer, interview, person, project, event, or number.
- If it is NOT named in the fragments below, it did NOT happen to you. Say no / that you haven't / that you don't recall, then offer what you did do.
- Similar things are not the same thing. Fragments about interviewing at one company are NOT evidence that you interviewed at a different company.
- Never generalize a fragment into a claim it does not state. Never invent details to sound consistent.`;

export function formatChunks(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) {
    return NOTHING_FOUND;
  }

  const body = chunks
    .map(
      (chunk, i) =>
        `[${i + 1}] (id=${chunk.id}, score=${chunk.score.toFixed(3)})\n${chunk.text}`,
    )
    .join("\n\n");

  return `${GROUNDING_RULES}\n\n---\n\n${body}`;
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
      "Look up DEEP details about Sadanand Pai's career story, projects, skills, and technical work: interviews and hiring processes (rounds, format, outcome) at any company, what he actually did at a past employer, specific projects, tech stacks, accomplishments, opinions shaped by his work. ALWAYS call this when a company is named alongside anything beyond the bare fact of employment — interviews, rounds, offers, rejections, teams, day-to-day work. Only skip it for pure bio/overview lookups (the list of employers, role titles, years of experience, location, contact/socials, hobbies, games) — those are handled by getIntro. Do NOT use for whether he knows a person / colleagues / mentors / friends — use lookup_person for that.",
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
