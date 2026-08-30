export const LLM_PROXY_URL = "https://llm-proxy.sadanandpai.workers.dev/";
export const HISTORY_WINDOW = 4;

export type ChatRole = "system" | "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ProxyMessagesBody = {
  messages: ChatMessage[];
};

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

export function proxyRequestBody(
  systemPrompt: string,
  body: unknown,
): ProxyMessagesBody {
  return {
    messages: [
      { role: "system", content: systemPrompt },
      ...historyFromBody(body),
    ],
  };
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
