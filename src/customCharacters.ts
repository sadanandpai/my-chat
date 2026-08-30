import { useMemo, useSyncExternalStore } from "react";
import {
  CHARACTERS,
  customAvatarUrl,
  isCustomAvatarId,
  type Character,
  type CustomAvatarId,
  type CustomCharacter,
} from "./characters.ts";

const STORAGE_KEY = "my-chat.custom-characters";

export type CustomCharacterDraft = {
  name: string;
  blurb: string;
  systemPrompt: string;
  avatarId: CustomAvatarId;
};

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
  if (typeof name !== "string" || name.trim().length === 0) return undefined;
  if (typeof blurb !== "string" || blurb.trim().length === 0) return undefined;
  if (typeof systemPrompt !== "string" || systemPrompt.trim().length === 0) {
    return undefined;
  }
  if (!isCustomAvatarId(avatarId)) return undefined;
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
  const name = draft.name.trim();
  const blurb = draft.blurb.trim();
  const systemPrompt = draft.systemPrompt.trim();
  if (name.length === 0 || blurb.length === 0 || systemPrompt.length === 0) {
    return undefined;
  }
  return { name, blurb, systemPrompt, avatarId: draft.avatarId };
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
