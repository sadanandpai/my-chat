import Fuse from "fuse.js";
import { tool } from "langchain";
import { z } from "zod";
import { type PersonRecord } from "@/constants/types";
import { getToolRecords } from "@/lib/helpers/tool-data";

async function loadPeople(): Promise<PersonRecord[]> {
  return getToolRecords<PersonRecord>("people");
}

function formatPerson(person: PersonRecord): string {
  return `[Name] ${person.name}
  [Company] ${person.company}
  [Relationship] ${person.relationship}
  [Notes] ${person.notes}`;
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

/** Compact roster: enough to name and characterise people, without the long notes. */
function formatRoster(items: PersonRecord[]): string {
  const rows = items
    .map((person, i) => {
      const parts = [person.name];
      if (person.company) parts.push(person.company);
      if (person.relationship) parts.push(person.relationship);
      return `[${i + 1}] ${parts.join(" — ")}`;
    })
    .join("\n");

  return `Everyone you recall from your career and network (AUTHORITATIVE and COMPLETE — ${items.length} people).

These are the ONLY people you know. Nobody outside this list exists to you: never name another person.
Company names on this roster are context for these people only — for employers / 'did you work at X' / career timeline, use lookup_company.
Pick the ones the question is actually about (mentors, guides, leads, collaborators, friends) using the relationship shown. If asked to name them, name them — do not say there are too many to list.
Call this tool again with a name for the full story on any one person.

${rows}`;
}

/** LangChain tool: fuzzy person lookup, or the full roster when no name is given. */
export const lookupPersonTool = tool(
  async ({ name }) => {
    const items = await loadPeople();
    const query = name?.trim() ?? "";
    if (!query) {
      return formatRoster(items);
    }

    const fuse = new Fuse(items, {
      keys: ["name", "aliases"],
      threshold: 0.3,
      includeScore: true,
    });
    const matches = fuse.search(query, { limit: 3 });
    return formatMatches(matches);
  },
  {
    name: "lookup_person",
    description:
      "AUTHORITATIVE source for the people in Sadanand's career and network (colleagues, mentors, guides, leads, teammates, friends, collaborators) and how they relate to him. Pass a name for one person: 'do you know X', 'who is X', 'have you worked with X'. Pass NO name (or an empty string) to get the complete roster of everyone he knows — ALWAYS do this for questions with no single name in them, such as 'who inspired you', 'who are your mentors', 'who did you learn from', 'who helped you', 'who have you worked with', 'name all of them', 'who else', 'list them'. Never answer a people question from memory or from generic reasoning: if the ask is about people, call this tool first. Do NOT use search_knowledge or getIntro for people/relationship questions.",
    schema: z.object({
      name: z
        .string()
        .optional()
        .describe(
          "Person's name to look up (e.g. 'Utkarsh', 'Sunny Puri'). Omit or pass an empty string to list everyone he knows.",
        ),
    }),
  },
);
