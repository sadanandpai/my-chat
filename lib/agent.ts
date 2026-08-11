import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MemorySaver } from "@langchain/langgraph";
import { createAgent, summarizationMiddleware } from "langchain";
import { summaryPrefix, summaryPrompt, systemPrompt } from "@/lib/prompts";
import { stripToolMessagesMiddleware } from "@/lib/middlewares/strip-tool-messages";
import { searchKnowledgeTool } from "@/lib/tools/knowledge";
import { getIntroTool } from "@/lib/tools/intro";
import { lookupCompanyTool } from "@/lib/tools/companies";
import { lookupPersonTool } from "@/lib/tools/people";
import { lookupProjectsTool } from "@/lib/tools/projects";

// In-process memory: fine for local dev / single instance.
// Swap for a Redis/Postgres checkpointer before running multi-instance.
const checkpointer = new MemorySaver();

export const agent = createAgent({
  model: new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash-lite",
    temperature: 0.25,
  }),
  tools: [
    getIntroTool,
    lookupCompanyTool,
    lookupPersonTool,
    lookupProjectsTool,
    searchKnowledgeTool,
  ],
  middleware: [
    // Run before summarizer so tool payloads don't inflate token/message counts.
    stripToolMessagesMiddleware,
    summarizationMiddleware({
      model: new ChatGoogleGenerativeAI({
        model: "gemini-3.5-flash-lite",
        temperature: 0.1,
        // Keeps summary tokens out of the "messages" stream, so the UI never renders them.
        tags: ["langsmith:nostream"],
      }),
      trigger: { messages: 5 },
      keep: { messages: 2 },
      summaryPrefix,
      summaryPrompt,
    }),
  ],
  systemPrompt,
  checkpointer,
});
