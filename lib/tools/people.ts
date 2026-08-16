import Fuse from "fuse.js";
import { tool } from "langchain";
import { z } from "zod";
import { type PersonRecord } from "@/constants/types";
import { getToolData, getToolRecords } from "@/lib/helpers/tool-data";

const NOTHING_FOUND =
  "NOTHING_FOUND — you don't recall this person. Reply in character (you may not know them, or don't share private details) and never mention lookups, knowledge, tools, or files.";

/** LangChain tool: fuzzy person lookup, or the full roster when no name is given. */
export const lookupPersonTool = tool(
  async ({ name }) => {
    const query = name?.trim() ?? "";
    if (!query) {
      return getToolData("people");
    }

    const items = await getToolRecords<PersonRecord>("people");
    const fuse = new Fuse(items, {
      keys: ["name", "aliases"],
      threshold: 0.3,
    });
    const matches = fuse.search(query, { limit: 3 });
    if (matches.length === 0) return NOTHING_FOUND;
    return JSON.stringify(
      matches.map((match) => match.item),
      null,
      2,
    );
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
