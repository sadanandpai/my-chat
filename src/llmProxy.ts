function envOr(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

export const LLM_PROXY_URL = "https://llm-proxy.sadanandpai.workers.dev/";
export const OLLAMA_CHAT_URL = envOr(
  import.meta.env.VITE_OLLAMA_URL,
  "/ollama/api/chat",
);
export const OLLAMA_MODEL = envOr(import.meta.env.VITE_OLLAMA_MODEL, "llama3.2");
export const HISTORY_WINDOW = 4;

export type LlmBackend =
  | { kind: "proxy"; url: string }
  | { kind: "ollama"; url: string; model: string };

function resolveLlmBackend(): LlmBackend {
  const forced = import.meta.env.VITE_LLM_BACKEND;
  const useOllama =
    forced === "ollama" || (forced !== "proxy" && import.meta.env.DEV);
  if (useOllama) {
    return { kind: "ollama", url: OLLAMA_CHAT_URL, model: OLLAMA_MODEL };
  }
  return { kind: "proxy", url: LLM_PROXY_URL };
}

export const LLM_BACKEND = resolveLlmBackend();

export type ChatRole = "system" | "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ProxyMessagesBody = {
  messages: ChatMessage[];
};

export type OllamaChatBody = {
  model: string;
  stream: false;
  messages: ChatMessage[];
};

export type ChatRequestBody = ProxyMessagesBody | OllamaChatBody;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function outgoingRole(role: unknown): "user" | "assistant" | undefined {
  if (role === "user") return "user";
  if (role === "assistant" || role === "ai") return "assistant";
  return undefined;
}

function messageText(item: unknown): string | undefined {
  if (!isRecord(item)) return undefined;
  if (typeof item.content === "string") return item.content;
  if (typeof item.text === "string") return item.text;
  return undefined;
}

function historyFromBody(body: unknown): ChatMessage[] {
  const raw =
    isRecord(body) && Array.isArray(body.messages) ? body.messages : [];
  const mapped: ChatMessage[] = [];
  for (const item of raw) {
    const role = outgoingRole(isRecord(item) ? item.role : undefined);
    const content = messageText(item);
    if (role === undefined || content === undefined) continue;
    mapped.push({ role, content });
  }
  return mapped.slice(-HISTORY_WINDOW);
}

function requestBodyForMessages(messages: ChatMessage[]): ChatRequestBody {
  if (LLM_BACKEND.kind === "ollama") {
    return { model: LLM_BACKEND.model, stream: false, messages };
  }
  return { messages };
}

export function proxyRequestBody(args: {
  systemPrompt: string;
  body: unknown;
}): ChatRequestBody {
  return requestBodyForMessages([
    { role: "system", content: args.systemPrompt },
    ...historyFromBody(args.body),
  ]);
}

export function assistantReplyFromProxy(
  data: unknown,
): { text: string } | { error: string } {
  if (!isRecord(data)) return { error: "Unexpected response" };
  if (typeof data.error === "string") return { error: data.error };
  const message = data.message;
  if (!isRecord(message) || typeof message.content !== "string") {
    return { error: "Unexpected response" };
  }
  return { text: message.content };
}

export async function completeChat(args: {
  systemPrompt: string;
  userContent: string;
  signal: AbortSignal;
}): Promise<{ text: string } | { error: string }> {
  const body = requestBodyForMessages([
    { role: "system", content: args.systemPrompt },
    { role: "user", content: args.userContent },
  ]);
  let response: Response;
  try {
    response = await fetch(LLM_BACKEND.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: args.signal,
      body: JSON.stringify(body),
    });
  } catch (error) {
    if (args.signal.aborted) return { error: "Stopped" };
    return {
      error: error instanceof Error ? error.message : "Request failed",
    };
  }
  if (!response.ok) {
    return { error: `LLM returned ${response.status}` };
  }
  return assistantReplyFromProxy(await response.json());
}
