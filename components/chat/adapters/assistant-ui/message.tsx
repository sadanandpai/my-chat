"use client";

import { ErrorPrimitive, MessagePrimitive } from "@assistant-ui/react";
import type { ChatPersona } from "../../types";
import { MarkdownText } from "./markdown-text";

export function UserMessage() {
  return (
    <MessagePrimitive.Root className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl rounded-br-md bg-zinc-900 px-4 py-2.5 text-sm leading-relaxed text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
        <MessagePrimitive.Parts />
      </div>
    </MessagePrimitive.Root>
  );
}

export function AssistantMessage({ persona }: { persona: ChatPersona }) {
  return (
    <MessagePrimitive.Root className="flex gap-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
        {persona.initials}
      </span>

      <div className="min-w-0 flex-1 pt-1 text-sm leading-relaxed">
        <MessagePrimitive.Parts components={{ Text: MarkdownText }} />

        <MessagePrimitive.Error>
          <ErrorPrimitive.Root className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            <ErrorPrimitive.Message />
          </ErrorPrimitive.Root>
        </MessagePrimitive.Error>
      </div>
    </MessagePrimitive.Root>
  );
}
