import Fuse from "fuse.js";
import { tool } from "langchain";
import { z } from "zod";
import { type CompanyRecord } from "@/constants/types";
import { getToolRecords } from "@/lib/helpers/tool-data";

export type { CompanyRecord };

async function loadCompanies(): Promise<CompanyRecord[]> {
  return getToolRecords<CompanyRecord>("companies");
}

function kindLabel(kind: CompanyRecord["kind"]): string {
  switch (kind) {
    case "employer":
      return "employer (worked here)";
    case "client":
      return "client site (via parent employer)";
    case "interview":
      return "interview / offer only (did not work here as employee)";
  }
}

function formatCompany(company: CompanyRecord): string {
  const lines = [
    `Name: ${company.name}`,
    `Kind: ${kindLabel(company.kind)}`,
  ];
  if (company.years) lines.push(`Years: ${company.years}`);
  if (company.role) lines.push(`Role: ${company.role}`);
  if (company.location) lines.push(`Location: ${company.location}`);
  if (company.parent) lines.push(`Parent employer: ${company.parent}`);
  if (company.outcome) lines.push(`Outcome: ${company.outcome}`);
  if (company.notes) lines.push(`Notes: ${company.notes}`);
  return lines.join("\n");
}

function formatMatches(
  matches: Array<{ item: CompanyRecord; score?: number }>,
): string {
  if (matches.length === 0) {
    return "NOTHING_FOUND — you have no record of this company. You did not work there and did not interview there. Say no plainly, then offer the closest real employer or interview from your roster. Never mention lookups, knowledge, tools, or files.";
  }

  return matches
    .map((match, i) => {
      const score =
        match.score !== undefined
          ? ` (score=${(1 - match.score).toFixed(2)})`
          : "";
      return `[${i + 1}] ${match.item.name}${score}\n${formatCompany(match.item)}`;
    })
    .join("\n\n");
}

function careerLine(company: CompanyRecord): string {
  const bits = [company.name, kindLabel(company.kind)];
  if (company.years) bits.push(company.years);
  if (company.role) bits.push(company.role);
  if (company.parent) bits.push(`via ${company.parent}`);
  return bits.join(" — ");
}

function interviewLine(company: CompanyRecord): string {
  const bits = [company.name];
  if (company.outcome) bits.push(company.outcome);
  else if (company.role) bits.push(company.role);
  return bits.join(" — ");
}

/** Compact roster: employers/clients first (chrono), then interviews. */
function formatRoster(items: CompanyRecord[]): string {
  const career = items
    .filter((c) => c.kind === "employer" || c.kind === "client")
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  const interviews = items.filter((c) => c.kind === "interview");

  const careerBlock = career
    .map((c, i) => `[${i + 1}] ${careerLine(c)}`)
    .join("\n");
  const interviewBlock = interviews
    .map((c, i) => `[${i + 1}] ${interviewLine(c)}`)
    .join("\n");

  return `Companies tied to your career (AUTHORITATIVE and COMPLETE — ${items.length} entries).

These are the ONLY companies you may name. Nobody outside this list is an employer, client site, or interview of yours — never invent another (e.g. plausible big-tech names).
- "employer" / "client site" = you worked there (client = via a parent employer, not a direct hire).
- "interview / offer only" = you interviewed or got an offer; you did NOT work there as an employee.
When asked where you worked / past companies / career path, list the career timeline. When asked "did you work at X?" or "interview at X?", look that name up (call this tool again with the name) — if NOTHING_FOUND, the answer is no.
For deep day-to-day work, interview rounds, or stories at a confirmed company, also use search_knowledge after this.

Career timeline (worked — employers & client sites):
${careerBlock}

Interviews / offers (did not work as employee):
${interviewBlock}`;
}

/** LangChain tool: fuzzy company lookup, or full roster when no name is given. */
export const lookupCompanyTool = tool(
  async ({ name }) => {
    const items = await loadCompanies();
    const query = name?.trim() ?? "";
    if (!query) {
      return formatRoster(items);
    }

    const fuse = new Fuse(items, {
      keys: ["name"],
      threshold: 0.3,
      includeScore: true,
    });
    const matches = fuse.search(query, { limit: 3 });
    return formatMatches(matches);
  },
  {
    name: "lookup_company",
    description:
      "AUTHORITATIVE source for companies tied to Sadanand's career: employers, client sites (e.g. Huawei via Infosys, Schneider via TekSystems), and places he only interviewed or got offers. Call this for 'where did you work', 'previous companies', 'career path', 'did you work at X', 'did you interview at X', 'have you been to X', or any named company as employer/interview. Pass NO name (or empty string) for the complete roster — ALWAYS do this for open-ended company lists. Pass a company name for one entry. Kind matters: 'interview' means he did NOT work there as an employee. After confirming a company here, use search_knowledge for deep tenure/interview-round detail. Do NOT invent employers. Do NOT use getIntro as the source of truth for employment history (intro is a short bio summary only). Do NOT use lookup_person for companies.",
    schema: z.object({
      name: z
        .string()
        .optional()
        .describe(
          "Company name to look up (e.g. 'CoinDCX', 'Flipkart', 'Schneider'). Omit or pass empty string to list every company on the roster.",
        ),
    }),
  },
);
