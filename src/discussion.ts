import type { Character } from "./characters.ts";

export const DISCUSSION_MIN = 2;
export const DISCUSSION_MAX = 4;
export const DEFAULT_ROUNDS = 2;
export const MIN_ROUNDS = 2;
export const MAX_ROUNDS = 5;

export const DISCUSSION_ATTITUDES = [
  {
    id: "professional",
    label: "Professional",
    instruction: "Keep workplace diction.",
  },
  {
    id: "polite",
    label: "Polite",
    instruction: "Stay courteous to the people in the room.",
  },
  {
    id: "rude",
    label: "Rude",
    instruction:
      "Be rude to weak claims and pretension, not to the other speakers.",
  },
  {
    id: "direct",
    label: "Direct",
    instruction: "Skip hedging. Say the point.",
  },
  {
    id: "witty",
    label: "Witty",
    instruction: "Allow dry humor.",
  },
  {
    id: "warm",
    label: "Warm",
    instruction: "Stay friendly.",
  },
  {
    id: "skeptical",
    label: "Skeptical",
    instruction: "Push back when a claim is thin.",
  },
  {
    id: "playful",
    label: "Playful",
    instruction: "Keep a light touch.",
  },
] as const;

export type DiscussionAttitudeId =
  (typeof DISCUSSION_ATTITUDES)[number]["id"];

export function extraInstructionsFromAttitudes(
  ids: readonly DiscussionAttitudeId[],
): string {
  if (ids.length === 0) return "";
  const selected = new Set(ids);
  const lines = DISCUSSION_ATTITUDES.filter((attitude) =>
    selected.has(attitude.id),
  ).map((attitude) => `- ${attitude.instruction}`);
  return `Use every selected attitude at once. They stack. Do not drop one for another.\n${lines.join("\n")}`;
}

export function attitudeLabels(
  ids: readonly DiscussionAttitudeId[],
): string {
  const selected = new Set(ids);
  return DISCUSSION_ATTITUDES.filter((attitude) => selected.has(attitude.id))
    .map((attitude) => attitude.label)
    .join(", ");
}

export type DiscussionTurn = {
  characterId: string;
  name: string;
  text: string;
};

export function rotatedOrder(ids: readonly string[]): string[] {
  if (ids.length === 0) return [];
  const start = Math.floor(Math.random() * ids.length);
  return [...ids.slice(start), ...ids.slice(0, start)];
}

export function discussionSystemPrompt(args: {
  character: Character;
  peers: readonly Character[];
  topic: string;
  extraInstructions: string;
}): string {
  const others = args.peers
    .filter((peer) => peer.id !== args.character.id)
    .map((peer) => peer.name)
    .join(", ");
  const extra =
    args.extraInstructions.trim().length > 0
      ? `\nHost notes for everyone: ${args.extraInstructions.trim()}`
      : "";
  return `${args.character.systemPrompt}

You are in a group discussion with other people in the room. The topic is: ${args.topic.trim()}${extra}

Others in the room: ${others}. Speak only as yourself. Do not speak for anyone else. There is no user to reply to. React to what has already been said if anything: agree, differ, or take a new angle, in your own voice. Stay at one or two sentences.`;
}

export function discussionUserContent(args: {
  speakerName: string;
  topic: string;
  turns: readonly DiscussionTurn[];
}): string {
  if (args.turns.length === 0) {
    return `Topic: ${args.topic.trim()}

No one has spoken yet. Open the discussion as ${args.speakerName}.`;
  }
  const soFar = args.turns
    .map((turn) => `${turn.name}: ${turn.text}`)
    .join("\n\n");
  return `Topic: ${args.topic.trim()}

Discussion so far:

${soFar}

Now speak as ${args.speakerName}.`;
}

export function transcriptText(args: {
  topic: string;
  extraInstructions: string;
  turns: readonly DiscussionTurn[];
}): string {
  const extra =
    args.extraInstructions.trim().length > 0
      ? `\nNotes: ${args.extraInstructions.trim()}\n`
      : "";
  const body = args.turns
    .map((turn) => `${turn.name}:\n${turn.text}`)
    .join("\n\n");
  return `Topic: ${args.topic.trim()}\n${extra}\n${body}\n`;
}
