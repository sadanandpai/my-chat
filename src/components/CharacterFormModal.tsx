import { useEffect, useId, useRef, useState } from "react";
import {
  CUSTOM_AVATAR_IDS,
  customAvatarUrl,
  type CustomCharacter,
} from "../characters.ts";
import {
  addCustomCharacter,
  CHARACTER_FIELD_LIMITS,
  characterDraftError,
  updateCustomCharacter,
  type CustomCharacterDraft,
} from "../customCharacters.ts";

type OpenMode =
  | { kind: "create" }
  | { kind: "edit"; character: CustomCharacter };

type CharacterFormModalProps = {
  mode: { kind: "closed" } | OpenMode;
  onClose: () => void;
};

const emptyDraft: CustomCharacterDraft = {
  name: "",
  blurb: "",
  systemPrompt: "",
  avatarId: "a",
};

function draftFromCharacter(character: CustomCharacter): CustomCharacterDraft {
  return {
    name: character.name,
    blurb: character.blurb,
    systemPrompt: character.systemPrompt,
    avatarId: character.avatarId,
  };
}

export function CharacterFormModal({ mode, onClose }: CharacterFormModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = mode.kind !== "closed";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog === null) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={dialogRef} className="character-modal" onClose={onClose}>
      {mode.kind === "closed" ? null : (
        <CharacterFormFields
          key={mode.kind === "edit" ? mode.character.id : "create"}
          mode={mode}
          onClose={onClose}
        />
      )}
    </dialog>
  );
}

function CharacterFormFields({
  mode,
  onClose,
}: {
  mode: OpenMode;
  onClose: () => void;
}) {
  const formId = useId();
  const [draft, setDraft] = useState<CustomCharacterDraft>(() =>
    mode.kind === "edit" ? draftFromCharacter(mode.character) : emptyDraft,
  );
  const [error, setError] = useState<string | undefined>(undefined);
  const title = mode.kind === "edit" ? "Edit character" : "Add new character";

  function setField<K extends keyof CustomCharacterDraft>(
    key: K,
    value: CustomCharacterDraft[K],
  ): void {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleSave(): void {
    const saved =
      mode.kind === "create"
        ? addCustomCharacter(draft)
        : updateCustomCharacter({ id: mode.character.id, draft });
    if (saved === undefined) {
      setError(
        characterDraftError(draft) ??
          "Could not save this character. Try again.",
      );
      return;
    }
    onClose();
  }

  return (
    <form
      className="character-modal-form"
      aria-labelledby={`${formId}-title`}
      onSubmit={(event) => {
        event.preventDefault();
        handleSave();
      }}
    >
      <h2 id={`${formId}-title`}>{title}</h2>
      <label className="character-modal-field">
        <span className="character-modal-field-head">
          Name
          <span className="character-modal-field-limit">
            {CHARACTER_FIELD_LIMITS.name.min}–{CHARACTER_FIELD_LIMITS.name.max}
          </span>
        </span>
        <input
          value={draft.name}
          onChange={(event) => {
            setField("name", event.target.value);
          }}
          placeholder="Cynical Detective"
          required
          minLength={CHARACTER_FIELD_LIMITS.name.min}
          maxLength={CHARACTER_FIELD_LIMITS.name.max}
          autoComplete="off"
        />
      </label>
      <label className="character-modal-field">
        <span className="character-modal-field-head">
          Blurb
          <span className="character-modal-field-limit">
            {CHARACTER_FIELD_LIMITS.blurb.min}–{CHARACTER_FIELD_LIMITS.blurb.max}
          </span>
        </span>
        <input
          value={draft.blurb}
          onChange={(event) => {
            setField("blurb", event.target.value);
          }}
          placeholder="Coffee. Case. Doubt."
          required
          minLength={CHARACTER_FIELD_LIMITS.blurb.min}
          maxLength={CHARACTER_FIELD_LIMITS.blurb.max}
          autoComplete="off"
        />
      </label>
      <label className="character-modal-field">
        <span className="character-modal-field-head">
          System prompt
          <span className="character-modal-field-limit">
            {CHARACTER_FIELD_LIMITS.systemPrompt.min}–{CHARACTER_FIELD_LIMITS.systemPrompt.max}
          </span>
        </span>
        <textarea
          value={draft.systemPrompt}
          rows={6}
          onChange={(event) => {
            setField("systemPrompt", event.target.value);
          }}
          placeholder="You are roleplaying as a stock cynical detective. Stay in character. Every reply is one or two sentences. Never mention you are an AI."
          required
          minLength={CHARACTER_FIELD_LIMITS.systemPrompt.min}
          maxLength={CHARACTER_FIELD_LIMITS.systemPrompt.max}
        />
      </label>
      <fieldset className="character-modal-avatars">
        <legend>Avatar</legend>
        <div className="character-modal-avatar-row">
          {CUSTOM_AVATAR_IDS.map((avatarId) => {
            const checked = draft.avatarId === avatarId;
            return (
              <label
                key={avatarId}
                className={
                  checked
                    ? "character-modal-avatar character-modal-avatar-on"
                    : "character-modal-avatar"
                }
              >
                <input
                  type="radio"
                  name={`${formId}-avatar`}
                  checked={checked}
                  onChange={() => {
                    setField("avatarId", avatarId);
                  }}
                />
                <img
                  src={customAvatarUrl(avatarId)}
                  alt={`Avatar ${avatarId}`}
                  width={72}
                  height={72}
                />
              </label>
            );
          })}
        </div>
      </fieldset>
      {error !== undefined ? (
        <p className="character-modal-error">{error}</p>
      ) : null}
      <div className="character-modal-actions">
        <button type="button" className="chat-back" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="discussion-start">
          Save
        </button>
      </div>
    </form>
  );
}
