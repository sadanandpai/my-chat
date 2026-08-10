import { tool } from "langchain";
import { z } from "zod";
import { getToolData } from "@/lib/helpers/tool-data";

/** LangChain tool: personal intro for "about me" style asks. */
export const getIntroTool = tool(
  async () => {
    return getToolData("intro");
  },
  {
    name: "getIntro",
    description:
      "AUTHORITATIVE source for Sadanand Pai's bio/overview facts: current role title and seniority, total years of experience, where he lives, nicknames, social media and contact links, hobbies, favorite games/movies/series. Call this for 'who are you', 'introduce yourself', 'tell me about yourself', contact/socials, location, hobbies, or games. For employment history, 'where did you work', 'previous companies', 'did you work at X', or any named employer/interview — use lookup_company (intro's company line is only a short summary and is incomplete). Do NOT use for people in his network — use lookup_person. Do NOT use for open-source / GitHub projects — use lookup_projects. Do NOT use for interview rounds or deep day-to-day work at a company — use lookup_company first, then search_knowledge.",
    schema: z.object({}),
  },
);
