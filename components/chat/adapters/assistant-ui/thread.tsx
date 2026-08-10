"use client";

import { AuiIf, ThreadPrimitive } from "@assistant-ui/react";
import { useCallback } from "react";
import type { ChatCopy, ChatPersona } from "../../types";
import { Composer } from "./composer";
import { AssistantMessage, UserMessage } from "./message";

type ThreadProps = {
  persona: ChatPersona;
  copy: ChatCopy;
};

export function Thread({ persona, copy }: ThreadProps) {
  const renderMessage = useCallback(
    ({ message }: { message: { role: string } }) =>
      message.role === "user" ? (
        <UserMessage />
      ) : (
        <AssistantMessage persona={persona} />
      ),
    [persona],
  );

  return (
    <ThreadPrimitive.Root className="flex min-h-0 flex-1 flex-col">
      <ThreadPrimitive.Viewport className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 py-8">
        <AuiIf condition={(s) => s.thread.isEmpty}>
          <EmptyState persona={persona} copy={copy} />
        </AuiIf>

        <ThreadPrimitive.Messages>{renderMessage}</ThreadPrimitive.Messages>
      </ThreadPrimitive.Viewport>

      <div className="sticky bottom-0 border-t border-zinc-200/60 bg-background px-4 py-4 dark:border-zinc-800/60">
        <Composer placeholder={copy.placeholder} />
      </div>
    </ThreadPrimitive.Root>
  );
}

function EmptyState({ persona, copy }: ThreadProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
        {persona.initials}
      </span>
      <div>
        <p className="text-lg font-medium">{copy.emptyTitle}</p>
        {copy.emptySubtitle ? (
          <p className="mt-1 max-w-sm text-sm text-zinc-500">
            {copy.emptySubtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}
