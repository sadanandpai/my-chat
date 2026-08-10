import Fuse from "fuse.js";
import { tool } from "langchain";
import { z } from "zod";
import { people, type PersonRecord } from "@/data/people";

export type { PersonRecord };

const fuse = new Fuse(people, {
  keys: ["name", "aliases"],
  threshold: 0.3,
  includeScore: true,
});

function formatPerson(person: PersonRecord): string {
  const lines = [`Name: ${person.name}`];
  if (person.company) lines.push(`Company / context: ${person.company}`);
  if (person.relationship) lines.push(`Relationship: ${person.relationship}`);
  if (person.notes) lines.push(`Notes: ${person.notes}`);
  return lines.join("\n");
}

function formatMatches(
  matches: Array<{ item: PersonRecord; score?: number }>,
): string {
  if (matches.length === 0) {
    return "NOTHING_FOUND — you don't recall this person. Reply in character (you may not know them, or don't share private details) and never mention lookups, knowledge, tools, or files.";
  }

  return matches
    .map((match, i) => {
      const score =
        match.score !== undefined
          ? ` (score=${(1 - match.score).toFixed(2)})`
          : "";
      return `[${i + 1}] ${match.item.name}${score}\n${formatPerson(match.item)}`;
    })
    .join("\n\n");
}

/** LangChain tool: fuzzy person lookup via Fuse.js. */
export const lookupPersonTool = tool(
  async ({ name }) => {
    const matches = fuse.search(name.trim(), { limit: 3 });
    return formatMatches(matches);
  },
  {
    name: "lookup_person",
    description:
      "AUTHORITATIVE source for whether Sadanand knows a person and how they relate (colleagues, mentors, friends, teammates). Call this when someone asks 'do you know X', 'who is X', 'have you worked with X', or mentions a person's name in relation to Sadanand's network. Pass the person's name only. Do NOT use search_knowledge or getIntro for people/relationship questions.",
    schema: z.object({
      name: z
        .string()
        .min(1)
        .describe("Person's name to look up (e.g. 'Utkarsh', 'Sunny Puri')"),
    }),
  },
);
