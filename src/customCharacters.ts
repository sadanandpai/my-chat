import { useMemo, useSyncExternalStore } from "react";
import {
  CHARACTERS,
  customAvatarUrl,
  isCustomAvatarId,
  type Character,
  type CustomAvatarId,
  type CustomCharacter,
} from "./characters.ts";

const STORAGE_KEY = "character-chat.custom-characters";

export type CustomCharacterDraft = {
  name: string;
  blurb: string;
  systemPrompt: string;
  avatarId: CustomAvatarId;
};

export const CHARACTER_FIELD_LIMITS = {
  name: { min: 3, max: 20 },
  blurb: { min: 3, max: 30 },
  systemPrompt: { min: 10, max: 600 },
} as const;

function inFieldRange(
  value: string,
  limits: { readonly min: number; readonly max: number },
): boolean {
  return value.length >= limits.min && value.length <= limits.max;
}

function trimmedDraft(draft: CustomCharacterDraft): CustomCharacterDraft {
  return {
    name: draft.name.trim(),
    blurb: draft.blurb.trim(),
    systemPrompt: draft.systemPrompt.trim(),
    avatarId: draft.avatarId,
  };
}

export function characterDraftError(
  draft: CustomCharacterDraft,
): string | undefined {
  const fields = trimmedDraft(draft);
  if (!inFieldRange(fields.name, CHARACTER_FIELD_LIMITS.name)) {
    return `Name must be ${CHARACTER_FIELD_LIMITS.name.min}–${CHARACTER_FIELD_LIMITS.name.max} characters.`;
  }
  if (!inFieldRange(fields.blurb, CHARACTER_FIELD_LIMITS.blurb)) {
    return `Blurb must be ${CHARACTER_FIELD_LIMITS.blurb.min}–${CHARACTER_FIELD_LIMITS.blurb.max} characters.`;
  }
  if (!inFieldRange(fields.systemPrompt, CHARACTER_FIELD_LIMITS.systemPrompt)) {
    return `System prompt must be ${CHARACTER_FIELD_LIMITS.systemPrompt.min}–${CHARACTER_FIELD_LIMITS.systemPrompt.max} characters.`;
  }
  return undefined;
}

const listeners = new Set<() => void>();

let cachedRaw = "";
let cachedCustom: CustomCharacter[] = [];

function emit(): void {
  for (const listener of listeners) listener();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseCustomCharacter(value: unknown): CustomCharacter | undefined {
  if (!isRecord(value)) return undefined;
  const { id, name, blurb, systemPrompt, avatarId } = value;
  if (typeof id !== "string" || id.length === 0) return undefined;
  if (CHARACTERS.some((character) => character.id === id)) return undefined;
  if (typeof name !== "string" || typeof blurb !== "string") return undefined;
  if (typeof systemPrompt !== "string") return undefined;
  if (!isCustomAvatarId(avatarId)) return undefined;
  if (
    characterDraftError({ name, blurb, systemPrompt, avatarId }) !== undefined
  ) {
    return undefined;
  }
  return {
    kind: "custom",
    id,
    name: name.trim(),
    blurb: blurb.trim(),
    systemPrompt: systemPrompt.trim(),
    avatarId,
    avatar: customAvatarUrl(avatarId),
  };
}

function parseList(raw: string): CustomCharacter[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    const list: CustomCharacter[] = [];
    for (const item of parsed) {
      const character = parseCustomCharacter(item);
      if (character === undefined) continue;
      if (seen.has(character.id)) continue;
      seen.add(character.id);
      list.push(character);
    }
    return list;
  } catch {
    return [];
  }
}

function persist(list: CustomCharacter[]): void {
  const payload = JSON.stringify(
    list.map((character) => ({
      id: character.id,
      name: character.name,
      blurb: character.blurb,
      systemPrompt: character.systemPrompt,
      avatarId: character.avatarId,
    })),
  );
  localStorage.setItem(STORAGE_KEY, payload);
  cachedRaw = payload;
  cachedCustom = list;
  emit();
}

function readSnapshot(): CustomCharacter[] {
  const raw = localStorage.getItem(STORAGE_KEY) ?? "[]";
  if (raw === cachedRaw) return cachedCustom;
  cachedRaw = raw;
  cachedCustom = parseList(raw);
  return cachedCustom;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) emit();
  });
}

export function useCustomCharacters(): CustomCharacter[] {
  return useSyncExternalStore(subscribe, readSnapshot, () => cachedCustom);
}

export function useAllCharacters(): Character[] {
  const custom = useCustomCharacters();
  return useMemo(() => [...CHARACTERS, ...custom], [custom]);
}

function normalizeDraft(
  draft: CustomCharacterDraft,
): CustomCharacterDraft | undefined {
  if (characterDraftError(draft) !== undefined) return undefined;
  return trimmedDraft(draft);
}

export function addCustomCharacter(
  draft: CustomCharacterDraft,
): CustomCharacter | undefined {
  const fields = normalizeDraft(draft);
  if (fields === undefined) return undefined;
  const character: CustomCharacter = {
    kind: "custom",
    id: `custom-${crypto.randomUUID()}`,
    name: fields.name,
    blurb: fields.blurb,
    systemPrompt: fields.systemPrompt,
    avatarId: fields.avatarId,
    avatar: customAvatarUrl(fields.avatarId),
  };
  persist([...readSnapshot(), character]);
  return character;
}

export function updateCustomCharacter(input: {
  id: string;
  draft: CustomCharacterDraft;
}): CustomCharacter | undefined {
  const fields = normalizeDraft(input.draft);
  if (fields === undefined) return undefined;
  const current = readSnapshot();
  const index = current.findIndex((character) => character.id === input.id);
  if (index === -1) return undefined;
  const next: CustomCharacter = {
    kind: "custom",
    id: input.id,
    name: fields.name,
    blurb: fields.blurb,
    systemPrompt: fields.systemPrompt,
    avatarId: fields.avatarId,
    avatar: customAvatarUrl(fields.avatarId),
  };
  persist(current.map((character, i) => (i === index ? next : character)));
  return next;
}

export function deleteCustomCharacter(id: string): void {
  persist(readSnapshot().filter((character) => character.id !== id));
}
