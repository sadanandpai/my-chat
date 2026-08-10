import Fuse from "fuse.js";
import { tool } from "langchain";
import { z } from "zod";
import { projects, type ProjectRecord } from "@/data/projects";

export type { ProjectRecord };

const fuse = new Fuse(projects, {
  keys: ["name", "aliases", "description", "tech", "highlights", "notes"],
  threshold: 0.35,
  includeScore: true,
});

function formatProject(project: ProjectRecord): string {
  const lines = [
    `Name: ${project.name}`,
    `Repo: ${project.repo}`,
    `Description: ${project.description}`,
    `Tech: ${project.tech.join(", ")}`,
    `Stars (approx): ~${project.starsApprox}`,
  ];
  if (project.homepage) lines.push(`Homepage: ${project.homepage}`);
  if (project.highlights) lines.push(`Highlights: ${project.highlights}`);
  if (project.notes) lines.push(`Notes: ${project.notes}`);
  return lines.join("\n");
}

function formatList(items: ProjectRecord[]): string {
  return items
    .map(
      (p, i) =>
        `[${i + 1}] ${p.name} (~${p.starsApprox}★) — ${p.description}\n    ${p.repo}${p.homepage ? `\n    ${p.homepage}` : ""}`,
    )
    .join("\n\n");
}

function formatMatches(
  matches: Array<{ item: ProjectRecord; score?: number }>,
): string {
  if (matches.length === 0) {
    return "NOTHING_FOUND — you don't recall an open-source project matching that name. Say you haven't built that / don't recall it by that name, then offer your closest related projects. Never mention lookups, knowledge, tools, or files.";
  }

  return matches
    .map((match, i) => {
      const score =
        match.score !== undefined
          ? ` (score=${(1 - match.score).toFixed(2)})`
          : "";
      return `[${i + 1}] ${match.item.name}${score}\n${formatProject(match.item)}`;
    })
    .join("\n\n");
}

/** LangChain tool: list or fuzzy-lookup open-source projects. */
export const lookupProjectsTool = tool(
  async ({ query }) => {
    const q = query?.trim() ?? "";
    if (!q) {
      const sorted = [...projects].sort(
        (a, b) => b.starsApprox - a.starsApprox,
      );
      return `Open-source projects (AUTHORITATIVE list, sorted by approx stars):\n\n${formatList(sorted)}\n\nGitHub profile: https://github.com/sadanandpai`;
    }

    const matches = fuse.search(q, { limit: 5 });
    return formatMatches(matches);
  },
  {
    name: "lookup_projects",
    description:
      "AUTHORITATIVE source for Sadanand Pai's open-source / GitHub projects: names, repos, homepages, tech stacks, approx star counts, highlights, and short notes. Call this for 'your open source projects', 'GitHub projects', 'what have you built', 'tell me about X repo/project' (e.g. algo visualizers, JS code challenges, resume builder, frontend mini challenges, frontend learning kit). Pass an empty query to list all projects; pass a name/keyword to look up one. Do NOT use getIntro or search_knowledge for OSS project catalogs or project-specific facts covered here. For deep career-story context around how a project started (interviews that motivated it, company tenure timing), you may also use search_knowledge after this.",
    schema: z.object({
      query: z
        .string()
        .optional()
        .describe(
          "Project name or keyword (e.g. 'algo visualizers', 'resume builder'). Omit or pass empty string to list all open-source projects.",
        ),
    }),
  },
);
